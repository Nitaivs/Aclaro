DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Process;
DROP TABLE IF EXISTS Task;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS Employee_roles;
DROP TABLE IF EXISTS Employee_skills;
DROP TABLE IF EXISTS Affiliation;
DROP TABLE IF EXISTS Company_Profile;
DROP TABLE IF EXISTS Employee_Profile;
DROP TABLE IF EXISTS Employee_affiliation;
DROP TABLE IF EXISTS Task_skills;
DROP TABLE IF EXISTS Task_employees;
DROP TABLE IF EXISTS Task_roles;
DROP TABLE IF EXISTS Task_statuses;
DROP TABLE IF EXISTS Statuses;
CREATE TABLE Employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
);
CREATE TABLE Process (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    details TEXT,
);
CREATE TABLE Task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    process_id INT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (process_id) REFERENCES Process(id)
);
CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
);
CREATE TABLE Skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
);
CREATE TABLE Employee_roles (
    role_id INT NOT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY (role_id, employee_id),
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Employee_skills (
    skill_id INT NOT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY (skill_id, employee_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Affiliation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(100) NOT NULL,
);
-- I feel like this could be rethunked a bit.--
CREATE TABLE Company_Profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    affiliation_id INT,
    title VARCHAR(100),
    content TEXT,
    FOREIGN KEY (affiliation_id) REFERENCES Affiliation(id)
);
-- Should there be a company profile created immediately when an affiliation is created? --
CREATE TABLE Employee_Profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    title VARCHAR(100),
    content TEXT,
    FOREIGN KEY (employee_id) REFERENCES Employee(id)
);
-- Same thing hyere about employee profile creation --
CREATE TABLE Employee_affiliation (
    employee_id INT NOT NULL,
    affiliation_id INT NOT NULL,
    PRIMARY KEY (employee_id, affiliation_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (affiliation_id) REFERENCES Affiliation(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Task_skills (
    task_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (task_id, skill_id),
    FOREIGN KEY (task_id) REFERENCES Task(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Task_employees (
    task_id INT NOT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY (task_id, employee_id),
    FOREIGN KEY (task_id) REFERENCES Task(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Task_roles (
    task_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (task_id, role_id),
    FOREIGN KEY (task_id) REFERENCES Task(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
);
CREATE TABLE Task_statuses (
    task_id INT NOT NULL,
    status_id INT NOT NULL,
    PRIMARY KEY (task_id, status_id),
    FOREIGN KEY (task_id) REFERENCES Task(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (status_id) REFERENCES Statuses(id) ON DELETE CASCADE ON UPDATE CASCADE
);