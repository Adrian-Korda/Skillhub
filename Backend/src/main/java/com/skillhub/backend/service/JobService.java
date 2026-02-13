package com.skillhub.backend.service;

import com.skillhub.backend.model.JobListing;
import com.skillhub.backend.repository.JobRepository;
import com.skillhub.backend.util.SkillConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // getting every information about jobs by skill
    public List<JobListing> findJobsBySkill(String skill) {
        return jobRepository.searchBySkill(skill);
    }

    // mapping how many job listings are for a skill grouped by date
    public Map<String, Long> getTrendData(String skill) {
        List<Object[]> results = jobRepository.getJobCountsByDate(skill);
        Map<String, Long> trendMap = new LinkedHashMap<>();

        for (Object[] row : results) {
            String date = row[0].toString();
            Long count = (Long) row[1];
            trendMap.put(date, count);
        }

        return trendMap;
    }

    // getting all the different skill that are available in the database
    public List<String> getAllUniqueSkills() {
        Map<String, Long> allSkills = calculateSkillCounts();

        // sorting the keys alphabetically for the dropdown
        return allSkills.keySet().stream()
                .sorted()
                .collect(Collectors.toList());
    }

    // get top 1 skill by job count
    public Map<String, Object> getTopSkill() {
        Map<String, Long> counts = calculateSkillCounts();

        return counts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", e.getKey());
                    map.put("value", e.getValue());
                    return map;
                })
                .orElse(Map.of("name", "N/A", "value", 0));
    }

    // get top 10 skills by job count
    public List<Map<String, Object>> getTopSkillsList() {
        Map<String, Long> counts = calculateSkillCounts();

        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", e.getKey());
                    map.put("value", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    // get the highest rising skill
    public Map<String, Object> getRisingSkill() {
        List<Map<String, Object>> stats = calculateGrowthStats();

        return stats.stream()
                .max((a, b) -> Double.compare((Double) a.get("value"), (Double) b.get("value")))
                .orElse(Map.of("name", "Insuff. Data", "value", 0.0));
    }

    // get the best falling skill
    public Map<String, Object> getFallingSkill() {
        List<Map<String, Object>> stats = calculateGrowthStats();

        if (stats.isEmpty()) {
            return Map.of("name", "Insuff. Data", "value", 0.0);
        }

        // find the lowest value
        Map<String, Object> lowest = stats.stream()
                .min((a, b) -> Double.compare((Double) a.get("value"), (Double) b.get("value")))
                .orElse(Map.of("name", "N/A", "value", 0.0));

        // if the "worst" skill is actually growing (positive), market is stable.
        double growthValue = (Double) lowest.get("value");

        if (growthValue > 0) {
            return Map.of("name", "Market Stable", "value", 0.0);
        }

        return lowest;
    }

    // get top 10 most rising skills
    public List<Map<String, Object>> getGrowthSkillsList() {
        List<Map<String, Object>> stats = calculateGrowthStats();

        return stats.stream()
                .sorted((a, b) -> Double.compare((Double) b.get("value"), (Double) a.get("value")))
                .limit(10)
                .collect(Collectors.toList());
    }

    // calculate total volume for every skill
    private Map<String, Long> calculateSkillCounts() {
        List<JobListing> allJobs = jobRepository.findAll();
        Map<String, Long> counts = new HashMap<>();

        for (JobListing job : allJobs) {
            // skipping invalid rows
            if (job.getDetectedSkills() == null) continue;

            String[] skills = job.getDetectedSkills().split(",");

            for (String rawSkill : skills) {
                String skill = rawSkill.trim();

                // checking if the skill is valid and in our target list
                if (!skill.isEmpty() && SkillConstants.TARGET_SKILLS.contains(skill.toUpperCase())) {

                    // normalizing to uppercase so Python and python merge
                    String normalizedSkill = skill.toUpperCase();
                    counts.put(normalizedSkill, counts.getOrDefault(normalizedSkill, 0L) + 1);
                }
            }
        }
        return counts;
    }

    // calculate growth % for every skill
    private List<Map<String, Object>> calculateGrowthStats() {
        List<JobListing> allJobs = jobRepository.findAll();
        Map<String, Long> recentCounts = new HashMap<>();
        Map<String, Long> oldCounts = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        LocalDate twoWeeksAgo = today.minusDays(14);

        // bucket the data
        for (JobListing job : allJobs) {
            // skipping jobs with missing data
            if (job.getDetectedSkills() == null || job.getDatePosted() == null) continue;

            String[] skills = job.getDetectedSkills().split(",");

            for (String raw : skills) {
                String skill = raw.trim();

                // skip if skill is empty or not in our target list
                if (skill.isEmpty() || !SkillConstants.TARGET_SKILLS.contains(skill.toUpperCase())) continue;

                String normalizedSkill = skill.toUpperCase();

                // checking which date bucket this job falls into
                if (job.getDatePosted().isAfter(weekAgo)) {
                    recentCounts.put(normalizedSkill, recentCounts.getOrDefault(normalizedSkill, 0L) + 1);
                } else if (job.getDatePosted().isAfter(twoWeeksAgo)) {
                    oldCounts.put(normalizedSkill, oldCounts.getOrDefault(normalizedSkill, 0L) + 1);
                }
            }
        }

        // calculate percentages
        List<Map<String, Object>> growthList = new ArrayList<>();

        for (String skill : recentCounts.keySet()) {
            long current = recentCounts.get(skill);
            long previous = oldCounts.getOrDefault(skill, 0L);

            // calculating growth only if we have previous data
            if (previous >= 1) {
                double growth = Math.round((double) (current - previous) / previous * 100);

                Map<String, Object> stat = new HashMap<>();
                stat.put("name", skill);
                stat.put("value", growth);
                growthList.add(stat);

            } else if (previous == 0 && current > 1) {
                // new entrant bonus
                Map<String, Object> stat = new HashMap<>();
                stat.put("name", skill);
                stat.put("value", 100.0);
                growthList.add(stat);
            }
        }

        return growthList;
    }
}