-- migrate.sql
\i 'functions/analytics/conversations_by_day.sql'
\i 'functions/analytics/feedback_by_type.sql'
\i 'functions/analytics/top_active_users.sql'

-- Permissões RLS (Row Level Security)
alter function conversations_by_day() set rls_enabled = false;
alter function feedback_by_type() set rls_enabled = false;
alter function top_active_users() set rls_enabled = false;

-- Garantir que apenas admin pode executar
revoke execute on function conversations_by_day() from public;
revoke execute on function feedback_by_type() from public;
revoke execute on function top_active_users() from public;

grant execute on function conversations_by_day() to authenticated;
grant execute on function feedback_by_type() to authenticated;
grant execute on function top_active_users() to authenticated;