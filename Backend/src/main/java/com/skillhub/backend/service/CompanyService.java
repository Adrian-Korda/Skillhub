package com.skillhub.backend.service;

import com.skillhub.backend.model.JobListing;
import com.skillhub.backend.repository.JobRepository;
import com.skillhub.backend.util.SkillConstants;
import org.springframework.stereotype.Service;
import com.skillhub.backend.dto.CompanyDTO;

import java.time.LocalDate;
import java.util.*;

@Service
public class CompanyService {
    private final JobRepository jobRepository;

    public CompanyService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<CompanyDTO> getAllCompanyInformation(){

        List<Object[]> allRawCompanyInfo = jobRepository.getCompanyInfo(); // fetching raw aggregated data from DB
        List<CompanyDTO> allCompanyInfo = new ArrayList<>();

        for (Object[] rawCompanyInfo : allRawCompanyInfo){
            // extracting basic fields from the raw query result
            String rawName = rawCompanyInfo[0].toString();
            Long rawCount = (Long) rawCompanyInfo[1];
            LocalDate cleanDate = (LocalDate) rawCompanyInfo[2];
            String rawSkills = rawCompanyInfo[3] != null ? rawCompanyInfo[3].toString() : "";

            // splitting the comma-separated skills string into an array for processing
            String[] allSkillsList = rawSkills.isEmpty() ? new String[0] : rawSkills.split(",");

            Map<String, Integer> counter = new HashMap<>(); // creating a map to count skill frequency per company
            for (String raw : allSkillsList){
                String skill = raw.trim();

                // filtering only for valid target skills and normalizing them to uppercase
                if(!skill.isEmpty() && SkillConstants.TARGET_SKILLS.contains(skill.toUpperCase())) {
                    String normalized = skill.toUpperCase();
                    counter.put(normalized, counter.getOrDefault(normalized, 0) + 1);
                }
            }

            // sorting skills by frequency (descending) and keeping only the top 3
            List<String> topSkillsList = counter.entrySet().stream()
                    .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                    .limit(3)
                    .map(Map.Entry::getKey)
                    .toList();

            // constructing the DTO with the processed top skills and company stats
            allCompanyInfo.add(new CompanyDTO(
                    rawName,
                    rawCount,
                    cleanDate,
                    topSkillsList
            ));
        }
        return allCompanyInfo;
    }

    public List<JobListing> getJobsForCompany(String companyName) {
        // retrieving all job listings for a specific company, sorted by newest first
        return jobRepository.findByCompanyNameOrderByDatePostedDesc(companyName);
    }
}