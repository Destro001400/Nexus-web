create or replace function feedback_by_type()
returns table (
    like_count bigint,
    dislike_count bigint
)
language plpgsql
security definer
as $$
begin
    return query
    select 
        count(*) filter (where type = 'like') as like_count,
        count(*) filter (where type = 'dislike') as dislike_count
    from feedback
    where created_at >= current_date - interval '30 days';
end;
$$;