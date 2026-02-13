package com.skillhub.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record CompanyDTO(
        String name,
        Long totalJobs,
        LocalDate lastHiredDate,
        List<String> topSkills
) { }
