create table if not exists users (
    id int(11) NOT NULL AUTO_INCREMENT,
    idName text,
    userName text,
    avatar text,
    budget int(11),
    password text,
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp,
    primary key (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;