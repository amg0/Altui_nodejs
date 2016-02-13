-- database & account creation
-- CREATE DATABASE testdb;
-- CREATE USER 'amg0'@'localhost' IDENTIFIED BY 'Clem0tine';
-- GRANT ALL PRIVILEGES ON testdb.* TO 'amg0'@'localhost';
-- FLUSH PRIVILEGES;

USE altuiboxdb;
SET sql_mode='STRICT_ALL_TABLES';
SET GLOBAL sql_mode = 'ANSI';

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
  device_type varchar(200) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO devices (id, name, device_type) VALUES
(1, 'ALTUI' ,'urn:schemas-upnp-org:device:altui:1'),
(2, 'Temp toto' ,'urn:schemas-micasaverde-com:device:TemperatureSensor:1'),
(3, 'Prise Sapin' ,'urn:schemas-upnp-org:device:BinaryLight:1');

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
(1,'Audio/Video'),
(2,'Camera'),
(3,'Dimmable Switch'),
(4,'Humidity Sensor'),
(5,'Light Sensor'),
(6,'On/Off Switch'),
(7,'Remote'),
(8,'Scene Controller'),
(9,'Sensor'),
(10,'Temperature Sensor'),
(11,'Window covering');




