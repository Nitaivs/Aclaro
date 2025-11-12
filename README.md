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

All endpoints are mounted under the /api prefix when running locally (default):

http://localhost:8080/api

Make sure the backend is running (from `backend/proseed`):

```bash
./gradlew bootRun
```

---

## Endpoints (detailed)

Notes:
- All endpoints return JSON when successful and set appropriate HTTP status codes.
- Common error responses used by the API:
  - 400 Bad Request — validation failure or missing/invalid query parameters (for example missing processId when creating a task).
  - 404 Not Found — resource with the requested id doesn't exist.
  - 409 Conflict — attempted operation violates constraints (rare; e.g., delete when referenced).
  - 500 Internal Server Error — unexpected server-side error.

When testing from a browser-hosted page on a different port/origin, ensure CORS is enabled (controllers are annotated with `@CrossOrigin`).

### Processes

- GET /api/processes
  - Description: Return all processes as an array of ProcessDTO.
  - Success: 200 OK, body: [ProcessDTO,...]
  - Example ProcessDTO:
    ```json
    {
      "processId": 1,
      "processName": "Backend Development",
      "processDescription": "...",
      "taskIds": [1,2,3]
    }
    ```

- GET /api/processes/{id}
  - Description: Return a single process (top-level fields + list of task IDs).
  - Success: 200 OK, body: ProcessDTO
  - Not found: 404 Not Found

- GET /api/processes/{id}/tasks
  - Description: Return a ProcessWithTaskInfoDTO containing the process and full task DTOs (including nested subtasks).
  - Success: 200 OK, body: ProcessWithTaskInfoDTO
  - Not found: 404 Not Found
  - Example ProcessWithTaskInfoDTO (truncated):
    ```json
    {
      "processId": 1,
      "processName": "Backend Development",
      "processDescription": "...",
      "tasks": [
        { "taskId": 1, "taskName": "Design API", "employeeIds": [1,3], "subTasks": [] }
      ]
    }
    ```

- POST /api/processes
  - Description: Create a new process.
  - Request body: ProcessEntity JSON. Required fields: `processName`.
  - Success: 201 Created, body: created ProcessEntity (JSON) with assigned `processId`.
  - Example request body:
    ```json
    { "processName": "New Process", "processDescription": "Optional description" }
    ```
  - Errors: 400 Bad Request when required fields are missing.

- PUT /api/processes/{id}
  - Description: Update an existing process.
  - Request body: ProcessEntity JSON.
  - Success: 200 OK, body: updated ProcessDTO
  - Not found: 404 Not Found

- DELETE /api/processes/{id}
  - Description: Delete a process.
  - Success: 204 No Content
  - Not found: 404 Not Found

### Employees

- GET /api/employees
  - Description: Return all employees as EmployeeDTOs.
  - Success: 200 OK
  - Example EmployeeDTO:
    ```json
    { "employeeId": 1, "firstName": "Alice", "lastName": "Smith", "departmentId": 1, "roleName": "ADMIN", "skills": ["Java"] }
    ```

- GET /api/employees/{id}
  - Success: 200 OK, body: EmployeeDTO
  - Not found: 404 Not Found

- POST /api/employees
  - Description: Create a new employee.
  - Request body: Employee JSON (fields used by the entity/service).
  - Success: 201 Created, body: created Employee JSON (includes `employeeId`).
  - Errors: 400 Bad Request for invalid payload.

- PUT /api/employees/{id}
  - Description: Update an existing employee.
  - Success: 200 OK (updated Employee) or 404 Not Found

- DELETE /api/employees/{id}
  - Success: 204 No Content or 404 Not Found

### Tasks

- GET /api/tasks
  - Description: Return all tasks as TaskDTOs.
  - Success: 200 OK
  - Example TaskDTO:
    ```json
    { "taskId": 1, "taskName": "Design API", "taskDescription": "...", "completed": false, "employeeIds": [1,3], "subTasks": [] }
    ```

- GET /api/tasks/{id}
  - Success: 200 OK, body: TaskDTO
  - Not found: 404 Not Found

- GET /api/tasks/{id}/employees
  - Description: Return TaskWithEmployeesDTO (task + list of EmployeeDTOs for assigned employees).
  - Success: 200 OK
  - Not found: 404 Not Found

- POST /api/tasks?processId={processId}
  - Description: Create a new task and attach it to an existing process.
  - Query param: `processId` (required) — ID of the process to attach to.
  - Request body: TaskDTO JSON.
  - Success: 201 Created, body: created TaskDTO (includes `taskId`).
  - Errors: 400 Bad Request when `processId` is missing or invalid; 400 for invalid body.

- PUT /api/tasks/{id}
  - Description: Update a task (including assigning employees and nested subtasks).
  - Request body: TaskDTO JSON.
  - Success: 200 OK, body: updated TaskDTO
  - Not found: 404 Not Found

  - Example: set an existing task (id=5) as a subtask of task id=2

    Request (PUT /api/tasks/2) body (TaskDTO JSON):

    ```json
    {
      "taskId": 2,
      "taskName": "Parent Task",
      "taskDescription": "Parent task description",
      "completed": false,
      "employeeIds": [1],
      "subTasks": [
        {
          "taskId": 5
        }
      ]
    }
    ```

    curl example:

    ```bash
    curl -v -X PUT "http://localhost:8080/api/tasks/2" \
      -H "Content-Type: application/json" \
      -d '{"taskId":2,"taskName":"Parent Task","taskDescription":"Parent task description","completed":false,"employeeIds":[1],"subTasks":[{"taskId":5}]}'
    ```

    Notes: the `subTasks` array accepts TaskDTOs; to attach an existing task as a subtask include its `taskId` (other fields may be omitted). The server will map the DTOs to entities and preserve the nesting. If the referenced subtask id doesn't exist the request may fail with 400/404

- DELETE /api/tasks/{id}
  - Success: 204 No Content
  - Not found: 404 Not Found

---

