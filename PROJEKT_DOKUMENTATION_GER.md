*This Documentation is required for the german business concept hand-in. It encompasses task 3.6 - 3.8*

# ProSeed - Projekt Dokumentation

## 3.6 High-level IT Architecture

### Architektur-Übersicht

Die ProSeed-Anwendung folgt einer klassischen **3-Tier-Architektur** (Präsentationsschicht, Logikschicht, Datenschicht) mit vollständiger Trennung von Frontend und Backend.

#### Schichtendiagramm

```
┌─────────────────────────────────────────────────────────────┐
│                    PRÄSENTATIONSSCHICHT                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Frontend (React SPA)                        │ │
│  │  - React 19.1 + Vite                                   │ │
│  │  - Material-UI (MUI) für UI-Komponenten                │ │
│  │  - React Flow für Prozessvisualisierung                │ │
│  │  - Axios für HTTP-Kommunikation                        │ │
│  │  - React Router für Navigation                         │ │
│  │  - Port: 5173 (Dev) / 8080 (Prod)                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     LOGIKSCHICHT                            │
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
│                     DATENSCHICHT                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Relationale Datenbank                     │ │
│  │  - MariaDB (Produktion)                                │ │
│  │  - H2 In-Memory (Entwicklung)                          │ │
│  │  - Flyway für Schema-Migrationen                       │ │
│  │  - Port: 3306 (MariaDB)                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Container-Diagramm

```
                         ┌──────────────────┐
                         │   Web Browser    │
                         │   (Benutzer)     │
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
                         │   Datenbank      │
                         │   Port: 3306     │
                         └──────────────────┘
```

### Technologie-Stack

| Komponente | Technologie | Version | Zweck |
|------------|-------------|---------|-------|
| **Frontend Framework** | React | 19.1.1 | Single Page Application |
| **Build Tool** | Vite | 7.1.7 | Schneller Development Server & Build |
| **UI Library** | Material-UI | 7.3.4 | Komponenten-Bibliothek |
| **Visualisierung** | React Flow | 12.9.2 | Prozess- und Task-Diagramme |
| **HTTP Client** | Axios | 1.13.1 | REST API Kommunikation |
| **Backend Framework** | Spring Boot | Latest | REST API & Business Logic |
| **Programmiersprache** | Java | 21 | Backend-Entwicklung |
| **ORM** | Hibernate/JPA | - | Object-Relational Mapping |
| **Datenbank (Prod)** | MariaDB | Latest | Persistente Datenspeicherung |
| **Datenbank (Dev)** | H2 | Latest | In-Memory für Entwicklung |
| **Migration Tool** | Flyway | - | Datenbank-Schema-Verwaltung |
| **Containerisierung** | Docker | - | Deployment & Orchestrierung |

### API-Endpunkte (REST)

Alle Endpunkte sind unter dem Basis-Pfad `/api` erreichbar:

- `/api/processes` - Verwaltung von Prozessen
- `/api/tasks` - Verwaltung von Tasks und Subtasks
- `/api/employees` - Mitarbeiterverwaltung
- `/api/departments` - Abteilungsverwaltung
- `/api/roles` - Rollenverwaltung
- `/api/skills` - Skill-Verwaltung

**Unterstützte HTTP-Methoden:** GET, POST, PUT, PATCH, DELETE

**Datenformat:** JSON

---

## 3.7 Data Model (Entity-Relationship-Model)

### Entity-Relationship-Diagramm (ERD)

```
┌─────────────────────┐
│    Privilege        │
│─────────────────────│
│ PK: privilege_id    │
└──────────┬──────────┘
           │
           │ m:n (auskommentiert)
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
                                 │ Selbstreferenz
                                 │ (Hierarchie)
                                 │
                        ┌────────▼────────┐
                        │    Task         │
                        │   (Subtask)     │
                        └─────────────────┘

                        ┌─────────────────┐
                        │   Department    │
                        │  (von oben)     │
                        └────────┬────────┘
                                 │ m:n
                                 ▼
                            ┌────────┐
                            │  Task  │
                            └────────┘
