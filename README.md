<!-- New blank project: SCRUM Management > readme.md > `Edit single file` -->

[[_TOC_]]

# Welcome

This Gitlab by LRZ project is here to be utilized for **completely managing your SCRUM project**.

So, you will use it

- to create and update your **product backlog** with epics and user stories (=gitlab issues)

---

- to agree on and maintain your **sprint backlog for each sprint**

- update the **user stories and tasks within a sprint**



For some hints on SCRUM in Gitlab see section further below.

Additionally, you document your project in the **Wiki of this Gitlab project** (see menu item `Plan` on the left and then `Wiki`).
This includes

- to define your **DoD** (Definition of Done)
- to document your **sprint goal and backlog** per sprint
- to prepare an **sprint review agenda** for each sprint and
- to record the created and presented **documents** of sprint

With finishing your project you will **hand in all required deliverables for grading** via this Gitlab project.

# Hints


## SCRUM Artifacts in Gitlab

The following table shows which SCRUM Artifacts translate into which Gitlab Features

| SCRUM Artifacts       | Gitlab Feature                     |
| --------------------- | ---------------------------------- |
| User story            | Issues                             |
| Task                  | Task list                          |
| Epic                  | Epics                              |
| Points and estimation | Weights                            |
| Product backlog       | Issue lists and Prioritized labels |
| Sprint / iteration    | Milestones                         |

| Burndown chart        | Burndown charts                    |
| Agile board           | Issue boards                       |

## Backend - Running locally

This repository contains a Spring Boot backend in `backend/proseed`. The backend supports three profiles:

- `dev` - H2 in-memory database. Hibernate manages schema (`spring.jpa.hibernate.ddl-auto=update`). Good for development and tests.
- `dev-maria` - MariaDB (local) with Flyway migrations. Hibernate validates the schema (`spring.jpa.hibernate.ddl-auto=validate`). Use this to test persisten DB behavior
- `prod` - Production-like profile using MariaDB and schema validation.

Prerequisites

- Java 21 (or compatible JDK used by the project)

- Gradle (wrapper included) - use the included `gradlew`
- MariaDB server for the `dev-maria`/`prod` profiles (if you plan to run those)


Quick start (dev, in-memory H2)

cd backend/proseed
./gradlew bootRun

This runs Spring Boot with the default `dev` profile (H2). The app will create/update the schema automatically.

Run with MariaDB + Flyway migrations (dev-maria)

1. Ensure a MariaDB database and user are available and match the values in `backend/proseed/src/main/resources/application-dev-maria.properties` (defaults used by the project):

   - URL: `jdbc:mariadb://localhost:3306/seed_db`
   - Username: `seed_user`
   - Password: `seed_pwd`

2. Start with the `dev-maria` profile:

cd backend/proseed
SPRING_PROFILES_ACTIVE=dev-maria ./gradlew bootRun

Flyway troubleshooting

- If Flyway reports a validation failure like `Detected failed migration to version 1 (initial schema)` it means a previous migration run was recorded as failed or the migration file changed after it was applied.

delete history from the database for a quick fix

---

# API endpoints - how to test

## Base URL

http://localhost:8080/api

(Ensure the app is running via `.\gradlew.bat bootRun`.)

---

## Endpoints

### Processes

- GET /processes
  - Returns: List<ProcessDTO> (200 OK) or Empty list when none found.
- GET /processes/{id}
  - Returns: single ProcessDTO with task IDs (200 OK). 404 if not found.
- GET /processes/{id}/tasks
  - Returns: single ProcessWithTaskInfoDTO with all associated task information.
    404 if not found.
- POST /processes
  - Creates a process. Body: ProcessEntity JSON. (processName - not nullable,
    processDescription - nullable)
- PUT /processes/{id}
  - Updates a process. Body: ProcessEntity JSON. Response: 200 OK (updated DTO) or 404.
- DELETE processes/{id}
  - Deletes a process. Response: 204 No Content / 404 Not Found.

### Employees

- GET /employees
  - Returns: List<`EmployeeDTO`] (200 OK).
- GET /employees/{id}
  - Returns: single `EmployeeDTO` (200 OK) or 404 Not Found.
- POST /employees
  - Creates an Employee. Body: Employee JSON.
- PUT /employees/{id}
  - Updates an existing Employee. Body: Employee JSON. Returns: updated Employee (200 OK) or 404 if not found.
- DELETE /employees/{id}
  - Deletes an Employee. Response: 204 No Content / 404 Not Found.

### Tasks

- GET /tasks
  - Returns: List<Task> (200 OK).
- GET /tasks/{id}
  - Returns: single Task entity (200 OK) or 404 Not Found.
- GET /tasks/{id}/employees
  - Returns: `TaskWithEmployeesDTO` containing task id and list of assigned employees as `EmployeeDTO`s (200 OK) or 404 if task not found.
- POST /tasks?processId={processId}
  - Creates a Task and associates it to an existing process. Body: Task JSON (taskName required). Returns: created Task (201 Created). If processId missing or unknown returns 400 Bad Request.
- PUT /tasks/{id}
  - Updates a Task. Body: Task JSON (taskName, taskDescription, completed). Returns: updated Task (200 OK) or 404 if not found.
- DELETE /tasks/{id}
  - Deletes a Task. Response: 204 No Content / 404 Not Found.
