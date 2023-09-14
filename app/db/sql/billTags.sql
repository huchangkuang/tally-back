create table if not exists billTags (
     id int(11) NOT NULL AUTO_INCREMENT,
     billId int(11),
     tagId int(11),
     createAt timestamp default current_timestamp,
     updateAt timestamp default current_timestamp,
     primary key (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;