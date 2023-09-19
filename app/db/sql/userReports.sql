create table if not exists userReports (
    id int(11) NOT NULL AUTO_INCREMENT,
    userId int(11),
    reportDate date,
    createAt timestamp default current_timestamp,
    updateAt timestamp default current_timestamp,
    primary key (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;