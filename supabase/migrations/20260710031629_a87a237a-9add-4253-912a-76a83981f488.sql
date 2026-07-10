
-- 1) Private schema for internal helpers (not exposed via PostgREST)
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role); $$;

CREATE OR REPLACE FUNCTION private.is_conversation_participant(_conversation_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = _conversation_id AND user_id = _user_id); $$;

GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_conversation_participant(uuid, uuid) TO authenticated, service_role;

-- 2) Rewire RLS policies to private schema helpers
DROP POLICY IF EXISTS "Participants can update their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Participants can view their conversations" ON public.conversations;
CREATE POLICY "Participants can update their conversations" ON public.conversations
  FOR UPDATE TO authenticated USING (private.is_conversation_participant(id, auth.uid()));
CREATE POLICY "Participants can view their conversations" ON public.conversations
  FOR SELECT TO authenticated USING (private.is_conversation_participant(id, auth.uid()));

-- 3) Fix conv_open_join: no more free self-join into arbitrary conversations
DROP POLICY IF EXISTS "Users can add themselves to conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view their participations" ON public.conversation_participants;
CREATE POLICY "Users can view their participations" ON public.conversation_participants
  FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Participants add members or creator seeds" ON public.conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    private.is_conversation_participant(conversation_id, auth.uid())
    OR (
      user_id = auth.uid()
      AND NOT EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = conversation_participants.conversation_id
      )
    )
  );

DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK ((sender_id = auth.uid()) AND private.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT TO authenticated
  USING (private.is_conversation_participant(conversation_id, auth.uid()));

-- 4) Fix trust_self_verify: users can only edit their pending verification and cannot promote status
DROP POLICY IF EXISTS "Users can view their own verifications" ON public.trust_verifications;
DROP POLICY IF EXISTS "Users can update their own pending verifications" ON public.trust_verifications;
CREATE POLICY "Users can view their own verifications" ON public.trust_verifications
  FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.has_role(auth.uid(), 'moderator'::public.app_role) OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users can update their own pending verifications" ON public.trust_verifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending'::public.verification_status)
  WITH CHECK (user_id = auth.uid() AND status = 'pending'::public.verification_status);

-- 5) Drop the public-schema copies of the helpers (were callable via PostgREST)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_conversation_participant(uuid, uuid);

-- 6) Phone privacy: move phone out of profiles into an owner-only table
CREATE TABLE IF NOT EXISTS public.profile_contacts (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_contacts TO authenticated;
GRANT ALL ON public.profile_contacts TO service_role;
ALTER TABLE public.profile_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can view own contact info" ON public.profile_contacts
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Owner can insert own contact info" ON public.profile_contacts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner can update own contact info" ON public.profile_contacts
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner can delete own contact info" ON public.profile_contacts
  FOR DELETE TO authenticated USING (user_id = auth.uid());

INSERT INTO public.profile_contacts (user_id, phone)
SELECT id, phone FROM public.profiles WHERE phone IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- 7) Update signup trigger to write phone into the private contacts table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.profile_contacts (user_id, phone) VALUES (NEW.id, NEW.phone);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END; $$;
