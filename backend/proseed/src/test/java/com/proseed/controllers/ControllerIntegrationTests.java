package com.proseed.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proseed.entities.ProcessEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.proseed.DTOs.ProcessDTO;
import com.proseed.DTOs.ProcessWithTaskInfoDTO;
import com.proseed.DTOs.TaskDTO;
import com.proseed.repos.EmployeeRepository;
import com.proseed.repos.ProcessRepository;
import com.proseed.repos.TaskRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProcessRepository processRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void employeeControllerCrudFlow() throws Exception {
        System.out.println("[TEST] employeeControllerCrudFlow: START");
        mockMvc.perform(get("/api/employees"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        String createEmployeeJson = "{" +
            "\"firstName\":\"Dana\"," +
            "\"lastName\":\"Adams\"}";

        MvcResult empCreateRes = mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createEmployeeJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.firstName").value("Dana"))
            .andReturn();
        JsonNode empNode = objectMapper.readTree(empCreateRes.getResponse().getContentAsString());
        long createdEmpId = empNode.get("employeeId").asLong();
        System.out.println("[TEST] Created employee id: " + createdEmpId);

        assertThat(employeeRepository.findById(createdEmpId)).isPresent();

        String updateEmployeeJson = "{" +
            "\"firstName\":\"Dana\"," +
            "\"lastName\":\"Cooper\"}";

        mockMvc.perform(put("/api/employees/{id}", createdEmpId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateEmployeeJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.lastName").value("Cooper"));
        System.out.println("[TEST] Updated employee: " + employeeRepository.findById(createdEmpId));

        mockMvc.perform(delete("/api/employees/{id}", createdEmpId))
            .andExpect(status().isNoContent());
        System.out.println("[TEST] Deleted employee: " + employeeRepository.findById(createdEmpId));

        assertThat(employeeRepository.findById(createdEmpId)).isEmpty();
        System.out.println("[TEST] employeeControllerCrudFlow: END");
    }

    @Test
    void taskControllerCrudFlow() throws Exception {
        System.out.println("[TEST] taskControllerCrudFlow: START");
        ProcessEntity process = new ProcessEntity();
        process.setName("Integration Process");
        process = processRepository.save(process);

        String createTaskJson = "{" +
            "\"name\":\"Integration Task\"," +
            "\"description\":\"Created via integration test\"," +
            "\"completed\":false," +
            "\"subTasks\":[" +
            "{\"name\":\"Child A\",\"completed\":false}," +
            "{\"name\":\"Child B\",\"completed\":true}" +
            "]}";

        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(process.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(createTaskJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Integration Task"))
            .andExpect(jsonPath("$.completed").value(false))
            .andExpect(jsonPath("$.subTasks", hasSize(2)))
            .andReturn();
        JsonNode taskNode = objectMapper.readTree(createResult.getResponse().getContentAsString());
        Long taskId = taskNode.get("id").asLong();
        System.out.println("[TEST] Created task id: " + taskId);
        assertThat(taskId).isNotNull();
        assertThat(taskRepository.findById(taskId)).isPresent();

        String updateTaskJson = "{" +
            "\"name\":\"Updated Task\"," +
            "\"description\":\"Updated via integration test\"," +
            "\"completed\":true}";

    mockMvc.perform(put("/api/tasks/{id}", taskId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateTaskJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.description").value("Updated via integration test"))
            .andExpect(jsonPath("$.completed").value(true));
    System.out.println("[TEST] Updated task present: " + taskRepository.findById(taskId).isPresent());

    // Attempt to delete task that still has subtasks should fail with 400
    mockMvc.perform(delete("/api/tasks/{id}", taskId))
            .andExpect(status().isBadRequest());
    System.out.println("[TEST] Delete blocked for task with subtasks (expected). Present? " + taskRepository.findById(taskId).isPresent());

        assertThat(taskRepository.findById(taskId)).isPresent();
        processRepository.deleteById(process.getId());
        System.out.println("[TEST] taskControllerCrudFlow: END");
    }

    @Test
    void processControllerReadEndpoints() throws Exception {
        System.out.println("[TEST] processControllerReadEndpoints: START");
        ProcessEntity process = new ProcessEntity();
        process.setName("QA Review");
        process = processRepository.save(process);

        // Create two top-level tasks (one with a subtask) under this process
        String t1Json = "{" +
            "\"name\":\"Root One\",\"completed\":false" +
            "}";
        String t2Json = "{" +
            "\"name\":\"Root Two\",\"completed\":false,\"subTasks\":[" +
            "{\"name\":\"Child of Two\",\"completed\":true}" +
            "]}";

        mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(process.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(t1Json))
            .andExpect(status().isCreated());
        mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(process.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(t2Json))
            .andExpect(status().isCreated());

        mockMvc.perform(get("/api/processes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[*].name", hasItem("QA Review")));
        System.out.println("[TEST] Listed processes, checked for QA Review");

        mockMvc.perform(get("/api/processes/{id}", process.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("QA Review"));
        System.out.println("[TEST] Got process by id: " + process.getId());

        // Validate tasks endpoint returns top-level tasks with nested subtasks
        mockMvc.perform(get("/api/processes/{id}/tasks", process.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(process.getId()))
            .andExpect(jsonPath("$.tasks", hasSize(2)))
            .andExpect(jsonPath("$.tasks[0].name").exists())
            // Don't rely on order; assert the subtask name exists anywhere
            .andExpect(jsonPath("$.tasks..name", hasItem("Child of Two")));

        processRepository.deleteById(process.getId());
        System.out.println("[TEST] Deleted process: " + process.getId());
        System.out.println("[TEST] processControllerReadEndpoints: END");
    }

    @Test
    void employeeControllerNotFoundPaths() throws Exception {
        long missingId = 123456789L;

        mockMvc.perform(get("/api/employees/{id}", missingId))
            .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/employees/{id}", missingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"Ghost\",\"lastName\":\"User\"}"))
            .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/employees/{id}", missingId))
            .andExpect(status().isNotFound());
    }

    @Test
    void taskControllerNegativeScenarios() throws Exception {
        ProcessEntity process = new ProcessEntity();
        process.setName("Task Negative Process");
        process = processRepository.save(process);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Missing Process\"}"))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(process.getId() + 9999))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Unknown Process\"}"))
            .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/tasks/{id}", 987654321L))
            .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/tasks/{id}", 987654321L))
            .andExpect(status().isNotFound());

        processRepository.deleteById(process.getId());
    }

    @Test
    void processControllerNotFound() throws Exception {
        mockMvc.perform(get("/api/processes/{id}", 1357911L))
            .andExpect(status().isNotFound());
    }
}
