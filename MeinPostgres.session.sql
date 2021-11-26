-- @block createDatabase
-- https://www.postgresql.org/docs/13/sql-createdatabase.html
create database summaries;

-- @block createUser
-- https://www.postgresql.org/docs/13/sql-createuser.html
create user leongrass password 'w1rch4tt3npr1v4t';
--https://www.postgresql.org/docs/13/sql-grant.html
grant all privileges on database summaries to leongrass;

-- @block createTables
create table "users"(
    id serial primary key not null,
    firstName varchar not null, 
    name varchar,
    avatar varchar
    );


create table "creator"(
    id serial primary key not null, 
    userID int not null, 
    SAmount int,
    foreign key (userID) references users (id) on delete cascade on update cascade
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
    rating float not null default 5.0,
    foreign key (ratedSummary) references summaries (id) on delete cascade on update cascade
    );

create table SAccess(
    id serial primary key not null,
    Summary int not null,
    userID int not null,
    foreign key (Summary) references summaries (id) on delete cascade on update cascade,
    foreign key (userID) references users (id) on delete cascade on update cascade
);

insert into users (firstName, name) values ('Leon', 'Grass');
insert into users (firstName, name) values ('Pirmin', 'Bothur');
insert into creator (userID, SAmount) values (1,0);
insert into summaries (Creator, sumname, "Subject") values(1, 'firstsummaryever.pdf', 'Informatics');
insert into ratings (ratedSummary, rating) values (1, 5);
insert into saccess (Summary, userID) values (1, 2);