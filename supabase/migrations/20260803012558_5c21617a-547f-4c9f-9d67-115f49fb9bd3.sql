-- ============ P2-01 : audit_logs ============
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (actor_id = auth.uid());

CREATE POLICY "Admins read all audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.log_audit_event(
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
  VALUES (auth.uid(), _action, _entity_type, _entity_id, coalesce(_metadata, '{}'::jsonb))
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

REVOKE ALL ON FUNCTION public.log_audit_event(text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) TO authenticated, service_role;

-- ============ P2-02 : tables de synchronisation ============
CREATE TYPE public.sync_op_status AS ENUM ('pending', 'applied', 'failed', 'conflict');
CREATE TYPE public.sync_op_action AS ENUM ('create', 'update', 'delete');

CREATE TABLE public.sync_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  device_id text NOT NULL,
  client_op_id text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  action public.sync_op_action NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.sync_op_status NOT NULL DEFAULT 'pending',
  error text,
  applied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sync_operations_client_op_unique UNIQUE (user_id, device_id, client_op_id)
);

CREATE INDEX idx_sync_operations_user_id ON public.sync_operations (user_id);
CREATE INDEX idx_sync_operations_status ON public.sync_operations (user_id, status);
CREATE INDEX idx_sync_operations_entity ON public.sync_operations (entity_type, entity_id);

GRANT SELECT, INSERT, UPDATE ON public.sync_operations TO authenticated;
GRANT ALL ON public.sync_operations TO service_role;

ALTER TABLE public.sync_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own sync operations"
  ON public.sync_operations FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own sync operations"
  ON public.sync_operations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own sync operations"
  ON public.sync_operations FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.sync_checkpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  device_id text NOT NULL,
  entity_type text NOT NULL,
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  cursor text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sync_checkpoints_unique UNIQUE (user_id, device_id, entity_type)
);

CREATE INDEX idx_sync_checkpoints_user_id ON public.sync_checkpoints (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_checkpoints TO authenticated;
GRANT ALL ON public.sync_checkpoints TO service_role;

ALTER TABLE public.sync_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sync checkpoints"
  ON public.sync_checkpoints FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.sync_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  operation_id uuid REFERENCES public.sync_operations(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id text,
  local_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  server_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  strategy text,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sync_conflicts_user_id ON public.sync_conflicts (user_id);
CREATE INDEX idx_sync_conflicts_operation_id ON public.sync_conflicts (operation_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_conflicts TO authenticated;
GRANT ALL ON public.sync_conflicts TO service_role;

ALTER TABLE public.sync_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sync conflicts"
  ON public.sync_conflicts FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER update_sync_operations_updated_at
  BEFORE UPDATE ON public.sync_operations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sync_checkpoints_updated_at
  BEFORE UPDATE ON public.sync_checkpoints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sync_conflicts_updated_at
  BEFORE UPDATE ON public.sync_conflicts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();