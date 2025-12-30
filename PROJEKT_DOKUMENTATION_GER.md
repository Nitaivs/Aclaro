*This Documentation is required for the german business concept hand-in. It encompasses task 3.6 - 3.8*

# ProSeed - Project Documentation

## 3.6 High-level IT Architecture

### Architecture Overview

The ProSeed application follows a classic **3-tier architecture** (presentation layer, logic layer, data layer) with complete separation of frontend and backend.

#### Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Frontend (React SPA)                        │ │
│  │  - React 19.1 + Vite                                   │ │
│  │  - Material-UI (MUI) for UI components                 │ │
│  │  - React Flow for process visualization                │ │
│  │  - Axios for HTTP communication                        │ │
│  │  - React Router for navigation                         │ │
│  │  - Port: 5173 (Dev) / 8080 (Prod)                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     LOGIC LAYER                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Backend (Spring Boot REST API)               │ │
│  │  - Java 21                                             │ │
│  │  - Spring Boot Framework                               │ │
│  │  - REST Controllers (@RestController)                  │ │
│  │  - Service Layer (Business Logic)                      │ │
│  │  - Repository Layer (Data Access)                      │ │
│  │  - DTOs & Mappers                                      │ │
│  │  - Port: 8080                                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ JPA/Hibernate
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Relational Database                       │ │
│  │  - MariaDB (Production)                                │ │
│  │  - H2 In-Memory (Development)                          │ │
│  │  - Flyway for schema migrations                        │ │
│  │  - Port: 3306 (MariaDB)                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Container Diagram

```
                         ┌──────────────────┐
                         │   Web Browser    │
                         │     (User)       │
                         └────────┬─────────┘
                                  │
                                  │ HTTPS (Port 8080)
                                  │
                         ┌────────▼─────────┐
                         │  Docker Container│
                         │  ┌──────────────┐│
                         │  │   Frontend   ││
                         │  │  (React App) ││
                         │  │  Vite Build  ││
                         │  └──────┬───────┘│
                         │         │        │
                         │         │ REST   │
                         │  ┌──────▼───────┐│
                         │  │   Backend    ││
                         │  │ (Spring Boot)││
                         │  │  Port: 8080  ││
                         │  └──────┬───────┘│
                         └─────────┼────────┘
                                   │
                                   │ JDBC
                                   │
                         ┌─────────▼────────┐
                         │   MariaDB        │
                         │   Database       │
                         │   Port: 3306     │
                         └──────────────────┘
```

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend Framework** | React | 19.1.1 | Single Page Application |
| **Build Tool** | Vite | 7.1.7 | Fast development server & build |
| **UI Library** | Material-UI | 7.3.4 | Component library |
| **Visualization** | React Flow | 12.9.2 | Process and task diagrams |
| **HTTP Client** | Axios | 1.13.1 | REST API communication |
| **Backend Framework** | Spring Boot | Latest | REST API & business logic |
| **Programming Language** | Java | 21 | Backend development |
| **ORM** | Hibernate/JPA | - | Object-relational mapping |
| **Database (Prod)** | MariaDB | Latest | Persistent data storage |
| **Database (Dev)** | H2 | Latest | In-memory for development |
| **Migration Tool** | Flyway | - | Database schema management |
| **Containerization** | Docker | - | Deployment & orchestration |

### API Endpoints (REST)

All endpoints are accessible under the base path `/api`:

- `/api/processes` - Process management
- `/api/tasks` - Task and subtask management
- `/api/employees` - Employee management
- `/api/departments` - Department management
- `/api/roles` - Role management
- `/api/skills` - Skill management

**Supported HTTP methods:** GET, POST, PUT, PATCH, DELETE

**Data format:** JSON

---

## 3.7 Data Model (Entity-Relationship Model)

### Entity-Relationship Diagram (ERD)

