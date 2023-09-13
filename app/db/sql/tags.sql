create table if not exists tags (
   id int(11) NOT NULL AUTO_INCREMENT,
   name text,
   createAt timestamp default current_timestamp,
   updateAt timestamp default current_timestamp,
   primary key (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;