```

### Entitäten und Beziehungen

#### 1. Employee (Mitarbeiter)
**Attribute:**
- `employee_id` (PK, BIGINT, AUTO_INCREMENT)
- `first_name` (VARCHAR(255), NOT NULL)
- `last_name` (VARCHAR(255), NOT NULL)
- `role_id` (FK, BIGINT, NULLABLE)
- `department_id` (FK, BIGINT)

**Beziehungen:**
- **1:n mit Role** - Ein Mitarbeiter hat eine Rolle
- **m:n mit Task** (via `task_assignees`) - Mitarbeiter können mehreren Tasks zugewiesen sein
- **m:n mit EmployeeSkill** (via `employee_skills_mapping`) - Mitarbeiter haben mehrere Skills
- **1:1 mit EmployeeProfile** - Jeder Mitarbeiter hat ein Profil
- **n:1 mit Department** - Mitarbeiter gehören zu einer Abteilung

#### 2. EmployeeProfile
**Attribute:**
- `id` (PK, BIGINT, AUTO_INCREMENT)
- `description` (VARCHAR(2000))
- `employee_id` (FK, BIGINT, UNIQUE, NOT NULL)

**Beziehungen:**
- **1:1 mit Employee** - Erweiterte Informationen zum Mitarbeiter

#### 3. EmployeeSkill (Skills/Fähigkeiten)
**Attribute:**
- `skill_id` (PK, BIGINT, AUTO_INCREMENT)
- `skill_name` (VARCHAR(40), NOT NULL)

**Beziehungen:**
- **m:n mit Employee** (via `employee_skills_mapping`)
- **m:n mit Task** (via `task_skills_mapping`) - Tasks erfordern bestimmte Skills

#### 4. Role (Rollen)
**Attribute:**
- `role_id` (PK, BIGINT, AUTO_INCREMENT)
- `role_name` (VARCHAR(100), NOT NULL, UNIQUE)

**Beziehungen:**
- **1:n mit Employee** - Eine Rolle kann mehreren Mitarbeitern zugewiesen sein
- *(m:n mit Privilege - aktuell auskommentiert für zukünftige Erweiterung)*

#### 5. Privilege (Rechte)
**Attribute:**
- `privilege_id` (PK, BIGINT, AUTO_INCREMENT)

**Beziehungen:**
- *(m:n mit Role - aktuell auskommentiert)*

#### 6. Department (Abteilung)
**Attribute:**
- `department_id` (PK, BIGINT, AUTO_INCREMENT)
- `name` (VARCHAR(100), NOT NULL)

**Beziehungen:**
- **1:n mit Employee** - Eine Abteilung hat mehrere Mitarbeiter
- **m:n mit Task** (via `task_departments_mapping`) - Tasks sind Abteilungen zugeordnet

#### 7. ProcessEntity (Prozesse)
**Attribute:**
- `process_id` (PK, BIGINT, AUTO_INCREMENT)
- `process_name` (VARCHAR(255), NOT NULL)
- `description` (VARCHAR(1000))

**Beziehungen:**
- **1:n mit Task** - Ein Prozess enthält mehrere Tasks

#### 8. Task (Aufgaben)
**Attribute:**
- `task_id` (PK, BIGINT, AUTO_INCREMENT)
- `task_name` (VARCHAR(255), NOT NULL)
- `task_description` (VARCHAR(1000))
- `is_completed` (BOOLEAN, NOT NULL)
- `process_id` (FK, BIGINT, NOT NULL)
- `parent_task_id` (FK, BIGINT, NULLABLE)

**Beziehungen:**
- **n:1 mit ProcessEntity** - Jeder Task gehört zu einem Prozess
- **m:n mit Employee** (via `task_assignees`) - Tasks haben Mitarbeiter-Zuweisungen
- **Selbstreferenz (hierarchisch):**
  - **n:1 mit Task** (parent_task) - Ein Task kann einen Parent-Task haben
  - **1:n mit Task** (subtasks) - Ein Task kann mehrere Subtasks haben
- **m:n mit EmployeeSkill** (via `task_skills_mapping`) - Erforderliche Skills für Tasks
- **m:n mit Department** (via `task_departments_mapping`) - Beteiligte Abteilungen

### Beziehungstypen-Übersicht

| Beziehung | Typ | Zwischentabelle | Beschreibung |
|-----------|-----|----------------|--------------|
| Employee ↔ Role | n:1 | - | Jeder Mitarbeiter hat eine Rolle |
| Employee ↔ EmployeeProfile | 1:1 | - | Erweiterte Profil-Informationen |
| Employee ↔ EmployeeSkill | m:n | `employee_skills_mapping` | Mitarbeiter-Fähigkeiten |
| Employee ↔ Task | m:n | `task_assignees` | Task-Zuweisungen |
| Employee ↔ Department | n:1 | - | Abteilungszugehörigkeit |
| Role ↔ Privilege | m:n | `role_privileges` | Rollen-Berechtigungen (auskommentiert) |
| ProcessEntity ↔ Task | 1:n | - | Prozess enthält Tasks |
| Task ↔ Task (Parent) | n:1 | - | Hierarchische Task-Struktur |
| Task ↔ Task (Subtasks) | 1:n | - | Parent-Child Beziehung |
| Task ↔ EmployeeSkill | m:n | `task_skills_mapping` | Erforderliche Skills |
| Task ↔ Department | m:n | `task_departments_mapping` | Beteiligte Abteilungen |

---

## 3.8 Data Sources / Migration

### 3.8.1 Datenquellen

#### Initiale Datenquellen

Die Startdaten für die ProSeed-Anwendung werden auf verschiedene Weisen bereitgestellt:

**1. Programmatische Initialisierung (Development Mode)**

Im Development-Modus (`dev` Profile) werden Startdaten automatisch durch die Klasse `DataInitializer.java` eingefügt:

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
- **Sample Tasks mit hierarchischer Struktur:**
  - Design API (mit mehreren Subtasks)
  - Database Migration
  - UI Prototype

**2. Datenbank-Migrationen (Flyway)**

Das Schema wird durch Flyway-Migrationen verwaltet:
- Datei: `V1__initial_schema.sql`
- Enthält: DDL-Statements für alle Tabellen und Constraints
- Verwendung: Automatisch bei Anwendungsstart im `dev-maria` und `prod` Profil

**3. Manuelle Eingabe über REST API**

Nach dem Deployment können neue Daten über die REST API eingegeben werden:
- POST-Endpunkte für alle Entitäten verfügbar
- JSON-Format für Datenübermittlung
- Verwendung durch: Frontend-UI oder API-Tools (Postman, curl)

**4. Zukünftige Erweiterungsmöglichkeiten**

Das System ist vorbereitet für:
- **Excel-Import:** Keine aktuelle Implementierung, aber durch REST API einfach integrierbar
- **Externe APIs:** Architektur unterstützt API-Integration über Service-Layer
- **CSV/Batch-Import:** Möglich über Custom Spring Boot CommandLineRunner

### 3.8.2 Datenqualität und Sicherstellung

#### Validierungsstrategien

**1. Datenbankebene**

Die Datenqualität wird auf Datenbankebene durch Constraints sichergestellt:

```sql
-- NOT NULL Constraints
- Pflichtfelder wie employee.first_name, task.name, etc.

