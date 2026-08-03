DROP FUNCTION IF EXISTS public.log_audit_event(text, text, text, jsonb);

CREATE OR REPLACE FUNCTION private.log_audit_event(
  _actor_id uuid,
  _action text,
  _entity_type text,
  _entity_id text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  VALUES (_actor_id, _action, _entity_type, _entity_id, coalesce(_metadata, '{}'::jsonb))
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

REVOKE ALL ON FUNCTION private.log_audit_event(uuid, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.log_audit_event(uuid, text, text, text, jsonb) TO service_role;