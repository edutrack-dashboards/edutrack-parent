-- ================================================
-- Parent Messaging: column addition + RLS policies
-- ================================================

-- Add parent read-tracking column
alter table messages
  add column if not exists is_read_parent boolean not null default false;

-- ================================================
-- Parent policies on messages
-- ================================================

drop policy if exists "Parents see messages about their children" on messages;
create policy "Parents see messages about their children"
  on messages for select
  using (student_id in (select * from get_my_parent_student_ids()));

drop policy if exists "Parents create messages about their children" on messages;
create policy "Parents create messages about their children"
  on messages for insert
  with check (student_id in (select * from get_my_parent_student_ids()));

drop policy if exists "Parents update messages about their children" on messages;
create policy "Parents update messages about their children"
  on messages for update
  using (student_id in (select * from get_my_parent_student_ids()));

-- ================================================
-- Parent policies on message_items
-- ================================================

drop policy if exists "Parents see message items for their children" on message_items;
create policy "Parents see message items for their children"
  on message_items for select
  using (
    message_id in (
      select id from messages
      where student_id in (select * from get_my_parent_student_ids())
    )
  );

drop policy if exists "Parents insert message items for their children" on message_items;
create policy "Parents insert message items for their children"
  on message_items for insert
  with check (
    message_id in (
      select id from messages
      where student_id in (select * from get_my_parent_student_ids())
    )
  );