-- UNIQUE Constraints
- role.role_name (eindeutige Rollennamen)
- employee_profile.employee_id (ein Profil pro Mitarbeiter)

-- Foreign Key Constraints
- Referentielle Integrität zwischen allen Tabellen
- ON DELETE/UPDATE Verhalten definiert

-- Check Constraints (implizit)
- Datentyp-Validierung (VARCHAR-Längen, BIGINT, BOOLEAN)
```

**2. Anwendungsebene (JPA/Hibernate)**

Validierung durch JPA-Annotationen in Entity-Klassen:

```java
@Column(nullable = false)           // Pflichtfeld
@Column(unique = true)              // Eindeutigkeit
@Column(length = 255)               // Maximale Länge
@ManyToOne(optional = false)        // Pflicht-Beziehung
```

**3. Service-Layer-Validierung**

Business-Logic-Validierung in Service-Implementierungen:
- Zyklus-Prüfung bei Task-Hierarchien (verhindert zirkuläre Subtask-Beziehungen)
- Existenz-Prüfung von referenzierten Entitäten
- Custom Validierung vor Persistierung

**4. REST API-Ebene**

- **HTTP Status Codes:**
  - `400 Bad Request` - Validierungsfehler
  - `404 Not Found` - Nicht existierende Ressourcen
  - `409 Conflict` - Constraint-Verletzungen

- **DTO-Validierung:**
  - Mapping zwischen Entity und DTO trennt interne und externe Datenstrukturen
  - Verhinderung von Over-Posting/Mass-Assignment

**5. Frontend-Validierung**

Obwohl nicht im Backend-Code sichtbar, sollte das React-Frontend:
- Input-Validierung vor API-Aufrufen durchführen
- Benutzerfreundliche Fehlermeldungen anzeigen
- Required-Fields kennzeichnen

### 3.8.3 Datenmigrationsstrategie

#### Development Environment

**Profil: `dev`**
- Datenbank: H2 In-Memory
- Schema-Verwaltung: `spring.jpa.hibernate.ddl-auto=update`
- Daten-Initialisierung: `DataInitializer.java`
- Vorteil: Schnelle Entwicklung, keine Persistenz nötig
- Nachteil: Daten gehen bei Neustart verloren

#### Testing Environment

**Profil: `dev-maria`**
- Datenbank: MariaDB (lokal)
- Schema-Verwaltung: Flyway-Migrationen
- Hibernate-Modus: `validate` (nur Prüfung, keine Änderungen)
- Vorteil: Testen von persistentem Verhalten
- Verbindung: `jdbc:mariadb://localhost:3306/seed_db`

