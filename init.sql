-- database & account creation
-- CREATE DATABASE testdb;
-- CREATE USER 'amg0'@'localhost' IDENTIFIED BY 'Clem0tine';
-- GRANT ALL PRIVILEGES ON testdb.* TO 'amg0'@'localhost';
-- FLUSH PRIVILEGES;

USE altuiboxdb;
SET sql_mode='STRICT_ALL_TABLES';
-- also set in /etc/mysql/my.conf file   sql-mode=STRICT_ALL_TABLES

DROP TABLE  IF EXISTS rooms;

CREATE TABLE rooms (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO rooms (id, name) VALUES
(1, 'Salon'),
(2, 'Cuisine');


DROP TABLE  IF EXISTS devices;

CREATE TABLE devices (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO devices (id, name) VALUES
(1, 'Prise toto');
