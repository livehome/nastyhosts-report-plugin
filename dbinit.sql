drop table reports cascade;
drop table reported_ips cascade;
drop function addReport(var_ip inet, var_reporter inet, var_comment text);

create table reported_ips (
  id bigserial primary key,
  ip inet unique,
  reports_count int4 default 0
);

create table reports (
  id bigserial,
  ip_id int4 references reported_ips(id),
  reporter inet,
  comment text,
  timestamp timestamp with time zone default now()
);

create function addReport(var_ip inet, var_reporter inet, var_comment text) returns void as
$$
begin
  begin
    insert into reported_ips(ip) values (var_ip);
  exception when unique_violation then
    -- do nothing
  end;

  insert into reports(ip_id, reporter, comment) values ((select id from reported_ips where reported_ips.ip = var_ip), var_reporter, var_comment);
  update reported_ips set reports_count = reports_count + 1 where ip = var_ip;
end;
$$
language plpgsql;

