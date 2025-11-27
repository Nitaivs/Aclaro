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
public class TaskCircularUpdateIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void preventCircularReparenting_shouldReturn400() throws Exception {
        // Create a fresh process
        ObjectNode proc = objectMapper.createObjectNode()
            .put("name", "Cycle Test Process");
        long processId = objectMapper.readTree(
            mockMvc.perform(post("/api/processes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(proc)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        ).get("id").asLong();

        // Create A
        ObjectNode aReq = objectMapper.createObjectNode().put("name", "A").put("completed", false);
        long aId = objectMapper.readTree(
            mockMvc.perform(post("/api/tasks?processId=" + processId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(aReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        ).get("id").asLong();

        // Create B
        ObjectNode bReq = objectMapper.createObjectNode().put("name", "B").put("completed", false);
        long bId = objectMapper.readTree(
            mockMvc.perform(post("/api/tasks?processId=" + processId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(bReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
        ).get("id").asLong();

        // Set A -> [B]
        ObjectNode aUpdate = objectMapper.createObjectNode()
            .put("id", aId)
            .put("name", "A")
            .put("completed", false);
        aUpdate.set("employeeIds", objectMapper.createArrayNode());
        aUpdate.set("subTasks", objectMapper.createArrayNode().add(objectMapper.createObjectNode().put("id", bId)));
        mockMvc.perform(put("/api/tasks/" + aId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aUpdate)))
            .andExpect(status().isOk());

        // Now try to make B -> [A] (would create a cycle). Expect 400
        ObjectNode bUpdate = objectMapper.createObjectNode()
            .put("id", bId)
            .put("name", "B")
            .put("completed", false);
        bUpdate.set("employeeIds", objectMapper.createArrayNode());
        bUpdate.set("subTasks", objectMapper.createArrayNode().add(objectMapper.createObjectNode().put("id", aId)));

        mockMvc.perform(put("/api/tasks/" + bId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bUpdate)))
            .andExpect(status().isBadRequest());
    }
}
