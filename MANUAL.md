# User Manual

---

## Overview

---

There are five main pages in the application; the process list page, the process page, the task list page, the employee list page, and the tags list page.
Each list page can be accessed from the navigation bar on the left side of the screen.
By default, the application will open on the process list page.

---

## Process List Page

On the process list page, the user can see a list of active processes. A new process can be added by clicking the 'Add Process' button, which opens a dialog where the user can enter the process name and an optional description.
Once a process has been added, the user can click on a process item in the process list page to access the process' page.
Processes can be edited or deleted from this page by clicking the corresponding icons to the right of each process item.
The list of processes can be filtered by name by typing in the search bar at the top of the page.

NOTE: Deleting a process will also delete all tasks associated with that process.

---

## Process Page

On the process page, the user will see visualization of the tasks associated with the process and the flow of those tasks in a tree-like structure.
Newly created processes don't have any tasks associated with them, so the user must create some tasks.
The user can click on the plus icon to the right of a process or task node to add a new task connected to that node.
When creating a new task, the user must enter a name and, optionally, a description.
Tasks can also be added between existing tasks by clicking the plus icon that appears when hovering over a connection line between two tasks.

The process can be edited or deleted by clicking the corresponding icons in the top right corner of the page.

The user can click on a task node to open a popup with more details about the task. In this popup, the user can edit or delete the task. Clicking the edit icon will open a dialog where the user can change the task's name, description, responsible department, and any needed skills.

NOTE: Deleting a task with child tasks is currently not supported, and the backend will return an error if attempted.

---

## Task List Page

On this page, the user can see created tasks.
Tasks can be edited or deleted by clicking the corresponding icons to the right of each task item.
Clicking on a task item will open a popup with more details about the task.
The list of tasks can be filtered by name using the search bar at the top of the page.

---

## Task Detail Page

In the task detail popup, you can either edit or remove the task.
Clicking edit icon will bring up a dialog  where you can assign its name, description, responsible department and any related skills.

---

## Employee List Page

The employee list page shows a list of all employees in the system.
New employees can be added by clicking the 'Add Employee' button, which opens a dialog where the user can enter the employee's first and last name.
Employees can be edited or deleted by clicking the corresponding icons to the right of each employee item.
Clicking the edit icon will open a dialog where the user can change the employee's first name, last name, department, and skills.
The list of employees can be filtered by name using the search bar at the top of the page.

---

## Tag list page

The tag list page shows all departments and skill tags in the system.
A new department or skill tag can be added by clicking the 'Add Tag' button, which opens a dialog where the user can enter the tag name and select whether it is a department or skill tag.
Department and skill tags can be edited and delete by pressing the corresponding icons.

Note: department editing may not be enabled by default.
