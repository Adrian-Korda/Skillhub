package com.skillhub.backend.controller;

import com.skillhub.backend.model.JobListing;
import com.skillhub.backend.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class TrendsController {

    private final JobService jobService;

    public TrendsController(JobService jobService) { this.jobService = jobService; }

    @GetMapping("/search")
    public List<JobListing> searchJobs(@RequestParam String skill){
        return jobService.findJobsBySkill(skill);
    }

    @GetMapping("/stats")
    public Map<String, Long> getJobStats(@RequestParam String skill){
        return jobService.getTrendData(skill);
    }

    @GetMapping("/skills")
    public List<String> getAvailableSkills() {
        return jobService.getAllUniqueSkills();
    }

    @GetMapping("/top-skill")
    public Map<String, Object> getTopSkill() {
        return jobService.getTopSkill();
    }

    @GetMapping("/rising-skill")
    public Map<String, Object> getRisingSkill() {
        return jobService.getRisingSkill();
    }

    @GetMapping("/falling-skill")
    public Map<String, Object> getFallingSkill() {
        return jobService.getFallingSkill();
    }

    @GetMapping("/top-list")
    public List<Map<String, Object>> getTopList() {
        return jobService.getTopSkillsList();
    }

    @GetMapping("/growth-list")
    public List<Map<String, Object>> getGrowthList() {
        return jobService.getGrowthSkillsList();
    }
}
