-- Flyway V1: Initial schema based on JPA entities

-- Employee
CREATE TABLE IF NOT EXISTS employee (
    employee_id BIGINT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role_id BIGINT NULL,
    PRIMARY KEY (employee_id)
);

-- Employee Profile (1:1)
CREATE TABLE IF NOT EXISTS employee_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(2000),
    employee_id BIGINT NOT NULL,
    CONSTRAINT UK_employee_profile_employee UNIQUE (employee_id)
);

-- EmployeeSkill
CREATE TABLE IF NOT EXISTS employee_skill (
    skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(40) NOT NULL
);

-- Employee <-> EmployeeSkill (Many-to-Many)
CREATE TABLE IF NOT EXISTS employee_skills_mapping (
    employee_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (employee_id, skill_id)
);

-- Role
CREATE TABLE IF NOT EXISTS role (
    role_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    CONSTRAINT UK_role_name UNIQUE (role_name)
);

-- Privilege
CREATE TABLE IF NOT EXISTS privilege (
    privilege_id BIGINT AUTO_INCREMENT PRIMARY KEY
);

-- Role <-> Privilege (Many-to-Many)
CREATE TABLE IF NOT EXISTS role_privileges (
    role_id BIGINT NOT NULL,
    privilege_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, privilege_id)
);

-- ProcessEntity
CREATE TABLE IF NOT EXISTS process_entity (
    process_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    process_name VARCHAR(255) NOT NULL
);

-- Task
CREATE TABLE IF NOT EXISTS task (
    task_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    is_completed BOOLEAN NOT NULL,
    task_description VARCHAR(1000),
    task_name VARCHAR(255) NOT NULL,
    process_id BIGINT NOT NULL
);

-- Task assignees (Many-to-Many Task <-> Employee)
CREATE TABLE IF NOT EXISTS task_assignees (
    task_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    PRIMARY KEY (task_id, employee_id)
);

-- FKs and constraints
ALTER TABLE employee
    ADD CONSTRAINT FK_employee_role
    FOREIGN KEY (role_id) REFERENCES role(role_id);

ALTER TABLE employee_profile
    ADD CONSTRAINT FK_employee_profile_employee
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id);

ALTER TABLE employee_skills_mapping
    ADD CONSTRAINT FK_emp_skill_skill
    FOREIGN KEY (skill_id) REFERENCES employee_skill(skill_id);

ALTER TABLE employee_skills_mapping
    ADD CONSTRAINT FK_emp_skill_employee
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id);

ALTER TABLE role_privileges
    ADD CONSTRAINT FK_role_priv_priv
    FOREIGN KEY (privilege_id) REFERENCES privilege(privilege_id);

ALTER TABLE role_privileges
    ADD CONSTRAINT FK_role_priv_role
    FOREIGN KEY (role_id) REFERENCES role(role_id);

ALTER TABLE task_assignees
    ADD CONSTRAINT FK_task_assignees_task
    FOREIGN KEY (task_id) REFERENCES task(task_id);

ALTER TABLE task_assignees
    ADD CONSTRAINT FK_task_assignees_employee
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id);

ALTER TABLE task
    ADD CONSTRAINT FK_TASK_PROCESS
    FOREIGN KEY (process_id) REFERENCES process_entity(process_id);
