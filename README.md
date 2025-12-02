<!-- New blank project: SCRUM Management > readme.md > `Edit single file` -->

[[_TOC_]]

# Proseed introduction

This is a readme file for Proseed, the software for managing processes and tasks, tailored for L1VE.

This readme file will include sections on how to set up the service and container, and glosses over any relevant
code areas that are important. For more information, please see the technical document.

# System requirements

## OS:

Linux (Amazon Linux, Ubuntu LTS and Debian recommended as distros)

(This Docker container is HEAVILY recommended to be used with Linux for maximum operational security. Use Windows
only if strictly necessary!)

## Components:

The program at the very moment is incredibly light, but component requirements will rise with how big the data stored becomes
and how far it is scaled.

## Docker:

This application has initially been done with Docker for simple containerization and includes a basic file for running the back- and frontend
portions of the application. For any other containerization method (such as Podman), you must do your own file for that.



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
      "id": 1,
      "name": "Backend Development",
      "description": "...",
      "taskIds": [1, 2, 3]
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
      "id": 1,
      "name": "Backend Development",
      "description": "...",
      "tasks": [
        {
          "id": 1,
          "name": "Design API",
          "employeeIds": [1, 3],
          "subTasks": []
        }
      ]
    }
    ```

- POST /api/processes

  - Description: Create a new process.
  - Request body: ProcessEntity JSON. Required fields: `name`.
  - Success: 201 Created, body: created ProcessEntity (JSON) with assigned `id`.
  - Example request body:
    ```json
    {
      "name": "New Process",
      "description": "Optional description"
    }
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

---

### Employees

- GET /api/employees

  - Description: Return all employees as EmployeeDTOs.
  - Success: `200 OK` with JSON array.
  - Example EmployeeDTO:
    ```json
    {
      "id": 1,
      "firstName": "Alice",
      "lastName": "Smith",
      "departmentId": 1,
      "roleName": "ADMIN",
      "skills": ["Java"]
    }
    ```

- GET /api/employees/{id}

  - Description: Return a single employee.
  - Success: `200 OK`, body: `EmployeeDTO`.
  - Not found: `404 Not Found`.

- POST /api/employees

  - Description: Create an employee from the entity payload.
  - Request body (example):
    ```json
    {
      "firstName": "Alice",
      "lastName": "Tester",
      "department": { "id": 1 },
      "role": { "id": 2 }
    }
    ```
  - Success: `201 Created`, body: saved `Employee` (entity JSON, includes generated `id`).
  - Validation errors: `400 Bad Request`

- PUT /api/employees/{id}

  - Description: Update an existing employee.
  - Success: 200 OK (updated Employee) or 404 Not Found

- PATCH /api/employees/{id}

  - Description: Partial update; only supplied fields are applied. Supported fields in `EmployeePatchDTO`: `firstName`, `lastName`, `departmentId`, `roleId`, `skillIds` (array of skill ids to replace the entire skill set).
  - Request body examples:
    ```json
    { "firstName": "Alice-Updated" }
    ```
    ```json
    { "departmentId": 3, "roleId": 2, "skillIds": [4, 5, 6] }
    ```
  - Success: `200 OK`, body: updated `EmployeeDTO`.
  - Not found (employee or referenced ids): `404 Not Found`.
  - Invalid payload: `400 Bad Request`.

- DELETE /api/employees/{id}
  - Description: Removes the employee after unlinking tasks/skills/role references.
  - Success: `204 No Content`.
  - Not found: `404 Not Found`.

Example PowerShell PATCH (department + role):

```powershell
$body = @{ departmentId = 2; roleId = 3 } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8080/api/employees/1" -Method Patch -Body $body -ContentType "application/json" -UseBasicParsing
```

---

### Tasks

- GET /api/tasks

  - Description: Return all tasks as TaskDTOs.
  - Success: 200 OK
  - Example TaskDTO:
    ```json
    {
      "id": 1,
      "name": "Design API",
      "description": "...",
      "completed": false,
      "employeeIds": [1, 3],
      "subTasks": []
    }
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
  - Success: 201 Created, body: created TaskDTO (includes `id`).
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
      "id": 2,
      "name": "Parent Task",
      "description": "Parent task description",
      "completed": false,
      "employeeIds": [1],
      "subTasks": [
        {
          "id": 5
        }
      ]
    }
    ```

    curl example:

    ```bash
    curl -v -X PUT "http://localhost:8080/api/tasks/2" \
      -H "Content-Type: application/json" \
      -d '{"id":2,"name":"Parent Task","description":"Parent task description","completed":false,"employeeIds":[1],"subTasks":[{"id":5}]}'
    ```

    Notes: the `subTasks` array accepts TaskDTOs; to attach an existing task as a subtask include its `id` (other fields may be omitted). The server will map the DTOs to entities and preserve the nesting. If the referenced subtask id doesn't exist the request may fail with 400/404

- DELETE /api/tasks/{id}

  - Success: 204 No Content
  - Not found: 404 Not Found

- DELETE /api/tasks/{taskId}/employees/{employeeId}
  - Description: Remove a single employee assignment from a task. Idempotent; returns 204 even if the employee was not assigned.
  - Success: 204 No Content
  - Not found task: 404 Not Found (if the task id does not exist). Employee id not found: 404.
  - Example:
    ```bash
    curl -X DELETE "http://localhost:8080/api/tasks/1/employees/3" -w "\nHTTP %{http_code}\n"
    ```

