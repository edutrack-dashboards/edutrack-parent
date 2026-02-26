-- ================================================
-- EduTrack Parent Auth + RLS Policies
-- ================================================

create extension if not exists "uuid-ossp";

-- Parent account table (maps Supabase auth users to parent identity)
create table if not exists parent_accounts (
  id         uuid primary key default uuid_generate_v4(),
  auth_id    uuid unique not null references auth.users(id) on delete cascade,
  email      text unique not null,
  name       text,
  phone      text,
  created_at timestamptz not null default now()
);

create index if not exists idx_parent_accounts_auth_id on parent_accounts(auth_id);
create index if not exists idx_parent_accounts_email on parent_accounts(email);

alter table parent_accounts enable row level security;

-- ================================================
-- Helper functions
-- ================================================

create or replace function get_my_parent_email()
returns text
language sql
security definer
stable
as $$
  select coalesce(
    (select lower(email) from parent_accounts where auth_id = auth.uid()),
    (select lower(email) from auth.users where id = auth.uid())
  )
$$;

create or replace function get_my_parent_student_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select id
  from students
  where lower(parent_email) = get_my_parent_email()
$$;

create or replace function get_my_parent_class_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select distinct cs.class_id
  from class_students cs
  where cs.student_id in (select * from get_my_parent_student_ids())
$$;

create or replace function get_my_parent_teacher_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select distinct c.teacher_id
  from classes c
  where c.id in (select * from get_my_parent_class_ids())
$$;

-- Parent signup helpers
create or replace function check_parent_invitation(lookup_email text)
returns json
language plpgsql
security definer
as $$
declare
  normalized_email text := lower(trim(lookup_email));
  linked_children_count integer;
  has_account boolean;
begin
  select count(*)
  into linked_children_count
  from students
  where lower(parent_email) = normalized_email;

  select exists(
    select 1
    from parent_accounts
    where lower(email) = normalized_email
  ) into has_account;

  return json_build_object(
    'exists', linked_children_count > 0,
    'has_account', has_account,
    'children_count', linked_children_count
  );
end;
$$;

create or replace function claim_parent_account(parent_email text, user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  normalized_email text := lower(trim(parent_email));
  parent_name_value text;
  parent_phone_value text;
begin
  if normalized_email is null or normalized_email = '' then
    return false;
  end if;

  if not exists (
    select 1
    from students
    where lower(students.parent_email) = normalized_email
  ) then
    return false;
  end if;

  select s.parent_name, s.parent_phone
  into parent_name_value, parent_phone_value
  from students s
  where lower(s.parent_email) = normalized_email
  order by s.enrollment_date desc nulls last, s.created_at desc
  limit 1;

  insert into parent_accounts (auth_id, email, name, phone)
  values (
    user_id,
    normalized_email,
    coalesce(parent_name_value, split_part(normalized_email, '@', 1)),
    parent_phone_value
  )
  on conflict (email)
  do update set
    auth_id = excluded.auth_id,
    name = excluded.name,
    phone = excluded.phone;

  return true;
end;
$$;

-- ================================================
-- Parent account policies
-- ================================================

drop policy if exists "Parents insert own account" on parent_accounts;
create policy "Parents insert own account"
  on parent_accounts for insert
  with check (auth_id = auth.uid());

drop policy if exists "Parents view own account" on parent_accounts;
create policy "Parents view own account"
  on parent_accounts for select
  using (auth_id = auth.uid());

drop policy if exists "Parents update own account" on parent_accounts;
create policy "Parents update own account"
  on parent_accounts for update
  using (auth_id = auth.uid())
  with check (auth_id = auth.uid());

-- ================================================
-- Parent read policies across core school tables
-- ================================================

drop policy if exists "Parents see linked students" on students;
create policy "Parents see linked students"
  on students for select
  using (lower(parent_email) = get_my_parent_email());

drop policy if exists "Parents see linked class enrollments" on class_students;
create policy "Parents see linked class enrollments"
  on class_students for select
  using (student_id in (select * from get_my_parent_student_ids()));

drop policy if exists "Parents see linked classes" on classes;
create policy "Parents see linked classes"
  on classes for select
  using (id in (select * from get_my_parent_class_ids()));

drop policy if exists "Parents see linked teachers" on teachers;
create policy "Parents see linked teachers"
  on teachers for select
  using (id in (select * from get_my_parent_teacher_ids()));

drop policy if exists "Parents see linked attendance" on attendance_records;
create policy "Parents see linked attendance"
  on attendance_records for select
  using (student_id in (select * from get_my_parent_student_ids()));

drop policy if exists "Parents see linked exams" on exams;
create policy "Parents see linked exams"
  on exams for select
  using (class_id in (select * from get_my_parent_class_ids()));

drop policy if exists "Parents see linked published grades" on grade_entries;
create policy "Parents see linked published grades"
  on grade_entries for select
  using (
    student_id in (select * from get_my_parent_student_ids())
    and is_published = true
  );

drop policy if exists "Parents see linked schedules" on schedule_items;
create policy "Parents see linked schedules"
  on schedule_items for select
  using (class_id in (select * from get_my_parent_class_ids()));
