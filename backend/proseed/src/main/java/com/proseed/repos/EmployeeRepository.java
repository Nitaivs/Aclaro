package com.proseed.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proseed.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
