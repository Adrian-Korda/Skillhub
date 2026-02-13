package com.skillhub.backend.controller;

import com.skillhub.backend.dto.CompanyDTO;
import com.skillhub.backend.model.JobListing;
import com.skillhub.backend.service.CompanyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) { this.companyService = companyService; }

    @GetMapping("/info")
    public List<CompanyDTO> getAllCompanyInformation() { return companyService.getAllCompanyInformation(); }

    @GetMapping("/{name}/jobs")
    public List<JobListing> getCompanyJobs(@PathVariable String name) {
        return companyService.getJobsForCompany(name);
    }
}
