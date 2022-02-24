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
    username varchar not null,
    firstName varchar not null, 
    lastname varchar,
    pwd varchar not null,
    avatar varchar
    );


create table "creator"(
    id serial primary key not null, 
    userID int not null, 
    foreign key (userID) references users (id) on delete cascade on update cascade
    );


create table ratings(
    id serial primary key not null, 
    ratedSummary int not null, 
    rating float not null default 5.0,
    rating_user int not null,
    foreign key (ratedSummary) references summaries (id) on delete cascade on update cascade,
    foreign key (rating_user) references users (id)
    );

create table saccess(
    id serial primary key not null,
    Summary int not null,
    userID int not null,
    foreign key (Summary) references summaries (id) on delete cascade on update cascade,
    foreign key (userID) references users (id) on delete cascade on update cascade
);
create table locations(
    plz varchar primary key not null,
    location_name varchar not null
);

create table schools(
    id serial primary key not null,
    school_name varchar,
    school_plz varchar,
    foreign key (school_plz) references locations (plz) on delete cascade on update cascade
);

create table subjects(
    id serial primary key not null,
    subject_name varchar not null,
    subject_school int,
    subject_year int,
    foreign key (subject_school) references schools (id) on delete cascade on update cascade
);

create table "summaries"(
    id serial primary key not null, 
    Creator int,
    subject_id int, 
    "Date" timestamp with time zone default current_timestamp,
    sumname varchar not null,
    sumfilename varchar not null,
    restricted boolean not null,
    foreign key (Creator) references creator (id) on delete cascade on update cascade,
    foreign key (subject_id) references subjects (id) on delete cascade on update cascade
    );

insert into users (firstname, lastname,username, pwd) values ('Leon', 'Grass', 'LeonG','');
insert into users (firstname, lastname,username, pwd) values ('Pirmin', 'Bothur', 'PirminB','');
insert into creator (userID) values (1);
insert into locations (plz, location_name) values('79576', 'Weil am Rhein');
insert into schools (school_name, school_plz) values ('Kant-Gymnasium', '79576');
insert into subjects (subject_name, subject_school, subject_year) values ('Informatik', 1, 11);
insert into summaries (Creator, subject_id, sumname) values(1, 1, 'firstsummaryever.pdf');
insert into ratings (ratedSummary, rating) values (1, 5);
insert into saccess (Summary, userID) values (1, 2);