```
┌─────────────────────┐
│    Privilege        │
│─────────────────────│
│ PK: privilege_id    │
└──────────┬──────────┘
           │
           │ m:n (commented out)
           │
┌──────────▼──────────┐         ┌─────────────────────┐
│       Role          │         │    Department       │
│─────────────────────│         │─────────────────────│
│ PK: role_id         │         │ PK: department_id   │
│     role_name       │         │     name            │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           │ 1:n                           │ 1:n
           │                               │
┌──────────▼───────────────────────────────▼──────────┐
│                  Employee                           │
│─────────────────────────────────────────────────────│
│ PK: employee_id                                     │
│     first_name                                      │
│     last_name                                       │
│ FK: role_id                                         │
│ FK: department_id                                   │
└──────┬───────────────────────┬──────────────────────┘
       │                       │
       │ 1:1                   │ m:n
       │                       │
┌──────▼────────────┐   ┌──────▼──────────────────┐
│ EmployeeProfile   │   │   EmployeeSkill         │
│───────────────────│   │─────────────────────────│
│ PK: id            │   │ PK: skill_id            │
│     description   │   │     skill_name          │
│ FK: employee_id   │   └──────┬──────────────────┘
└───────────────────┘          │
                               │ m:n
         ┌─────────────────────┼─────────────────┐
         │                     │                 │
┌────────▼─────────┐    ┌──────▼──────────┐      │
│  ProcessEntity   │    │      Task       │◄─────┘
│──────────────────│    │─────────────────│
│ PK: process_id   │    │ PK: task_id     │
│     process_name │    │     task_name   │
│     description  │    │     description │
└────────┬─────────┘    │     is_completed│
         │              │ FK: process_id  │
         │ 1:n          │ FK: parent_task │
         └─────────────►└────────┬────────┘
                                 │
                                 │ Self-reference
                                 │ (Hierarchy)
                                 │
                        ┌────────▼────────┐
                        │    Task         │
                        │   (Subtask)     │
                        └─────────────────┘

                        ┌─────────────────┐
                        │   Department    │
                        │  (from above)   │
                        └────────┬────────┘
                                 │ m:n
                                 ▼
                            ┌────────┐
                            │  Task  │
                            └────────┘
```

### Entities and Relationships

#### 1. Employee
**Attributes:**
- `employee_id` (PK, BIGINT, AUTO_INCREMENT)
- `first_name` (VARCHAR(255), NOT NULL)
- `last_name` (VARCHAR(255), NOT NULL)
- `role_id` (FK, BIGINT, NULLABLE)
- `department_id` (FK, BIGINT)

**Relationships:**
- **1:n with Role** - An employee has one role
- **m:n with Task** (via `task_assignees`) - Employees can be assigned to multiple tasks
- **m:n with EmployeeSkill** (via `employee_skills_mapping`) - Employees have multiple skills
- **1:1 with EmployeeProfile** - Each employee has one profile
- **n:1 with Department** - Employees belong to one department

#### 2. EmployeeProfile
**Attributes:**
- `id` (PK, BIGINT, AUTO_INCREMENT)
- `description` (VARCHAR(2000))
- `employee_id` (FK, BIGINT, UNIQUE, NOT NULL)

**Relationships:**
- **1:1 with Employee** - Extended information about the employee

#### 3. EmployeeSkill
**Attributes:**
- `skill_id` (PK, BIGINT, AUTO_INCREMENT)
- `skill_name` (VARCHAR(40), NOT NULL)

**Relationships:**
- **m:n with Employee** (via `employee_skills_mapping`)
- **m:n with Task** (via `task_skills_mapping`) - Tasks require specific skills

#### 4. Role
**Attributes:**
- `role_id` (PK, BIGINT, AUTO_INCREMENT)
- `role_name` (VARCHAR(100), NOT NULL, UNIQUE)

**Relationships:**
- **1:n with Employee** - A role can be assigned to multiple employees
- *(m:n with Privilege - currently commented out for future extension)*

#### 5. Privilege
**Attributes:**
- `privilege_id` (PK, BIGINT, AUTO_INCREMENT)

**Relationships:**
- *(m:n with Role - currently commented out)*

