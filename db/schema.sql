-- Drops the humanResource_db if it exists currently --
DROP DATABASE IF EXISTS humanResource_db;
-- Creates the humanResource_db database --
CREATE DATABASE humanResource_db;

-- use humanResource_db database --
USE humanResource_db;


-- Creates the table "department" that exist for a business within humanResource_db --
CREATE TABLE department (
  -- Creates a numeric column called "id" --
  id INT NOT NULL AUTO_INCREMENT,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(30) NOT NULL,
  validFromDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  validToDate DATETIME DEFAULT '99991231' NOT NULL,
  PRIMARY KEY (id)
);

-- Creates the table "roles" that an employee can have within humanResource_db --

CREATE TABLE role (
  -- Creates a numeric column called "id" --
  id INT NOT NULL AUTO_INCREMENT,
  -- Makes a string column called "name" which cannot contain null --
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  validFromDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  validToDate DATETIME DEFAULT '99991231' NOT NULL,
  FOREIGN KEY (department_id) 
    REFERENCES department(id)
    ON DELETE SET NULL,
  PRIMARY KEY (id)
);

-- Creates the table "employee" that contains the personal info of people working at the business within humanResource_db --

CREATE TABLE employee (
  -- Creates a numeric column called "id" --
  id INT NOT NULL AUTO_INCREMENT,
  -- Makes a string column called "name" which cannot contain null --
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) 
    REFERENCES role(id)
    ON DELETE SET NULL,
  PRIMARY KEY (id)
);