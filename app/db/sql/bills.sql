create table if not exists bills (
   id int(11) NOT NULL AUTO_INCREMENT,
   userId int(11),
   cash double,
   type int,
   remark text,
   createAt timestamp default current_timestamp,
   updateAt timestamp default current_timestamp,
   primary key (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;