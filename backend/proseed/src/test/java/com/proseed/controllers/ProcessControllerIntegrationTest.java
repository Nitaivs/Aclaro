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
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProcessControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @RegisterExtension
    static TestSummaryExtension summary = TestSummaryExtension.forSuite("ProcessController");

    private long createProcess(String name) throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("name", name)
            .put("description", name + " description");

        String json = mockMvc.perform(post("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        JsonNode node = objectMapper.readTree(json);
        return node.get("id").asLong();
    }

    private void createTask(long processId, String taskName) throws Exception {
        ObjectNode task = objectMapper.createObjectNode()
            .put("name", taskName)
            .put("completed", false);
        mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isCreated());
    }

    @Test
    void getAllProcesses_shouldReturnOkList() throws Exception {
        createProcess("Process List");

        mockMvc.perform(get("/api/processes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void getProcessById_shouldReturnProcess() throws Exception {
        long id = createProcess("Process Detail");

        mockMvc.perform(get("/api/processes/{id}", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.name").value("Process Detail"));
    }

    @Test
    void getProcessById_missing_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/processes/{id}", 999999L))
            .andExpect(status().isNotFound());
    }

    @Test
    void getProcessTasks_shouldReturnNestedTasks() throws Exception {
        long id = createProcess("Process Tasks");
        createTask(id, "Task A");
        createTask(id, "Task B");

        mockMvc.perform(get("/api/processes/{id}/tasks", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.tasks", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    void getProcessTasks_missingProcess_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/processes/{id}/tasks", 424242L))
            .andExpect(status().isNotFound());
    }

    @Test
    void createProcess_shouldReturn201() throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("name", "Created Process")
            .put("description", "Docs");

        mockMvc.perform(post("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void createProcess_missingName_shouldReturn400() throws Exception {
        ObjectNode body = objectMapper.createObjectNode();

        mockMvc.perform(post("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void updateProcess_shouldReturnUpdated() throws Exception {
        long id = createProcess("Update Target");
        ObjectNode body = objectMapper.createObjectNode()
            .put("name", "Updated Name")
            .put("description", "Updated Desc");

        mockMvc.perform(put("/api/processes/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    void updateProcess_missing_shouldReturn404() throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("name", "Nothing");

        mockMvc.perform(put("/api/processes/{id}", 121212L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteProcess_shouldReturn204() throws Exception {
        long id = createProcess("Delete Me");

        mockMvc.perform(delete("/api/processes/{id}", id))
            .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/processes/{id}", id))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteProcess_missing_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/processes/{id}", 333333L))
            .andExpect(status().isNotFound());
    }
}