#### Production Environment

**Profil: `prod`**
- Datenbank: MariaDB (produktiv)
- Schema-Verwaltung: Flyway-Migrationen
- Hibernate-Modus: `validate`
- Migrations-Ablauf:
  1. Flyway prüft `flyway_schema_history` Tabelle
  2. Führt nur neue Migrations-Skripte aus (z.B. V2__, V3__, ...)
  3. Keine Daten-Initialisierung im Prod-Modus

### 3.8.4 Datenintegrität und Konsistenz

**Transaktionsmanagement:**
- Spring `@Transactional` auf Service-Layer
- ACID-Eigenschaften durch relationale Datenbank
- Cascade-Operationen definiert (z.B. `CascadeType.ALL` für EmployeeProfile)

**Orphan Removal:**
- Automatisches Löschen von verwaisten Subtasks beim Löschen eines Parent-Tasks
- Definiert durch `orphanRemoval = true` in JPA-Beziehungen

**Zyklus-Prävention:**
- Spezielle Validierung verhindert zirkuläre Task-Hierarchien
- Error Response: `400 Bad Request` mit detaillierter Fehlermeldung
- Sicherstellung einer echten Baum-Struktur

**Soft Delete vs. Hard Delete:**
- Aktuell: Hard Delete (physisches Löschen)
- Mögliche Erweiterung: Soft Delete mit `deleted_at` Timestamp für Audit-Trail

### 3.8.5 Backup und Recovery

**Empfohlene Strategien (nicht implementiert, aber Best Practice):**
- Regelmäßige MariaDB Backups (z.B. `mysqldump`)
- Point-in-Time Recovery durch Binary Logs
- Backup-Retention-Policy definieren
- Disaster-Recovery-Plan erstellen

---

## Zusammenfassung

Die ProSeed-Anwendung nutzt moderne Web-Technologien in einer klaren 3-Tier-Architektur. Das relationale Datenmodell mit 8 Hauptentitäten und 5 Zwischentabellen ermöglicht flexible Prozess- und Task-Verwaltung mit hierarchischen Strukturen. Die Datenqualität wird auf mehreren Ebenen (Datenbank, JPA, Service-Layer, API) sichergestellt. Die Verwendung von Flyway für Schema-Migrationen und verschiedene Profile (dev/prod) ermöglicht eine professionelle Entwicklungs- und Deployment-Pipeline.
