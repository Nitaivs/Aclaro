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
    void updateTaskSkills_shouldReturnOkWithSkills() throws Exception {
        long processId = createProcess("SkillTest Process");
        long taskId = createTask(processId, "Task for Skills", null, null);
        long skill1 = createSkill("Java");
        long skill2 = createSkill("Python");
        ArrayNode skillIds = objectMapper.createArrayNode().add(skill1).add(skill2);
        mockMvc.perform(put("/api/tasks/" + taskId + "/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(skillIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills").isArray())
            .andExpect(jsonPath("$.skills", hasSize(2)));
    }

    @Test
    void updateTaskDepartments_shouldReturnOkWithDepartments() throws Exception {
        long processId = createProcess("DeptTest Process");
        long taskId = createTask(processId, "Task for Depts", null, null);
        long dept1 = createDepartment("Engineering");
        long dept2 = createDepartment("QA");
        ArrayNode deptIds = objectMapper.createArrayNode().add(dept1).add(dept2);
        mockMvc.perform(put("/api/tasks/" + taskId + "/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deptIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.departments").isArray())
            .andExpect(jsonPath("$.departments", hasSize(2)));
    }

    @Test
    void updateTaskSkills_shouldReplaceExistingSkills() throws Exception {
        long processId = createProcess("SkillReplace Process");
        long taskId = createTask(processId, "Task Replace Skills", null, null);
        long skill1 = createSkill("Skill1");
        long skill2 = createSkill("Skill2");
        ArrayNode skillIds = objectMapper.createArrayNode().add(skill1);
        mockMvc.perform(put("/api/tasks/" + taskId + "/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(skillIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)));
        ArrayNode newSkillIds = objectMapper.createArrayNode().add(skill2);
        mockMvc.perform(put("/api/tasks/" + taskId + "/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newSkillIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)));
    }

    @Test
    void updateTaskDepartments_shouldReplaceExistingDepartments() throws Exception {
        long processId = createProcess("DeptReplace Process");
        long taskId = createTask(processId, "Task Replace Depts", null, null);
        long dept1 = createDepartment("Dept1");
        long dept2 = createDepartment("Dept2");
        ArrayNode deptIds = objectMapper.createArrayNode().add(dept1);
        mockMvc.perform(put("/api/tasks/" + taskId + "/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deptIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.departments", hasSize(1)));
        ArrayNode newDeptIds = objectMapper.createArrayNode().add(dept2);
        mockMvc.perform(put("/api/tasks/" + taskId + "/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newDeptIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.departments", hasSize(1)));
    }

    @Test
    void updateTaskSkills_shouldReturn404_whenTaskNotFound() throws Exception {
        ArrayNode skillIds = objectMapper.createArrayNode().add(1L);
        mockMvc.perform(put("/api/tasks/99999/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(skillIds.toString()))
            .andExpect(status().isNotFound());
    }

    @Test
    void updateTaskDepartments_shouldReturn404_whenTaskNotFound() throws Exception {
        ArrayNode deptIds = objectMapper.createArrayNode().add(1L);
        mockMvc.perform(put("/api/tasks/99999/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deptIds.toString()))
            .andExpect(status().isNotFound());
    }

    @Test
    void updateTaskSkills_shouldNotAffectSubTasks() throws Exception {
        long processId = createProcess("NoSubSkill Process");
        long parentId = createTask(processId, "ParentSkill Task", null, null);
        long childId = createTask(processId, "ChildNoSkill Task", parentId, null);
        long skill = createSkill("ParentOnly Skill");
        ArrayNode skillIds = objectMapper.createArrayNode().add(skill);
        mockMvc.perform(put("/api/tasks/" + parentId + "/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(skillIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)));
        mockMvc.perform(get("/api/tasks/" + childId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(0)));
    }

    @Test
    void updateTaskDepartments_shouldNotAffectSubTasks() throws Exception {
        long processId = createProcess("NoSubDept Process");
        long parentId = createTask(processId, "ParentDept Task", null, null);
        long childId = createTask(processId, "ChildNoDept Task", parentId, null);
        long dept = createDepartment("ParentOnly Dept");
        ArrayNode deptIds = objectMapper.createArrayNode().add(dept);
        mockMvc.perform(put("/api/tasks/" + parentId + "/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deptIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.departments", hasSize(1)));
        mockMvc.perform(get("/api/tasks/" + childId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.departments", hasSize(0)));
    }

    @Test
    void updateTaskSkills_withEmptyList_shouldClearSkills() throws Exception {
        long processId = createProcess("ClearSkills Process");
        long taskId = createTask(processId, "Task Clear Skills", null, null);
        long skill = createSkill("ToClear Skill");
        ArrayNode skillIds = objectMapper.createArrayNode().add(skill);
        mockMvc.perform(put("/api/tasks/" + taskId + "/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(skillIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)));
        ArrayNode empty = objectMapper.createArrayNode();
        mockMvc.perform(put("/api/tasks/" + taskId + "/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(empty.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(0)));
    }

    @Test
    void updateTaskDepartments_withEmptyList_shouldClearDepartments() throws Exception {
        long processId = createProcess("ClearDepts Process");
        long taskId = createTask(processId, "Task Clear Depts", null, null);
        long dept = createDepartment("ToClear Dept");
        ArrayNode deptIds = objectMapper.createArrayNode().add(dept);
        mockMvc.perform(put("/api/tasks/" + taskId + "/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deptIds.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.departments", hasSize(1)));
        ArrayNode empty = objectMapper.createArrayNode();
        mockMvc.perform(put("/api/tasks/" + taskId + "/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(empty.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.departments", hasSize(0)));
    }

    @Test
    void getTaskById_shouldReturnSkillsAndDepartments() throws Exception {
        long processId = createProcess("GetSkillDept Process");
        long taskId = createTask(processId, "Task With Both", null, null);
        long skill = createSkill("GetSkill");
        long dept = createDepartment("GetDept");
        ArrayNode skillIds = objectMapper.createArrayNode().add(skill);
        ArrayNode deptIds = objectMapper.createArrayNode().add(dept);
        mockMvc.perform(put("/api/tasks/" + taskId + "/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(skillIds.toString()))
            .andExpect(status().isOk());
        mockMvc.perform(put("/api/tasks/" + taskId + "/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deptIds.toString()))
            .andExpect(status().isOk());
        mockMvc.perform(get("/api/tasks/" + taskId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills", hasSize(1)))
            .andExpect(jsonPath("$.departments", hasSize(1)));
    }
}
