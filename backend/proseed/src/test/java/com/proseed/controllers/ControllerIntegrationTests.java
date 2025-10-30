package com.proseed.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
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
        mockMvc.perform(get("/api/employees"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        String createEmployeeJson = "{" +
            "\"employeeId\":999," +
            "\"firstName\":\"Dana\"," +
            "\"lastName\":\"Adams\"}";

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createEmployeeJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.employeeId").value(999))
            .andExpect(jsonPath("$.firstName").value("Dana"));

        assertThat(employeeRepository.findById(999L)).isPresent();

        String updateEmployeeJson = "{" +
            "\"employeeId\":999," +
            "\"firstName\":\"Dana\"," +
            "\"lastName\":\"Cooper\"}";

        mockMvc.perform(put("/api/employees/{id}", 999)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateEmployeeJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.lastName").value("Cooper"));

        mockMvc.perform(delete("/api/employees/{id}", 999))
            .andExpect(status().isNoContent());

        assertThat(employeeRepository.findById(999L)).isEmpty();
    }

    @Test
    void taskControllerCrudFlow() throws Exception {
        ProcessEntity process = new ProcessEntity();
        process.setProcessName("Integration Process");
        process = processRepository.save(process);

        String createTaskJson = "{" +
            "\"taskName\":\"Integration Task\"," +
            "\"taskDescription\":\"Created via integration test\"," +
            "\"completed\":false}";

        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(process.getProcessId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(createTaskJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.taskName").value("Integration Task"))
            .andExpect(jsonPath("$.completed").value(false))
            .andReturn();

        Task createdTask = objectMapper.readValue(createResult.getResponse().getContentAsString(), Task.class);
        Long taskId = createdTask.getTaskId();
        assertThat(taskId).isNotNull();
        assertThat(taskRepository.findById(taskId)).isPresent();

        String updateTaskJson = "{" +
            "\"taskName\":\"Updated Task\"," +
            "\"taskDescription\":\"Updated via integration test\"," +
            "\"completed\":true}";

        mockMvc.perform(put("/api/tasks/{id}", taskId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateTaskJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.taskDescription").value("Updated via integration test"))
            .andExpect(jsonPath("$.completed").value(true));

        mockMvc.perform(delete("/api/tasks/{id}", taskId))
            .andExpect(status().isNoContent());

        assertThat(taskRepository.findById(taskId)).isEmpty();
        processRepository.deleteById(process.getProcessId());
    }

    @Test
    void processControllerReadEndpoints() throws Exception {
        ProcessEntity process = new ProcessEntity();
        process.setProcessName("QA Review");
        process = processRepository.save(process);

        mockMvc.perform(get("/api/processes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[*].processName", hasItem("QA Review")));

        mockMvc.perform(get("/api/processes/{id}", process.getProcessId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.processName").value("QA Review"));

        processRepository.deleteById(process.getProcessId());
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
        process.setProcessName("Task Negative Process");
        process = processRepository.save(process);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"taskName\":\"Missing Process\"}"))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(process.getProcessId() + 9999))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"taskName\":\"Unknown Process\"}"))
            .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/tasks/{id}", 987654321L))
            .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/tasks/{id}", 987654321L))
            .andExpect(status().isNotFound());

        processRepository.deleteById(process.getProcessId());
    }

    @Test
    void processControllerNotFound() throws Exception {
        mockMvc.perform(get("/api/processes/{id}", 1357911L))
            .andExpect(status().isNotFound());
    }
}
