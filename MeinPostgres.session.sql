-- @block createDatabase
-- https://www.postgresql.org/docs/13/sql-createdatabase.html
create database summaries;

-- @block createUser
-- https://www.postgresql.org/docs/13/sql-createuser.html
create user leongrass password 'w1rch4tt3npr1v4t';
--https://www.postgresql.org/docs/13/sql-grant.html
grant all privileges on database summaries to leongrass;

-- @block createTables
create table "user"(
    mail varchar primary key not null,
    firstName varchar not null, 
    name varchar);


create table "creator"(
    id serial primary key not null, 
    "User" varchar not null, 
    SAmount int,
    foreign key ("User") references "user" (mail) on delete cascade on update cascade
    );

create table "summaries"(
    id serial primary key not null, 
    Creator int,
    "Subject" varchar, 
    "Date" timestamp with time zone default current_timestamp,
    sumname varchar not null,
    foreign key (Creator) references creator (id) on delete cascade on update cascade
    );

create table ratings(
    id serial primary key not null, 
    ratedSummary int not null, 
    rating int not null default 5,
    foreign key (ratedSummary) references summaries (id) on delete cascade on update cascade
    );

create table SAccess(
    id serial primary key not null,
    Summary int not null,
    userMail varchar not null,
    foreign key (Summary) references summaries (id) on delete cascade on update cascade,
    foreign key (userMail) references "user" (mail) on delete cascade on update cascade
);

insert into "user" (mail, firstName, name) values ('leon.grass@gmx.net', 'Leon', 'Grass');
insert into "user" (mail, firstName, name) values ('bothurpirmin@gmail.com', 'Pirmin', 'Bothur');
insert into creator ("User", SAmount) values ('leon.grass@gmx.net',0);
insert into summaries (Creator, sumname, "Subject") values(1, 'firstsummaryever.pdf', 'Informatics');
insert into ratings (ratedSummary, rating) values (1, 5);
insert into SAccess (Summary, userMail) values (1, 'bothurpirmin@gmail.com');