package com.proseed.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TaskEmployeeEndpointsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void removeEmployeeFromTask_and_patchEmployee_shouldWork() throws Exception {
        // Ensure we have an existing task 1 with employee 1 assigned using dev DataInitializer assumptions
        MvcResult beforeTaskEmp = mockMvc.perform(get("/api/tasks/1/employees"))
            .andExpect(status().isOk()).andReturn();
        JsonNode beforeJson = objectMapper.readTree(beforeTaskEmp.getResponse().getContentAsString());
        assertThat(beforeJson.get("taskId").asLong()).isEqualTo(1L);

        // Remove employee 1 from task 1
        mockMvc.perform(delete("/api/tasks/1/employees/1"))
            .andExpect(status().isNoContent());

        // Verify employee 1 no longer listed
        mockMvc.perform(get("/api/tasks/1/employees"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.assignedEmployees[?(@.employeeId == 1)]").doesNotExist());

        // Idempotency: second delete also returns 204
        mockMvc.perform(delete("/api/tasks/1/employees/1"))
            .andExpect(status().isNoContent());

        // PATCH employee 1 last name
        ObjectNode patch = objectMapper.createObjectNode().put("lastName", "Smith-Patched-ByTest");
        MvcResult patchRes = mockMvc.perform(patch("/api/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(patch)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.lastName").value("Smith-Patched-ByTest"))
            .andReturn();

        JsonNode empJson = objectMapper.readTree(patchRes.getResponse().getContentAsString());
        assertThat(empJson.get("employeeId").asLong()).isEqualTo(1L);
    }
}
