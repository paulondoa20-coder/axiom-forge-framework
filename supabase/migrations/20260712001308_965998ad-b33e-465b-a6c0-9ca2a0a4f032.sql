
-- 1) Conversations: add conversation_type
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS conversation_type text NOT NULL DEFAULT 'DIRECT'
    CHECK (conversation_type IN ('DIRECT','GROUP','ORGANIZATION'));

-- 2) Rename conversation_participants -> conversation_members and add role
ALTER TABLE public.conversation_participants RENAME TO conversation_members;
ALTER TABLE public.conversation_members
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'MEMBER'
    CHECK (role IN ('OWNER','ADMIN','MEMBER'));

-- 3) Recreate helper function to point at new table
CREATE OR REPLACE FUNCTION private.is_conversation_member(_conversation_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = _conversation_id AND user_id = _user_id); $$;

-- Keep old function as alias for backwards compat until callers migrate
CREATE OR REPLACE FUNCTION private.is_conversation_participant(_conversation_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT private.is_conversation_member(_conversation_id, _user_id); $$;

-- 4) Drop old policies (they still reference old names/qual) and recreate
DROP POLICY IF EXISTS "Users can view their participations" ON public.conversation_members;
DROP POLICY IF EXISTS "Users can leave conversations" ON public.conversation_members;
DROP POLICY IF EXISTS "Participants add members or creator seeds" ON public.conversation_members;

CREATE POLICY "Members can view their memberships"
  ON public.conversation_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.is_conversation_member(conversation_id, auth.uid()));

CREATE POLICY "Members can leave conversations"
  ON public.conversation_members FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Members add other members or creator seeds"
  ON public.conversation_members FOR INSERT TO authenticated
  WITH CHECK (
    private.is_conversation_member(conversation_id, auth.uid())
    OR (user_id = auth.uid() AND NOT EXISTS (
      SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = conversation_members.conversation_id
    ))
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_members TO authenticated;
GRANT ALL ON public.conversation_members TO service_role;

-- 5) Messages: add offline-first fields
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS client_message_id uuid,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'SENT'
    CHECK (status IN ('PENDING','SENT','DELIVERED','READ','FAILED')),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS messages_conv_client_msg_uniq
  ON public.messages (conversation_id, client_message_id)
  WHERE client_message_id IS NOT NULL;

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
