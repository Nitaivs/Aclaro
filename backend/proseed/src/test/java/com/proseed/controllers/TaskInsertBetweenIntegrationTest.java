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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the "insert task between" feature.
 * This feature allows creating a new task between two existing tasks
 * in the parent-child hierarchy.
 * 
 * Given: Parent Task A -> Child Task B
 * When: Insert new Task C between A and B
 * Then: Parent Task A -> New Task C -> Child Task B
 */
@SpringBootTest
@AutoConfigureMockMvc
public class TaskInsertBetweenIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private long createProcess(String name) throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("name", name)
            .put("description", name + " desc");
        String json = mockMvc.perform(post("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    private long createTask(long processId, String name) throws Exception {
        ObjectNode task = objectMapper.createObjectNode()
            .put("name", name)
            .put("completed", false);
        String json = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    private long createTaskWithParent(long processId, String name, long parentTaskId) throws Exception {
        ObjectNode task = objectMapper.createObjectNode()
            .put("name", name)
            .put("completed", false)
            .put("parentTaskId", parentTaskId);
        String json = mockMvc.perform(post("/api/tasks")
                .param("processId", String.valueOf(processId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    /**
     * Test inserting a new task between a parent and child task.
     * 
     * Initial: TaskA (parent) -> TaskB (child)
     * After:   TaskA (parent) -> NewTask (middle) -> TaskB (child)
     */
    @Test
    void insertTaskBetween_shouldCreateTaskAndReparentChild() throws Exception {
        // Setup: Create process and initial parent-child hierarchy
        long processId = createProcess("Insert Between Process");
        long parentTaskId = createTask(processId, "Parent Task A");
        long childTaskId = createTaskWithParent(processId, "Child Task B", parentTaskId);

        // Verify initial hierarchy: B's parent is A
        mockMvc.perform(get("/api/tasks/{id}", childTaskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.parentTaskId").value(parentTaskId));

        // Create request body for the new task to insert between
        ObjectNode insertRequest = objectMapper.createObjectNode()
            .put("name", "New Middle Task C")
            .put("description", "Inserted between A and B")
            .put("completed", false);

        // Act: Insert new task between parent (A) and child (B)
        // Expected endpoint: POST /api/tasks/insert-between?parentTaskId={A}&childTaskId={B}
        MvcResult result = mockMvc.perform(post("/api/tasks/insert-between")
                .param("parentTaskId", String.valueOf(parentTaskId))
                .param("childTaskId", String.valueOf(childTaskId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(insertRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("New Middle Task C"))
            .andExpect(jsonPath("$.parentTaskId").value(parentTaskId))
            .andReturn();

        // Get the new task's ID
        JsonNode newTaskJson = objectMapper.readTree(result.getResponse().getContentAsString());
        long newTaskId = newTaskJson.get("id").asLong();

        // Assert: New task has parent A
        mockMvc.perform(get("/api/tasks/{id}", newTaskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.parentTaskId").value(parentTaskId));

        // Assert: Child B now has new task as parent (reparented from A to newTask)
        mockMvc.perform(get("/api/tasks/{id}", childTaskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.parentTaskId").value(newTaskId));

        // Assert: Parent A still exists and is unchanged
        mockMvc.perform(get("/api/tasks/{id}", parentTaskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Parent Task A"));
    }

    /**
     * Test inserting between root task and its child (parent has no parent).
     */
    @Test
    void insertTaskBetween_rootAndChild_shouldWork() throws Exception {
        long processId = createProcess("Insert Between Root Process");
        long rootTaskId = createTask(processId, "Root Task");
        long childTaskId = createTaskWithParent(processId, "Child of Root", rootTaskId);

        ObjectNode insertRequest = objectMapper.createObjectNode()
            .put("name", "Middle Task")
            .put("completed", false);

        MvcResult result = mockMvc.perform(post("/api/tasks/insert-between")
                .param("parentTaskId", String.valueOf(rootTaskId))
                .param("childTaskId", String.valueOf(childTaskId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(insertRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        long newTaskId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        // Child should now point to new middle task
        mockMvc.perform(get("/api/tasks/{id}", childTaskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.parentTaskId").value(newTaskId));

        // New task should point to original root
        mockMvc.perform(get("/api/tasks/{id}", newTaskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.parentTaskId").value(rootTaskId));
    }

    /**
     * Test that inserting fails when child is not actually a child of the specified parent.
     */
    @Test
    void insertTaskBetween_childNotChildOfParent_shouldReturn400() throws Exception {
        long processId = createProcess("Insert Between Invalid Process");
        long taskA = createTask(processId, "Task A");
        long taskB = createTask(processId, "Task B"); // Not a child of A

        ObjectNode insertRequest = objectMapper.createObjectNode()
            .put("name", "Invalid Insert")
            .put("completed", false);

        mockMvc.perform(post("/api/tasks/insert-between")
                .param("parentTaskId", String.valueOf(taskA))
                .param("childTaskId", String.valueOf(taskB))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(insertRequest)))
            .andExpect(status().isBadRequest());
    }

    /**
     * Test that inserting fails when parent task does not exist.
     */
    @Test
    void insertTaskBetween_parentNotFound_shouldReturn404() throws Exception {
        long processId = createProcess("Insert Between Missing Parent Process");
        long childTaskId = createTask(processId, "Orphan Task");

        ObjectNode insertRequest = objectMapper.createObjectNode()
            .put("name", "Invalid Insert")
            .put("completed", false);

        mockMvc.perform(post("/api/tasks/insert-between")
                .param("parentTaskId", String.valueOf(999999L))
                .param("childTaskId", String.valueOf(childTaskId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(insertRequest)))
            .andExpect(status().isNotFound());
    }

    /**
     * Test that inserting fails when child task does not exist.
     */
    @Test
    void insertTaskBetween_childNotFound_shouldReturn404() throws Exception {
        long processId = createProcess("Insert Between Missing Child Process");
        long parentTaskId = createTask(processId, "Parent Task");

        ObjectNode insertRequest = objectMapper.createObjectNode()
            .put("name", "Invalid Insert")
            .put("completed", false);

        mockMvc.perform(post("/api/tasks/insert-between")
                .param("parentTaskId", String.valueOf(parentTaskId))
                .param("childTaskId", String.valueOf(999999L))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(insertRequest)))
            .andExpect(status().isNotFound());
    }

    /**
     * Test inserting a task in a deeper hierarchy (3+ levels).
     * 
     * Initial: A -> B -> C
     * Insert between B and C
     * After:   A -> B -> NewTask -> C
     */
    @Test
    void insertTaskBetween_deepHierarchy_shouldWork() throws Exception {
        long processId = createProcess("Deep Hierarchy Process");
        long taskA = createTask(processId, "Level 1");
        long taskB = createTaskWithParent(processId, "Level 2", taskA);
        long taskC = createTaskWithParent(processId, "Level 3", taskB);

        ObjectNode insertRequest = objectMapper.createObjectNode()
            .put("name", "Inserted Level 2.5")
            .put("completed", false);

        MvcResult result = mockMvc.perform(post("/api/tasks/insert-between")
                .param("parentTaskId", String.valueOf(taskB))
                .param("childTaskId", String.valueOf(taskC))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(insertRequest)))
            .andExpect(status().isCreated())
            .andReturn();

        long newTaskId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        // Verify hierarchy: A -> B -> newTask -> C
        mockMvc.perform(get("/api/tasks/{id}", taskA))
            .andExpect(jsonPath("$.parentTaskId").doesNotExist());

        mockMvc.perform(get("/api/tasks/{id}", taskB))
            .andExpect(jsonPath("$.parentTaskId").value(taskA));

        mockMvc.perform(get("/api/tasks/{id}", newTaskId))
            .andExpect(jsonPath("$.parentTaskId").value(taskB));

        mockMvc.perform(get("/api/tasks/{id}", taskC))
            .andExpect(jsonPath("$.parentTaskId").value(newTaskId));
    }
}
