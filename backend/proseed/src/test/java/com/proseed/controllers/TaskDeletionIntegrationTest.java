package com.proseed.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
public class TaskDeletionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private long createProcess(String name) throws Exception {
        ObjectNode proc = objectMapper.createObjectNode().put("processName", name);
        return objectMapper.readTree(
            mockMvc.perform(post("/api/processes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(proc)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        ).get("processId").asLong();
    }

    private long createTask(long processId, String name) throws Exception {
        ObjectNode task = objectMapper.createObjectNode().put("taskName", name).put("completed", false);
        return objectMapper.readTree(
            mockMvc.perform(post("/api/tasks?processId=" + processId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        ).get("taskId").asLong();
    }

    @Test
    void deleteTask_withoutSubtasks_shouldSucceed() throws Exception {
        long processId = createProcess("Delete Proc Single");
        long taskId = createTask(processId, "Solo Task");

        // Delete
        mockMvc.perform(delete("/api/tasks/" + taskId))
            .andExpect(status().isNoContent());

        // Verify gone
        mockMvc.perform(get("/api/tasks/" + taskId))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteTask_withSubtasks_shouldFailAndKeepData() throws Exception {
        long processId = createProcess("Delete Proc Tree");
        // Create parent with embedded child in one request
        ObjectNode parentReq = objectMapper.createObjectNode()
            .put("taskName", "Parent")
            .put("completed", false);
        ObjectNode childReq = objectMapper.createObjectNode()
            .put("taskName", "Child")
            .put("completed", false);
        parentReq.set("subTasks", objectMapper.createArrayNode().add(childReq));

        var parentResp = objectMapper.readTree(
            mockMvc.perform(post("/api/tasks?processId=" + processId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(parentReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        );
        long parentId = parentResp.get("taskId").asLong();
        long childId = parentResp.get("subTasks").get(0).get("taskId").asLong();

        // Attempt delete parent - expect 400 (body may be empty)
        mockMvc.perform(delete("/api/tasks/" + parentId))
            .andExpect(status().isBadRequest());

        // Parent still exists
        mockMvc.perform(get("/api/tasks/" + parentId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.taskId").value(parentId));

        // Child still exists
        mockMvc.perform(get("/api/tasks/" + childId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.parentTaskId").value(parentId));
    }
}
