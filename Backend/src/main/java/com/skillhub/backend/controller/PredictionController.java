package com.skillhub.backend.controller;

import com.skillhub.backend.service.PredictionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = { "http://localhost:5173", "https://skillhub-project.vercel.app" })
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping("/predict")
    public String getMarketPredictions(@RequestParam(required = false) String skill) {
        return predictionService.runPythonPrediction(skill);
    }
}