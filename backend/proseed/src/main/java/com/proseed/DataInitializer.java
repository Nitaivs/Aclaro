package com.proseed;

import com.proseed.entities.*;
import com.proseed.repos.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired private RoleRepository roleRepository;
    @Autowired private PrivilegeRepository privilegeRepository;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private ProcessRepository processRepository;
    @Autowired private TaskRepository taskRepository;

    @Override
    public void run(String... args) throws Exception {
        Privilege privOne = new Privilege();
        Privilege privTwo = new Privilege();
        privilegeRepository.saveAll(List.of(privOne, privTwo));

        Role adminRole = new Role();
        adminRole.setRoleName("ADMIN");
        adminRole.setPrivileges(new HashSet<>(List.of(privOne, privTwo)));
        Role userRole = new Role();
        userRole.setRoleName("USER");
        userRole.setPrivileges(new HashSet<>(List.of(privOne)));
        roleRepository.saveAll(List.of(adminRole, userRole));

        Employee alice = new Employee();
        alice.setEmployeeId(1L);
        alice.setFirstName("Alice");
        alice.setLastName("Smith");
        alice.setRole(adminRole);
        Employee bob = new Employee();
        bob.setEmployeeId(2L);
        bob.setFirstName("Bob");
        bob.setLastName("Jones");
        bob.setRole(userRole);
        employeeRepository.saveAll(List.of(alice, bob));

        com.proseed.entities.Process process = new com.proseed.entities.Process();
        process.setProcessName("Sample Process");
        processRepository.save(process);

        Task task1 = new Task();
        task1.setTaskName("Design");
        task1.setTaskDescription("Design the system");
        task1.setCompleted(false);
        task1.setProcess(process);
        task1.setEmployees(new HashSet<>(List.of(alice, bob)));

        Task task2 = new Task();
        task2.setTaskName("Implementation");
        task2.setTaskDescription("Implement the system");
        task2.setCompleted(false);
        task2.setProcess(process);
        task2.setEmployees(new HashSet<>(List.of(alice)));

        taskRepository.saveAll(List.of(task1, task2));
    }
}
