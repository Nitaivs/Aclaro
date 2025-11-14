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

@SpringBootTest
@AutoConfigureMockMvc
public class TaskCreateCircularValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTask_withSelfReferencingSubtree_shouldReturn400() throws Exception {
        // Create a process
        ObjectNode proc = objectMapper.createObjectNode().put("processName", "Create Cycle Proc");
        long processId = objectMapper.readTree(
            mockMvc.perform(post("/api/processes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(proc)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        ).get("processId").asLong();

        // Create an existing task X to reference
        ObjectNode xReq = objectMapper.createObjectNode().put("taskName", "X").put("completed", false);
        long xId = objectMapper.readTree(
            mockMvc.perform(post("/api/tasks?processId=" + processId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(xReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        ).get("taskId").asLong();

        // Now attempt to create a new Task A with subTasks including X, but make X reference itself in its subTasks
        ObjectNode aReq = objectMapper.createObjectNode()
            .put("taskName", "A").put("completed", false);
        var xDto = objectMapper.createObjectNode().put("taskId", xId);
        xDto.set("subTasks", objectMapper.createArrayNode().add(objectMapper.createObjectNode().put("taskId", xId))); // self-reference
        aReq.set("employeeIds", objectMapper.createArrayNode());
        aReq.set("subTasks", objectMapper.createArrayNode().add(xDto));

        mockMvc.perform(post("/api/tasks?processId=" + processId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aReq)))
            .andExpect(status().isBadRequest());
    }
}
