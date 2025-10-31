package com.proseed;

import com.proseed.entities.*;
import com.proseed.repos.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;

import java.util.Set;
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
        adminRole.setRoleName("ADMIN");
        adminRole.setPrivileges(new HashSet<>(List.of(privRead, privWrite, privDelete)));
        Role userRole = new Role();
        userRole.setRoleName("USER");
        userRole.setPrivileges(new HashSet<>(List.of(privRead)));
        Role managerRole = new Role();
        managerRole.setRoleName("MANAGER");
        managerRole.setPrivileges(new HashSet<>(List.of(privRead, privWrite)));
        roleRepository.saveAll(List.of(adminRole, userRole, managerRole));

        // Employee Skills
        EmployeeSkill javaSkill = new EmployeeSkill();
        javaSkill.setSkillName("Java");
        EmployeeSkill springSkill = new EmployeeSkill();
        springSkill.setSkillName("Spring Boot");
        EmployeeSkill sqlSkill = new EmployeeSkill();
        sqlSkill.setSkillName("SQL");
        EmployeeSkill reactSkill = new EmployeeSkill();
        reactSkill.setSkillName("React");
        employeeSkillRepository.saveAll(List.of(javaSkill, springSkill, sqlSkill, reactSkill));

        // Employees & Profiles
        Employee alice = new Employee();
        alice.setEmployeeId(1L);
        alice.setFirstName("Alice");
        alice.setLastName("Smith");
        alice.setRole(adminRole);
        alice.setEmployeeSkills(new HashSet<>(List.of(javaSkill, springSkill)));
        EmployeeProfile aliceProfile = new EmployeeProfile();
        aliceProfile.setDescription("Sample text one");
        aliceProfile.setEmployee(alice);
        alice.setProfile(aliceProfile);

        Employee bob = new Employee();
        bob.setEmployeeId(2L);
        bob.setFirstName("Bob");
        bob.setLastName("Jones");
        bob.setRole(userRole);
        bob.setEmployeeSkills(new HashSet<>(List.of(sqlSkill)));
        EmployeeProfile bobProfile = new EmployeeProfile();
        bobProfile.setDescription("Sample text two");
        bobProfile.setEmployee(bob);
        bob.setProfile(bobProfile);

        Employee carol = new Employee();
        carol.setEmployeeId(3L);
        carol.setFirstName("Carol");
        carol.setLastName("Taylor");
        carol.setRole(managerRole);
        carol.setEmployeeSkills(new HashSet<>(List.of(javaSkill, reactSkill)));
        EmployeeProfile carolProfile = new EmployeeProfile();
        carolProfile.setDescription("Sample text three");
        carolProfile.setEmployee(carol);
        carol.setProfile(carolProfile);

        employeeRepository.saveAll(List.of(alice, bob, carol));

        // Processes
        com.proseed.entities.ProcessEntity process1 = new com.proseed.entities.ProcessEntity();
        process1.setProcessName("Backend Development");
        com.proseed.entities.ProcessEntity process2 = new com.proseed.entities.ProcessEntity();
        process2.setProcessName("Frontend Development");
        processRepository.saveAll(List.of(process1, process2));

        // Tasks
        Task task1 = new Task();
        task1.setTaskName("Design API");
        task1.setTaskDescription("Design RESTful API endpoints.");
        task1.setCompleted(false);
        task1.setProcess(process1);
        task1.setEmployees(new HashSet<>(List.of(alice, carol)));

        Task task2 = new Task();
        task2.setTaskName("Database Migration");
        task2.setTaskDescription("Migrate legacy data to new schema.");
        task2.setCompleted(false);
        task2.setProcess(process1);
        task2.setEmployees(new HashSet<>(List.of(bob)));

        Task task3 = new Task();
        task3.setTaskName("UI Prototype");
        task3.setTaskDescription("Create initial React UI prototype.");
        task3.setCompleted(false);
        task3.setProcess(process2);
        task3.setEmployees(new HashSet<>(List.of(carol)));

        taskRepository.saveAll(List.of(task1, task2, task3));
    }
}
