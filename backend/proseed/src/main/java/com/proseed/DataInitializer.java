package com.proseed;

import com.proseed.entities.*;
import com.proseed.repos.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;

import java.util.HashSet;
import java.util.List;

@Component
@Profile("dev") //this is only run in dev mode to fill some sample data
public class DataInitializer implements CommandLineRunner {
    @Autowired private RoleRepository roleRepository;
    @Autowired private PrivilegeRepository privilegeRepository;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private ProcessRepository processRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private EmployeeSkillRepository employeeSkillRepository;
    @Autowired private com.proseed.repos.DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() > 0 || processRepository.count() > 0) {
            return;
        }

        // Privileges
    Privilege privRead = new Privilege();
    Privilege privWrite = new Privilege();
    Privilege privDelete = new Privilege();
    privilegeRepository.saveAll(List.of(privRead, privWrite, privDelete));

        // Roles
    Role adminRole = new Role();
    adminRole.setName("ADMIN");
    //adminRole.setPrivileges(new HashSet<>(List.of(privRead, privWrite, privDelete)));
    Role userRole = new Role();
    userRole.setName("USER");
    //userRole.setPrivileges(new HashSet<>(List.of(privRead)));
    Role managerRole = new Role();
    managerRole.setName("MANAGER");
    //managerRole.setPrivileges(new HashSet<>(List.of(privRead, privWrite)));
    roleRepository.saveAll(List.of(adminRole, userRole, managerRole));

        // Employee Skills
    EmployeeSkill javaSkill = new EmployeeSkill();
    javaSkill.setName("Java");
    EmployeeSkill springSkill = new EmployeeSkill();
    springSkill.setName("Spring Boot");
    EmployeeSkill sqlSkill = new EmployeeSkill();
    sqlSkill.setName("SQL");
    EmployeeSkill reactSkill = new EmployeeSkill();
    reactSkill.setName("React");
    employeeSkillRepository.saveAll(List.of(javaSkill, springSkill, sqlSkill, reactSkill));

        // Departments
    Department deptBackend = new Department();
    deptBackend.setName("Backend");
    Department deptFrontend = new Department();
    deptFrontend.setName("Frontend");
    Department deptOps = new Department();
    deptOps.setName("Operations");
    departmentRepository.saveAll(List.of(deptBackend, deptFrontend, deptOps));

        // Employees & Profiles
    Employee alice = new Employee();
    alice.setFirstName("Alice");
    alice.setLastName("Smith");
    alice.setRole(adminRole);
    alice.setDepartment(deptBackend);
    alice.setEmployeeSkills(new HashSet<>(List.of(javaSkill, springSkill)));
    EmployeeProfile aliceProfile = new EmployeeProfile();
    aliceProfile.setDescription("Sample text one");
    aliceProfile.setEmployee(alice);
    alice.setProfile(aliceProfile);

    Employee bob = new Employee();
    bob.setFirstName("Bob");
    bob.setLastName("Jones");
    bob.setRole(userRole);
    bob.setDepartment(deptOps);
    bob.setEmployeeSkills(new HashSet<>(List.of(sqlSkill)));
    EmployeeProfile bobProfile = new EmployeeProfile();
    bobProfile.setDescription("Sample text two");
    bobProfile.setEmployee(bob);
    bob.setProfile(bobProfile);

    Employee carol = new Employee();
    carol.setFirstName("Carol");
    carol.setLastName("Taylor");
    carol.setRole(managerRole);
    carol.setDepartment(deptFrontend);
    carol.setEmployeeSkills(new HashSet<>(List.of(javaSkill, reactSkill)));
    EmployeeProfile carolProfile = new EmployeeProfile();
    carolProfile.setDescription("Sample text three");
    carolProfile.setEmployee(carol);
    carol.setProfile(carolProfile);

    // persist employees (profiles cascade)
    employeeRepository.saveAll(List.of(alice, bob, carol));

        // Processes
    ProcessEntity process1 = new ProcessEntity();
    process1.setName("Backend Development");
    process1.setDescription("Sample description abc123");
    ProcessEntity process2 = new ProcessEntity();
    process2.setName("Frontend Development");
    process2.setDescription("Sample description xyz789");
    processRepository.saveAll(List.of(process1, process2));

        // Tasks
        Task task1 = new Task();
        task1.setName("Design API");
        task1.setDescription("Design RESTful API endpoints.");
        task1.setCompleted(false);
        task1.setProcess(process1);
        task1.setEmployees(new HashSet<>(List.of(alice, carol)));

        Task task2 = new Task();
        task2.setName("Database Migration");
        task2.setDescription("Migrate legacy data to new schema.");
        task2.setCompleted(false);
        task2.setProcess(process1);
        task2.setEmployees(new HashSet<>(List.of(bob)));

        Task task3 = new Task();
        task3.setName("UI Prototype");
        task3.setDescription("Create initial React UI prototype.");
        task3.setCompleted(false);
        task3.setProcess(process2);
        task3.setEmployees(new HashSet<>(List.of(carol)));

        Task subTask1 = new Task();
        subTask1.setName("Sub Task");
        subTask1.setDescription("This is a sub-task of Design API.");
        subTask1.setCompleted(false);
        subTask1.setProcess(process1);
        subTask1.setParentTask(task1);

        if (task1.getSubTasks() == null) {
            task1.setSubTasks(new HashSet<>());
        }
        task1.getSubTasks().add(subTask1);

        Task subTask2 = new Task();
        subTask2.setName("Sub Task 2");
        subTask2.setDescription("This is another sub-task of Design API.");
        subTask2.setCompleted(false);
        subTask2.setProcess(process1);
        subTask2.setParentTask(task1);
        task1.getSubTasks().add(subTask2);

        Task subTask3 = new Task();
        subTask3.setName("Sub Task 3");
        subTask3.setDescription("This is a sub-task of sub task 1.");
        subTask3.setCompleted(false);
        subTask3.setProcess(process1);
        subTask3.setParentTask(subTask1);
        if (subTask1.getSubTasks() == null) {
            subTask1.setSubTasks(new HashSet<>());
        }
        subTask1.getSubTasks().add(subTask3);

        Task subTask4 = new Task();
        subTask4.setName("Sub Task 4");
        subTask4.setDescription("This is a sub-task of sub task 2.");
        subTask4.setCompleted(false);
        subTask4.setProcess(process1);
        subTask4.setParentTask(subTask3);
        if (subTask3.getSubTasks() == null) {
            subTask3.setSubTasks(new HashSet<>());
        }
        subTask3.getSubTasks().add(subTask4);

        Task subTask5 = new Task();
        subTask5.setName("Sub Task 5");
        subTask5.setDescription("This is a sub-task of sub task 2.");
        subTask5.setCompleted(false);
        subTask5.setProcess(process1);
        subTask5.setParentTask(subTask3);
        subTask3.getSubTasks().add(subTask5);

        taskRepository.saveAll(List.of(task1, task2, task3));
    }
}
