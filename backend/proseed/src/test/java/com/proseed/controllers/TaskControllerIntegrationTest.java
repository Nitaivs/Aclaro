package com.proseed.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
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
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @RegisterExtension
    static TestSummaryExtension summary = TestSummaryExtension.forSuite("TaskController");

    private long createProcess(String name) throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("processName", name)
            .put("processDescription", name + " desc");
        String json = mockMvc.perform(post("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("processId").asLong();
    }

    private long createEmployee(String first, String last) throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("firstName", first)
            .put("lastName", last);
        String json = mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("employeeId").asLong();
    }

    private long createTask(long processId, String name) throws Exception {
        ObjectNode task = objectMapper.createObjectNode()
            .put("taskName", name)
            .put("completed", false);
        String json = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("taskId").asLong();
    }

    @Test
    void getAllTasks_shouldReturnOk() throws Exception {
        long processId = createProcess("Tasks List Process");
        createTask(processId, "List Task");

        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void getTaskById_shouldReturnTask() throws Exception {
        long processId = createProcess("Get Task Process");
        long taskId = createTask(processId, "Detail Task");

        mockMvc.perform(get("/api/tasks/{id}", taskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.taskId").value(taskId));
    }

    @Test
    void getTaskById_missing_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", 888888L))
            .andExpect(status().isNotFound());
    }

    @Test
    void getTaskEmployees_shouldReturnList() throws Exception {
        long processId = createProcess("Task Employees Process");
        long employeeId = createEmployee("Task", "Owner");
        ObjectNode body = objectMapper.createObjectNode()
            .put("taskName", "Assigned Task")
            .put("completed", false);
        ArrayNode employeeIds = objectMapper.createArrayNode().add(employeeId);
        body.set("employeeIds", employeeIds);
        String json = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        long taskId = objectMapper.readTree(json).get("taskId").asLong();

        mockMvc.perform(get("/api/tasks/{id}/employees", taskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.taskId").value(taskId))
            .andExpect(jsonPath("$.assignedEmployees", hasSize(1)));
    }

    @Test
    void getTaskEmployees_missingTask_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}/employees", 454545L))
            .andExpect(status().isNotFound());
    }

    @Test
    void createTask_shouldReturn201() throws Exception {
        long processId = createProcess("Task Create Process");
        ObjectNode body = objectMapper.createObjectNode()
            .put("taskName", "Create Task")
            .put("completed", false);

        mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.taskId").exists());
    }

    @Test
    void createTask_missingProcess_shouldReturn400() throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("taskName", "No Process")
            .put("completed", false);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void createTask_invalidParent_shouldReturn400() throws Exception {
        long processId = createProcess("Task Invalid Parent");
        ObjectNode body = objectMapper.createObjectNode()
            .put("taskName", "Orphan")
            .put("completed", false)
            .put("parentTaskId", 999999L);

        mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void updateTask_shouldReturnUpdated() throws Exception {
        long processId = createProcess("Task Update Process");
        long taskId = createTask(processId, "Original Name");
        ObjectNode body = objectMapper.createObjectNode()
            .put("taskId", taskId)
            .put("taskName", "Updated Name")
            .put("completed", true);

        mockMvc.perform(put("/api/tasks/{id}", taskId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.taskName").value("Updated Name"))
            .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void updateTask_missing_shouldReturn404() throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("taskName", "Missing");

        mockMvc.perform(put("/api/tasks/{id}", 101010L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteTask_leaf_shouldReturn204() throws Exception {
        long processId = createProcess("Task Delete Leaf");
        long taskId = createTask(processId, "Leaf Task");

        mockMvc.perform(delete("/api/tasks/{id}", taskId))
            .andExpect(status().isNoContent());
    }

    @Test
    void deleteTask_withSubtask_shouldReturn400() throws Exception {
        long processId = createProcess("Task Delete Tree");
        ObjectNode parent = objectMapper.createObjectNode()
            .put("taskName", "Parent")
            .put("completed", false);
        ArrayNode subs = objectMapper.createArrayNode();
        subs.add(objectMapper.createObjectNode().put("taskName", "Child").put("completed", false));
        parent.set("subTasks", subs);

        String json = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(parent)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        long parentId = objectMapper.readTree(json).get("taskId").asLong();

        mockMvc.perform(delete("/api/tasks/{id}", parentId))
            .andExpect(status().isBadRequest());
    }

    @Test
    void deleteTask_missing_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/tasks/{id}", 616161L))
            .andExpect(status().isNotFound());
    }

    @Test
    void removeEmployeeFromTask_shouldReturn204() throws Exception {
        long processId = createProcess("Remove Employee Process");
        long employeeId = createEmployee("Remove", "Me");
        ObjectNode body = objectMapper.createObjectNode()
            .put("taskName", "Task With Employee")
            .put("completed", false);
        body.set("employeeIds", objectMapper.createArrayNode().add(employeeId));
        String json = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        long taskId = objectMapper.readTree(json).get("taskId").asLong();

        mockMvc.perform(delete("/api/tasks/{taskId}/employees/{employeeId}", taskId, employeeId))
            .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/tasks/{id}", taskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.employeeIds", hasSize(0)));
    }

    @Test
    void removeEmployee_missingTask_shouldReturn404() throws Exception {
        long employeeId = createEmployee("Missing", "Task");

        mockMvc.perform(delete("/api/tasks/{taskId}/employees/{employeeId}", 989898L, employeeId))
            .andExpect(status().isNotFound());
    }

    @Test
    void getTasks_shouldRejectCircularUpdate() throws Exception {
        long processId = createProcess("Task Circular Inline");
        long parentId = createTask(processId, "Parent");
        long childId = createTask(processId, "Child");

        ObjectNode update = objectMapper.createObjectNode()
            .put("taskId", parentId)
            .put("taskName", "Parent")
            .set("subTasks", objectMapper.createArrayNode().add(objectMapper.createObjectNode().put("taskId", childId)));

        mockMvc.perform(put("/api/tasks/{id}", parentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(update)))
            .andExpect(status().isOk());

        // Attempt to set parent as child of its own child -> expect 400
        ObjectNode invalid = objectMapper.createObjectNode()
            .put("taskId", childId)
            .put("taskName", "Child")
            .set("subTasks", objectMapper.createArrayNode().add(objectMapper.createObjectNode().put("taskId", parentId)));

        mockMvc.perform(put("/api/tasks/{id}", childId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest());
    }
}
