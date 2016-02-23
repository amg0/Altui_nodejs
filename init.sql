-- database & account creation
-- CREATE DATABASE testdb;
-- CREATE USER 'amg0'@'localhost' IDENTIFIED BY 'Clem0tine';
-- GRANT ALL PRIVILEGES ON testdb.* TO 'amg0'@'localhost';
-- FLUSH PRIVILEGES;

USE altuiboxdb;
SET sql_mode='STRICT_ALL_TABLES';
SET GLOBAL sql_mode = 'ANSI';

-- also set in /etc/mysql/my.conf file   sql-mode=STRICT_ALL_TABLES
DROP TABLE  IF EXISTS variables;

CREATE TABLE variables (
  id varchar(50) NOT NULL,
  `value` varchar(200) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO variables (id, value) VALUES
('Mode','1');

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
  device_type varchar(200) NOT NULL,
  category_num int unsigned,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO devices (id, name, device_type, category_num) VALUES
(1, 'ALTUI' ,'urn:schemas-upnp-org:device:altui:1',NULL),
(2, 'Temp toto' ,'urn:schemas-micasaverde-com:device:TemperatureSensor:1',17),
(3, 'Prise Sapin' ,'urn:schemas-upnp-org:device:BinaryLight:1',3);

DROP TABLE  IF EXISTS states;

CREATE TABLE states (
  id int unsigned NOT NULL AUTO_INCREMENT,
  deviceid int unsigned NOT NULL,
  service varchar(200) NOT NULL,
  `variable` varchar(50) NOT NULL,	-- backquote for escping reserved names
  `value` varchar(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO states (id, deviceid, service, `variable`, `value` ) VALUES
(1, 2, 'urn:upnp-org:serviceId:TemperatureSensor1' ,'CurrentTemperature', 15),
(2, 3, 'urn:upnp-org:serviceId:SwitchPower1' ,'Target', 1),
(3, 3, 'urn:upnp-org:serviceId:SwitchPower1' ,'Status', 1);


DROP TABLE  IF EXISTS scenes;

CREATE TABLE scenes (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO scenes (id, name) VALUES
(1, 'Premiere Scene'),
(2, 'Deuxieme Scene');

DROP TABLE  IF EXISTS categories;

CREATE TABLE categories (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO categories (id, name) VALUES
(1,'Interface'),
(2,'Dimmable Switch'),
(3,'On/Off Switch'),
(4,'Sensor'),
(5,'HVAC'),
(6,'Camera'),
(7,'Door Lock'),
(8,'Window covering'),
(9,'Remote'),
(10,'IR Transmitter'),
(14,'Scene Controller'),
(15,'Audio/Video'),
(16,'Humidity Sensor'),
(17,'Temperature Sensor'),
(18,'Light Sensor'),
(21,'Power Meter'),
(22,'Alarm Panel'),
(23,'Alarm Partition'),
(24,'Siren'),
(25,'Weather'),
(26,'Philips Controller');