- POST /api/tasks/insert-between?parentTaskId={parentId}&childTaskId={childId}
  - Description: Insert a new task between an existing parent and child task in the hierarchy. The new task becomes a child of the parent and the new parent of the child. This is useful for adding intermediate tasks without manually reparenting.
  - Query params:
    - `parentTaskId` (required) — ID of the task that will become the parent of the new task
    - `childTaskId` (required) — ID of the task that will become the child of the new task (must currently be a direct child of parentTaskId)
  - Request body: TaskDTO JSON with the new task's data.
  - Success: 201 Created, body: created TaskDTO with updated relationships
  - Errors:
    - 400 Bad Request — if the child is not actually a direct child of the parent
    - 404 Not Found — if parent or child task does not exist
  - Example: Insert a task between task 1 (parent) and task 5 (child of task 1)

    Before: Task 1 → Task 5
    After:  Task 1 → New Task → Task 5

    ```bash
    curl -X POST "http://localhost:8080/api/tasks/insert-between?parentTaskId=1&childTaskId=5" \
      -H "Content-Type: application/json" \
      -d '{"name":"Intermediate Task","description":"Inserted between parent and child","completed":false}'
    ```

    Response (201 Created):
    ```json
    {
      "id": 10,
      "name": "Intermediate Task",
      "description": "Inserted between parent and child",
      "completed": false,
      "parentTaskId": 1,
      "subTasks": [
        { "id": 5, "name": "...", "parentTaskId": 10, ... }
      ]
    }
    ```

---

### Departments

- GET /api/departments

  - Description: Return all departments.
  - Success: 200 OK, body: [Department,...]

- GET /api/departments/{id}

  - Description: Return single Department by id.
  - Success: 200 OK, body: Department
  - Not found: 404 Not Found

- POST /api/departments

  - Description: Create a new department.
  - Request body: Department JSON (e.g. `{ "name": "Engineering", "description": "..." }`)
  - Success: 201 Created, body: created Department

- PUT /api/departments/{id}

  - Description: Update an existing department.
  - Success: 200 OK, body: updated Department or 404 Not Found

- DELETE /api/departments/{id}
  - Description: Delete a department.
  - Success: 204 No Content
  - Failure: 409 Conflict if the department is referenced by employees (constraint violation) — response body contains a user-friendly message; 404 if not found.

---

### Roles

- GET /api/roles

  - Description: Return all roles.
  - Success: 200 OK

- GET /api/roles/{id}

  - Description: Return single Role by id.
  - Success: 200 OK or 404 Not Found

- POST /api/roles

  - Description: Create a role. Request body: Role JSON (e.g. `{ "name": "ADMIN" }`).
  - Success: 201 Created

- PUT /api/roles/{id}

  - Description: Update role.
  - Success: 200 OK or 404 Not Found

- DELETE /api/roles/{id}
  - Description: Delete a role.
  - Success: 204 No Content
  - Failure: 409 Conflict if deletion is blocked by references (e.g. assigned employees)

---

### Skills (EmployeeSkill)

- GET /api/skills

  - Description: Return all skills.
  - Success: 200 OK

- GET /api/skills/{id}

  - Description: Return single skill by id.
  - Success: 200 OK or 404 Not Found

- POST /api/skills

  - Description: Create a skill. Request body: `{ "name": "Java" }`.
  - Success: 201 Created

- PUT /api/skills/{id}

  - Description: Update a skill.
  - Success: 200 OK or 404 Not Found

- DELETE /api/skills/{id}
  - Description: Delete a skill. The service unlinks the skill from all employees before removing the skill record.
  - Success: 204 No Content
  - Not found: 404 Not Found

---

### Task hierarchy & cycle prevention

To keep the task hierarchy a proper tree, the backend actively rejects any attempt (POST or PUT) that would introduce a cycle.

What is a cycle?

- A task listed as a subtask of itself directly.
- A task becoming (directly or indirectly) a child of one of its own descendants (e.g. A -> B and then updating B to have A as a subtask).
- Repeated occurrence of the same existing task id within a single submitted subtree chain.

Validation points:

- On create (POST /api/tasks?processId=...) the entire submitted subtree is walked before persisting; if a cycle or duplicate reference is detected the request fails with 400.
- On update (PUT /api/tasks/{id}) each referenced existing subtask is checked to ensure it is not an ancestor of the task being updated and not the task itself.

Example invalid create payload (self-reference through nested subTasks):

```json
{
  "name": "A",
  "completed": false,
  "subTasks": [
    {
      "id": 10,
      "subTasks": [{ "id": 10 }]
    }
  ]
}
```

Example invalid update attempting to make parent its own descendant:

```json
// Existing: A(id=2) already has subtask B(id=5)
// Request tries to set A as a subtask of B
PUT /api/tasks/5
{
  "id": 5,
  "name": "B",
  "subTasks": [ { "id": 2 } ]
}
```

Error response shape (simplified):

```json
{
  "timestamp": "2025-11-12T21:40:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Circular subtask relationship detected: task 2 cannot be a child of its descendant 5",
  "path": "/api/tasks/5"
}
```

If you receive a 400 with a circular message, adjust the hierarchy so that each task appears only once in any parent chain and never points back upward.

Happy path reparenting strategy:

1. Retrieve current tree (GET /api/processes/{id}/tasks or GET /api/tasks/{id}).
2. Decide new parent for existing task(s).
3. Issue PUT on the new parent including minimal subTasks array with the id(s) you want to attach.
4. Verify with GET that the subtree updated as expected.
