-- 1) Conversations: track creator
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS created_by uuid NOT NULL DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS conversations_created_by_idx ON public.conversations(created_by);

DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE OR REPLACE FUNCTION private.is_conversation_creator(_conversation_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = _conversation_id AND c.created_by = _user_id
  )
$$;
REVOKE ALL ON FUNCTION private.is_conversation_creator(uuid, uuid) FROM PUBLIC, anon, authenticated;

-- 2) conversation_members: only the conversation creator may add members
DROP POLICY IF EXISTS "Members add other members or creator seeds" ON public.conversation_members;
CREATE POLICY "Only conversation creator can add members"
  ON public.conversation_members FOR INSERT TO authenticated
  WITH CHECK (private.is_conversation_creator(conversation_id, auth.uid()));

-- 3) trust_verifications: users cannot self-approve
DROP POLICY IF EXISTS "Users can update their own pending verifications" ON public.trust_verifications;
CREATE POLICY "Users can update evidence on their pending verifications"
  ON public.trust_verifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending'::verification_status)
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'::verification_status
    AND verified_at IS NULL
  );

CREATE POLICY "Moderators can review verifications"
  ON public.trust_verifications FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'moderator'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'moderator'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role));