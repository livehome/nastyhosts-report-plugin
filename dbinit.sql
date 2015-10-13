drop table reports cascade;
drop table reported_ips cascade;
drop function add_report(var_ip inet, var_reporter inet, var_comment text);
drop function update_ips_table();

create table reported_ips (
  id bigserial primary key,
  ip inet unique,
  reports_count int4 default 0,
  last_reported timestamp with time zone default now()
);

create table reports (
  id bigserial,
  ip_id int8 references reported_ips(id) on delete cascade on update cascade,
  reporter inet,
  comment text,
  timestamp timestamp with time zone default now()
);

create function add_report(var_ip inet, var_reporter inet, var_comment text) returns void as
$$
begin
  begin
    insert into reported_ips(ip) values (var_ip);
  exception when unique_violation then
    -- do nothing
  end;

  insert into reports(ip_id, reporter, comment) values ((select id from reported_ips where reported_ips.ip = var_ip), var_reporter, var_comment);
end;
$$
language plpgsql;

create function update_ips_table() returns trigger as
$$
begin
  update reported_ips set reports_count = reports_count + 1, last_reported = NEW.timestamp where id = NEW.ip_id;
  return null;
end
$$
language plpgsql;

create trigger update_ips_on_report
after insert on reports for each row execute procedure update_ips_table();