#### 6. Department
**Attributes:**
- `department_id` (PK, BIGINT, AUTO_INCREMENT)
- `name` (VARCHAR(100), NOT NULL)

**Relationships:**
- **1:n with Employee** - A department has multiple employees
- **m:n with Task** (via `task_departments_mapping`) - Tasks are assigned to departments

#### 7. ProcessEntity
**Attributes:**
- `process_id` (PK, BIGINT, AUTO_INCREMENT)
- `process_name` (VARCHAR(255), NOT NULL)
- `description` (VARCHAR(1000))

**Relationships:**
- **1:n with Task** - A process contains multiple tasks

#### 8. Task
**Attributes:**
- `task_id` (PK, BIGINT, AUTO_INCREMENT)
- `task_name` (VARCHAR(255), NOT NULL)
- `task_description` (VARCHAR(1000))
- `is_completed` (BOOLEAN, NOT NULL)
- `process_id` (FK, BIGINT, NOT NULL)
- `parent_task_id` (FK, BIGINT, NULLABLE)

**Relationships:**
- **n:1 with ProcessEntity** - Each task belongs to one process
- **m:n with Employee** (via `task_assignees`) - Tasks have employee assignments
- **Self-reference (hierarchical):**
  - **n:1 with Task** (parent_task) - A task can have a parent task
  - **1:n with Task** (subtasks) - A task can have multiple subtasks
- **m:n with EmployeeSkill** (via `task_skills_mapping`) - Required skills for tasks
- **m:n with Department** (via `task_departments_mapping`) - Involved departments

### Relationship Types Overview

| Relationship | Type | Junction Table | Description |
|-------------|------|----------------|-------------|
| Employee ↔ Role | n:1 | - | Each employee has one role |
| Employee ↔ EmployeeProfile | 1:1 | - | Extended profile information |
| Employee ↔ EmployeeSkill | m:n | `employee_skills_mapping` | Employee skills |
| Employee ↔ Task | m:n | `task_assignees` | Task assignments |
| Employee ↔ Department | n:1 | - | Department membership |
| Role ↔ Privilege | m:n | `role_privileges` | Role permissions (commented out) |
| ProcessEntity ↔ Task | 1:n | - | Process contains tasks |
| Task ↔ Task (Parent) | n:1 | - | Hierarchical task structure |
| Task ↔ Task (Subtasks) | 1:n | - | Parent-child relationship |
| Task ↔ EmployeeSkill | m:n | `task_skills_mapping` | Required skills |
| Task ↔ Department | m:n | `task_departments_mapping` | Involved departments |

---

## 3.8 Data Sources / Migration

### 3.8.1 Data Sources

#### Initial Data Sources

The initial data for the ProSeed application is provided in various ways:

**1. Programmatic Initialization (Development Mode)**

In development mode (`dev` profile), initial data is automatically inserted by the `DataInitializer.java` class:

- **Privileges:** READ, WRITE, DELETE
- **Roles:** ADMIN, USER, MANAGER
- **Employee Skills:** Java, Spring Boot, SQL, React
- **Departments:** Backend, Frontend, Operations
- **Sample Employees:**
  - Alice Smith (Admin, Backend, Skills: Java, Spring Boot)
  - Bob Jones (User, Operations, Skills: SQL)
  - Carol Taylor (Manager, Frontend, Skills: Java, React)
- **Sample Processes:**
  - Backend Development
  - Frontend Development
- **Sample Tasks with hierarchical structure:**
  - Design API (with multiple subtasks)
  - Database Migration
  - UI Prototype

**2. Database Migrations (Flyway)**

The schema is managed through Flyway migrations:
- File: `V1__initial_schema.sql`
- Contains: DDL statements for all tables and constraints
- Usage: Automatically on application startup in `dev-maria` and `prod` profiles

**3. Manual Entry via REST API**

After deployment, new data can be entered via the REST API:
- POST endpoints available for all entities
- JSON format for data transmission
- Used by: Frontend UI or API tools (Postman, curl)

**4. Future Extension Possibilities**

