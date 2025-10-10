create or replace function top_active_users()
returns table (
    user_id uuid,
    email text,
    count bigint
)
language plpgsql
security definer
as $$
begin
    return query
    select 
        p.id as user_id,
        p.email,
        count(c.*) as count
    from profiles p
    left join conversations c on c.user_id = p.id
    where c.created_at >= current_date - interval '30 days'
    group by p.id, p.email
    order by count desc
    limit 10;
end;
$$;