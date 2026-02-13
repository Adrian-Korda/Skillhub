package com.skillhub.backend.repository;

import com.skillhub.backend.model.JobListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobListing, Long> {

    // getting the whole JobListing objects by input skill
    @Query("SELECT j FROM JobListing j WHERE LOWER(j.detectedSkills) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<JobListing> searchBySkill(@Param("skill") String skill);

    // getting the date and the job count, grouped by date, for a specific skill
    @Query("SELECT j.datePosted, COUNT(j) FROM JobListing j WHERE LOWER(j.detectedSkills) LIKE LOWER(CONCAT('%', :skill, '%')) GROUP BY j.datePosted ORDER BY j.datePosted ASC")
    List<Object[]> getJobCountsByDate(@Param("skill") String skill);

    // getting all company info including job count, latest post and all skills
    @Query(value = """
    SELECT 
        company_name, 
        COUNT(id) as job_count, 
        MAX(date_posted) as latest_post, 
        STRING_AGG(detected_skills, ',') as all_skills 
    FROM job_listings 
    GROUP BY company_name
    """, nativeQuery = true)
    List<Object[]> getCompanyInfo();

    // find all jobs for a specific company, sorted by newest first
    List<JobListing> findByCompanyNameOrderByDatePostedDesc(String companyName);
}
