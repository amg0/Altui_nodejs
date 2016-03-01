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


DROP TABLE  IF EXISTS devicetypes;

CREATE TABLE devicetypes (
  id int unsigned NOT NULL AUTO_INCREMENT,
  device_type varchar(200) NOT NULL,
  nodemodule varchar(50) NOT NULL,
  device_file varchar(50) NOT NULL,
  device_json varchar(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO devicetypes (id, device_type, nodemodule, device_file, device_json) VALUES
(1, 'urn:schemas-upnp-org:device:altui:1','altui','D_ALTUI.xml','D_ALTUI_UI7.json'),
(2, 'urn:schemas-micasaverde-com:device:TemperatureSensor:1','','D_TemperatureSensor1.xml','D_TemperatureSensor1.json'),
(3, 'urn:schemas-upnp-org:device:BinaryLight:1','','D_BinaryLight1.xml','D_BinaryLight1.json');

DROP TABLE  IF EXISTS devices;

CREATE TABLE devices (
  id int unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  device_type varchar(200) NOT NULL,
  category_num int unsigned,
  room int unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO devices (id, name, device_type, category_num, room) VALUES
(1, 'ALTUI' ,'urn:schemas-upnp-org:device:altui:1',NULL,0),
(2, 'Temp toto' ,'urn:schemas-micasaverde-com:device:TemperatureSensor:1',17,1),
(3, 'Prise Sapin' ,'urn:schemas-upnp-org:device:BinaryLight:1',3,2);

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
(1, 1, 'urn:upnp-org:serviceId:altui1' ,'Debug', 0),
(2, 2, 'urn:upnp-org:serviceId:TemperatureSensor1' ,'CurrentTemperature', 15),
(3, 3, 'urn:upnp-org:serviceId:SwitchPower1' ,'Target', 1),
(4, 3, 'urn:upnp-org:serviceId:SwitchPower1' ,'Status', 1);

DROP TABLE  IF EXISTS actions;

CREATE TABLE actions (
  id int unsigned NOT NULL AUTO_INCREMENT,
  deviceid int unsigned NOT NULL,
  service varchar(200) NOT NULL,
  action varchar(200) NOT NULL,
  params varchar(200) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO actions (id, deviceid, service, action, params ) VALUES
(1, 1, 'urn:upnp-org:serviceId:altui1' ,'SetDebug', '{ newDebugMode:"" }' );

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




