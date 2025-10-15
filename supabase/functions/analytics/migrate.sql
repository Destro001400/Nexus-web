-- migrate.sql
\i 'functions/analytics/conversations_by_day.sql'
\i 'functions/analytics/feedback_by_type.sql'
\i 'functions/analytics/top_active_users.sql'

-- Permissões RLS (Row Level Security)
alter function conversations_by_day() set rls_enabled = false;
alter function feedback_by_type() set rls_enabled = false;
alter function top_active_users() set rls_enabled = false;