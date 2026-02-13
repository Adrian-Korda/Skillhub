package com.skillhub.backend.service;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PredictionService {

    private final Map<String, String> predictionCache = new ConcurrentHashMap<>(); // creating a thread-safe cache for predictions

    public String runPythonPrediction(String skill) {

        String cacheKey = (skill == null || skill.trim().isEmpty()) ? "DEFAULT_VIEW" : skill.trim().toUpperCase(); // generating unique cache key

        if (predictionCache.containsKey(cacheKey)) {
            return predictionCache.get(cacheKey); // returning cached result if available
        }

        try {
            String currentDir = System.getProperty("user.dir");
            File scriptFile;

            File dockerPath = new File("/app/MarketPredictor/market_predictor.py"); // checking docker path first
            if (dockerPath.exists()) {
                scriptFile = dockerPath;
            } else {
                scriptFile = new File(currentDir + "/../MarketPredictor/market_predictor.py"); // checking local development path

                if (!scriptFile.exists()) {
                    scriptFile = new File("MarketPredictor/market_predictor.py"); // checking fallback path in root
                }
            }

            if (!scriptFile.exists()) {
                return "{\"error\": \"Could not find python script at " + scriptFile.getAbsolutePath() + "\"}";
            }

            List<String> command = new ArrayList<>(); // building the python command
            command.add("python");
            command.add("market_predictor.py");

            if (skill != null && !skill.trim().isEmpty()) {
                command.add(skill);
            }

            ProcessBuilder processBuilder = new ProcessBuilder(command); // preparing the process
            processBuilder.directory(scriptFile.getParentFile());
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start(); // executing the process
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n"); // reading the json output
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                return "{\"error\": \"Script failed with code " + exitCode + ": " + output.toString().replace("\"", "'").replace("\n", " ") + "\"}"; // returning the actual python error
            }

            String result = output.toString();

            predictionCache.put(cacheKey, result); // saving result to cache

            return result;

        } catch (Exception e) {
            return "{\"error\": \"Java Exception: " + e.getMessage() + "\"}";
        }
    }

    public void clearCache() {
        predictionCache.clear(); // clearing cache manually
    }
}