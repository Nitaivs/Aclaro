package com.proseed.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.proseed.support.TestSummaryExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EmployeeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @RegisterExtension
    static TestSummaryExtension summary = TestSummaryExtension.forSuite("EmployeeController");

    private long createEmployee(String first, String last) throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("firstName", first)
            .put("lastName", last);
        String json = mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        JsonNode node = objectMapper.readTree(json);
        return node.get("employeeId").asLong();
    }

    @Test
    void getAllEmployees_shouldReturnOk() throws Exception {
        createEmployee("List", "Employee");

        mockMvc.perform(get("/api/employees"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void getEmployeeById_shouldReturnEmployee() throws Exception {
        long id = createEmployee("Detail", "Employee");

        mockMvc.perform(get("/api/employees/{id}", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.employeeId").value(id));
    }

    @Test
    void getEmployeeById_missing_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/employees/{id}", 777777L))
            .andExpect(status().isNotFound());
    }

    @Test
    void createEmployee_shouldReturn201() throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("firstName", "Create")
            .put("lastName", "Pass");

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.employeeId").exists());
    }

    @Test
    void createEmployee_invalidJson_shouldReturn400() throws Exception {
        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content("not-json"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void updateEmployee_shouldReturnUpdated() throws Exception {
        long id = createEmployee("First", "Original");
        ObjectNode body = objectMapper.createObjectNode()
            .put("firstName", "First")
            .put("lastName", "Updated");

        mockMvc.perform(put("/api/employees/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.lastName").value("Updated"));
    }

    @Test
    void updateEmployee_missing_shouldReturn404() throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("firstName", "Ghost")
            .put("lastName", "User");

        mockMvc.perform(put("/api/employees/{id}", 909090L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isNotFound());
    }

    @Test
    void patchEmployee_shouldReturnUpdatedField() throws Exception {
        long id = createEmployee("Patch", "Employee");
        ObjectNode patch = objectMapper.createObjectNode()
            .put("lastName", "Partial");

        mockMvc.perform(patch("/api/employees/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(patch)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.lastName").value("Partial"));
    }

    @Test
    void patchEmployee_missing_shouldReturn404() throws Exception {
        ObjectNode patch = objectMapper.createObjectNode()
            .put("lastName", "None");

        mockMvc.perform(patch("/api/employees/{id}", 123123L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(patch)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteEmployee_shouldReturn204() throws Exception {
        long id = createEmployee("Delete", "Me");

        mockMvc.perform(delete("/api/employees/{id}", id))
            .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/employees/{id}", id))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteEmployee_missing_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/employees/{id}", 565656L))
            .andExpect(status().isNotFound());
    }
}
