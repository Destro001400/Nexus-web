create or replace function conversations_by_day()
returns table (
    day date,
    count bigint
)
language plpgsql
security definer
as $$
begin
    return query
    select 
        date_trunc('day', created_at)::date as day,
        count(*) as count
    from conversations
    where created_at >= current_date - interval '30 days'
    group by date_trunc('day', created_at)
    order by day desc
    limit 30;
end;
$$;