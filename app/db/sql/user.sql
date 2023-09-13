create table if not exists user (
    idName text,
    userName text,
    password text,
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;