The system is prepared for:
- **Excel Import:** No current implementation, but easily integrable through REST API
- **External APIs:** Architecture supports API integration via service layer
- **CSV/Batch Import:** Possible via custom Spring Boot CommandLineRunner

### 3.8.2 Data Quality and Assurance

#### Validation Strategies

**1. Database Level**

Data quality is ensured at the database level through constraints:

```sql
-- NOT NULL Constraints
- Required fields like employee.first_name, task.name, etc.

-- UNIQUE Constraints
- role.role_name (unique role names)
- employee_profile.employee_id (one profile per employee)

-- Foreign Key Constraints
- Referential integrity between all tables
- ON DELETE/UPDATE behavior defined

-- Check Constraints (implicit)
- Data type validation (VARCHAR lengths, BIGINT, BOOLEAN)
```

**2. Application Level (JPA/Hibernate)**

Validation through JPA annotations in entity classes:

```java
@Column(nullable = false)           // Required field
@Column(unique = true)              // Uniqueness
@Column(length = 255)               // Maximum length
@ManyToOne(optional = false)        // Required relationship
```

**3. Service Layer Validation**

Business logic validation in service implementations:
- Cycle detection in task hierarchies (prevents circular subtask relationships)
- Existence checks for referenced entities
- Custom validation before persistence

**4. REST API Level**

- **HTTP Status Codes:**
  - `400 Bad Request` - Validation errors
  - `404 Not Found` - Non-existent resources
  - `409 Conflict` - Constraint violations

- **DTO Validation:**
  - Mapping between entity and DTO separates internal and external data structures
  - Prevention of over-posting/mass-assignment

**5. Frontend Validation**

Although not visible in backend code, the React frontend should:
- Perform input validation before API calls
- Display user-friendly error messages
- Mark required fields

### 3.8.3 Data Migration Strategy

#### Development Environment

**Profile: `dev`**
- Database: H2 In-Memory
- Schema management: `spring.jpa.hibernate.ddl-auto=update`
- Data initialization: `DataInitializer.java`
- Advantage: Fast development, no persistence needed
- Disadvantage: Data lost on restart

#### Testing Environment

**Profile: `dev-maria`**
- Database: MariaDB (local)
- Schema management: Flyway migrations
- Hibernate mode: `validate` (verification only, no changes)
- Advantage: Testing persistent behavior
- Connection: `jdbc:mariadb://localhost:3306/seed_db`

#### Production Environment

**Profile: `prod`**
- Database: MariaDB (production)
- Schema management: Flyway migrations
- Hibernate mode: `validate`
- Migration process:
  1. Flyway checks `flyway_schema_history` table
  2. Executes only new migration scripts (e.g., V2__, V3__, ...)
  3. No data initialization in production mode

### 3.8.4 Data Integrity and Consistency

**Transaction Management:**
- Spring `@Transactional` on service layer
- ACID properties through relational database
- Cascade operations defined (e.g., `CascadeType.ALL` for EmployeeProfile)

**Orphan Removal:**
- Automatic deletion of orphaned subtasks when deleting a parent task
- Defined through `orphanRemoval = true` in JPA relationships

**Cycle Prevention:**
- Special validation prevents circular task hierarchies
- Error response: `400 Bad Request` with detailed error message
- Ensures true tree structure

**Soft Delete vs. Hard Delete:**
- Current: Hard delete (physical deletion)
- Possible extension: Soft delete with `deleted_at` timestamp for audit trail

### 3.8.5 Backup and Recovery

**Recommended Strategies (not implemented, but best practice):**
- Regular MariaDB backups (e.g., `mysqldump`)
- Point-in-time recovery through binary logs
- Define backup retention policy
- Create disaster recovery plan

---

## Summary

The ProSeed application uses modern web technologies in a clear 3-tier architecture. The relational data model with 8 main entities and 5 junction tables enables flexible process and task management with hierarchical structures. Data quality is ensured at multiple levels (database, JPA, service layer, API). The use of Flyway for schema migrations and different profiles (dev/prod) enables a professional development and deployment pipeline.