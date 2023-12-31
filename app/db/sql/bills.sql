CREATE TABLE IF NOT EXISTS bills (
   id INT(11) NOT NULL AUTO_INCREMENT,
   userId INT(11),
   cash DOUBLE,
   type INT,
   date DATE,
   remark TEXT,
   createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;