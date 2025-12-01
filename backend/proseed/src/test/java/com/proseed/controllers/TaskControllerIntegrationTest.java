package com.proseed.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.JsonNode;
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
            .put("name", name)
            .put("description", name + " desc");
        String json = mockMvc.perform(post("/api/processes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
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

    private long createTask(long processId, String name, Long parentId, Long employeeId) throws Exception {
        ObjectNode task = objectMapper.createObjectNode()
            .put("name", name)
            .put("description", name + " description")
            .put("isCompleted", false);
        if (parentId != null) task.put("parentId", parentId);
        if (employeeId != null) task.put("employeeId", employeeId);
        String json = mockMvc.perform(post("/api/tasks?processId=" + processId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    private long createSkill(String name) throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("name", name);
        String json = mockMvc.perform(post("/api/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    private long createDepartment(String name) throws Exception {
        ObjectNode body = objectMapper.createObjectNode()
            .put("name", name);
        String json = mockMvc.perform(post("/api/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    @Test
    void getAllTasks_shouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void createTask_shouldReturnCreated() throws Exception {
        long processId = createProcess("TaskTest Process");
        ObjectNode task = objectMapper.createObjectNode()
            .put("name", "New Task")
            .put("description", "Task description")
            .put("isCompleted", false);
        mockMvc.perform(post("/api/tasks?processId=" + processId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.name").value("New Task"))
            .andExpect(jsonPath("$.description").value("Task description"));
    }

    @Test
    void getTaskById_shouldReturnTask() throws Exception {
        long processId = createProcess("TaskTest Process 2");
        long taskId = createTask(processId, "Findable Task", null, null);
        mockMvc.perform(get("/api/tasks/" + taskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(taskId))
            .andExpect(jsonPath("$.name").value("Findable Task"));
    }

    @Test
    void getTaskById_shouldReturn404_whenNotFound() throws Exception {
        mockMvc.perform(get("/api/tasks/99999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void updateTask_shouldReturnOk() throws Exception {
        long processId = createProcess("TaskTest Process 3");
        long taskId = createTask(processId, "UpdateMe Task", null, null);
        ObjectNode update = objectMapper.createObjectNode()
            .put("name", "Updated Task")
            .put("description", "Updated description");
        mockMvc.perform(put("/api/tasks/" + taskId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(update)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Updated Task"));
    }

    @Test
    void deleteTask_shouldReturnNoContent() throws Exception {
        long processId = createProcess("TaskTest Process 4");
        long taskId = createTask(processId, "ToDelete Task", null, null);
        mockMvc.perform(delete("/api/tasks/" + taskId))
            .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/tasks/" + taskId))
            .andExpect(status().isNotFound());
    }

    @Test
    void createTaskWithParent_shouldReturnCreated() throws Exception {
        long processId = createProcess("TaskTest Process 5");
        long parentId = createTask(processId, "Parent Task", null, null);
        ObjectNode childTask = objectMapper.createObjectNode()
            .put("name", "Child Task")
            .put("description", "Child description")
            .put("isCompleted", false)
            .put("parentId", parentId);
        mockMvc.perform(post("/api/tasks?processId=" + processId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(childTask)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Child Task"));
    }

    @Test
    void createTaskWithEmployee_shouldReturnCreated() throws Exception {
        long processId = createProcess("TaskTest Process 6");
        long employeeId = createEmployee("Task", "Worker");
        ObjectNode task = objectMapper.createObjectNode()
            .put("name", "Assigned Task")
            .put("description", "Task with employee")
            .put("isCompleted", false)
            .put("employeeId", employeeId);
        mockMvc.perform(post("/api/tasks?processId=" + processId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Assigned Task"));
    }

    @Test
    void updateTaskRequirements_shouldReturnOkWithSkillsAndDepartments() throws Exception {
        long processId = createProcess("RequirementsTest Process");
        long taskId = createTask(processId, "Task for Requirements", null, null);
        long skill1 = createSkill("Java");
        long skill2 = createSkill("Python");
        long dept1 = createDepartment("Engineering");
        long dept2 = createDepartment("QA");
        
        ObjectNode requirements = objectMapper.createObjectNode();
        ArrayNode skillIds = requirements.putArray("skillIds");
        skillIds.add(skill1).add(skill2);
        ArrayNode deptIds = requirements.putArray("departmentIds");
        deptIds.add(dept1).add(dept2);
        
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requirements.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills").isArray())
            .andExpect(jsonPath("$.skills", hasSize(2)))
            .andExpect(jsonPath("$.departments").isArray())
            .andExpect(jsonPath("$.departments", hasSize(2)));
    }

    @Test
    void updateTaskRequirements_shouldAllowSkillsOnly() throws Exception {
        long processId = createProcess("SkillsOnly Process");
        long taskId = createTask(processId, "Task Skills Only", null, null);
        long skill = createSkill("SkillOnly");
        
        ObjectNode requirements = objectMapper.createObjectNode();
        ArrayNode skillIds = requirements.putArray("skillIds");
        skillIds.add(skill);
        
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requirements.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)))
            .andExpect(jsonPath("$.departments", hasSize(0)));
    }

    @Test
    void updateTaskRequirements_shouldAllowDepartmentsOnly() throws Exception {
        long processId = createProcess("DeptsOnly Process");
        long taskId = createTask(processId, "Task Depts Only", null, null);
        long dept = createDepartment("DeptOnly");
        
        ObjectNode requirements = objectMapper.createObjectNode();
        ArrayNode deptIds = requirements.putArray("departmentIds");
        deptIds.add(dept);
        
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requirements.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(0)))
            .andExpect(jsonPath("$.departments", hasSize(1)));
    }

    @Test
    void updateTaskRequirements_shouldReplaceExisting() throws Exception {
        long processId = createProcess("Replace Process");
        long taskId = createTask(processId, "Task Replace", null, null);
        long skill1 = createSkill("OldSkill");
        long skill2 = createSkill("NewSkill");
        long dept1 = createDepartment("OldDept");
        long dept2 = createDepartment("NewDept");
        
        // Set initial requirements
        ObjectNode initial = objectMapper.createObjectNode();
        initial.putArray("skillIds").add(skill1);
        initial.putArray("departmentIds").add(dept1);
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(initial.toString()))
            .andExpect(status().isOk());
        
        // Replace with new requirements
        ObjectNode replacement = objectMapper.createObjectNode();
        replacement.putArray("skillIds").add(skill2);
        replacement.putArray("departmentIds").add(dept2);
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(replacement.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)))
            .andExpect(jsonPath("$.departments", hasSize(1)));
    }

    @Test
    void updateTaskRequirements_shouldReturn404_whenTaskNotFound() throws Exception {
        ObjectNode requirements = objectMapper.createObjectNode();
        requirements.putArray("skillIds").add(1L);
        requirements.putArray("departmentIds").add(1L);
        mockMvc.perform(put("/api/tasks/99999/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requirements.toString()))
            .andExpect(status().isNotFound());
    }

    @Test
    void updateTaskRequirements_shouldNotAffectSubTasks() throws Exception {
        long processId = createProcess("NoSubReq Process");
        long parentId = createTask(processId, "ParentReq Task", null, null);
        long childId = createTask(processId, "ChildNoReq Task", parentId, null);
        long skill = createSkill("ParentOnly Skill");
        long dept = createDepartment("ParentOnly Dept");
        
        ObjectNode requirements = objectMapper.createObjectNode();
        requirements.putArray("skillIds").add(skill);
        requirements.putArray("departmentIds").add(dept);
        
        mockMvc.perform(put("/api/tasks/" + parentId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requirements.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)))
            .andExpect(jsonPath("$.departments", hasSize(1)));
        
        mockMvc.perform(get("/api/tasks/" + childId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(0)))
            .andExpect(jsonPath("$.departments", hasSize(0)));
    }

    @Test
    void updateTaskRequirements_withEmptyLists_shouldClear() throws Exception {
        long processId = createProcess("ClearReq Process");
        long taskId = createTask(processId, "Task Clear Req", null, null);
        long skill = createSkill("ToClear Skill");
        long dept = createDepartment("ToClear Dept");
        
        // Set initial requirements
        ObjectNode initial = objectMapper.createObjectNode();
        initial.putArray("skillIds").add(skill);
        initial.putArray("departmentIds").add(dept);
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(initial.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)))
            .andExpect(jsonPath("$.departments", hasSize(1)));
        
        // Clear with empty lists
        ObjectNode empty = objectMapper.createObjectNode();
        empty.putArray("skillIds");
        empty.putArray("departmentIds");
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(empty.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(0)))
            .andExpect(jsonPath("$.departments", hasSize(0)));
    }

    @Test
    void getTaskById_shouldReturnSkillsAndDepartments() throws Exception {
        long processId = createProcess("GetReq Process");
        long taskId = createTask(processId, "Task With Req", null, null);
        long skill = createSkill("GetSkill");
        long dept = createDepartment("GetDept");
        
        ObjectNode requirements = objectMapper.createObjectNode();
        requirements.putArray("skillIds").add(skill);
        requirements.putArray("departmentIds").add(dept);
        
        mockMvc.perform(put("/api/tasks/" + taskId + "/requirements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requirements.toString()))
            .andExpect(status().isOk());
        
        mockMvc.perform(get("/api/tasks/" + taskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)))
            .andExpect(jsonPath("$.departments", hasSize(1)));
    }
}
