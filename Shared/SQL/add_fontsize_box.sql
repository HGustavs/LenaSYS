use imperious;

/* Add column fontsize to box with the datatype tinyint and default value 9 (px) */
ALTER TABLE `box` ADD `fontsize` TINYINT NOT NULL DEFAULT '9' AFTER `filename`;