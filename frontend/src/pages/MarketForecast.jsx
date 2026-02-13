import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "motion/react";
import Background from '../components/Background';
import AnimatedText from "../components/AnimatedText.jsx";
import PredictionCard from "../components/PredictionCard.jsx";

const MarketForecast = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allSkills, setAllSkills] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const wrapperRef = useRef(null);

    useEffect(() => {
        fetchPredictions();
        fetchSkillList();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchSkillList = async () => {
        try {
            const cachedSkills = sessionStorage.getItem("all_skills_list");
            if (cachedSkills) {
                setAllSkills(JSON.parse(cachedSkills));
            } else {
                const res = await axios.get('http://localhost:8080/api/jobs/skills');
                setAllSkills(res.data);
                sessionStorage.setItem("all_skills_list", JSON.stringify(res.data));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPredictions = async (skill = null) => {
        setLoading(true);
        setError(null);

        const cacheKey = `forecast_${skill ? skill.toUpperCase() : 'DEFAULT'}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            setPredictions(JSON.parse(cachedData));
            setLoading(false);
            return;
        }

        try {
            const url = skill
                ? `http://localhost:8080/api/ai/predict?skill=${encodeURIComponent(skill)}`
                : `http://localhost:8080/api/ai/predict`;

            const response = await axios.get(url);

            if (response.data.error) {
                setError(response.data.error);
                setPredictions([]);
            } else {
                setPredictions(response.data);
                sessionStorage.setItem(cacheKey, JSON.stringify(response.data));
            }
        } catch (err) {
            setError("Failed to connect to the AI model.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.length > 0) {
            const filtered = allSkills.filter(s =>
                s.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 8));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSkill = (selectedSkill) => {
        setInputValue(selectedSkill);
        setShowSuggestions(false);
        fetchPredictions(selectedSkill);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            fetchPredictions(inputValue);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="relative min-h-screen font-sans text-white selection:bg-blue-500/30">
            <Background />

            <main className="container mx-auto px-6 py-12 relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <AnimatedText
                        text="AI Market"
                        className="block text-white text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-2"
                        delay={0.1}
                    />

                    <AnimatedText
                        text="Forecast"
                        className="block text-blue-400 pb-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
                        delay={0.2}
                    />

                    <p className="mt-4 max-w-2xl text-lg text-zinc-400 mx-auto md:mx-0">
                        Stop guessing which skills to learn next. Our AI analyzes thousands of
                        real-time job listings to forecast market trends, helping you discover
                        high-growth technologies before they go mainstream.
                    </p>

                    <div className="mt-8 max-w-md mx-auto md:mx-0 relative z-50" ref={wrapperRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <input
                            type="text"
                            placeholder="Ask AI about a skill (e.g. 'Rust', 'Go')..."
                            className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/80 backdrop-blur-md text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all shadow-xl"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => { if (inputValue) setShowSuggestions(true); }}
                        />

                        <AnimatePresence>
                            {showSuggestions && suggestions.length > 0 && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute w-full bg-zinc-900 border border-zinc-700 rounded-xl mt-2 shadow-2xl max-h-60 overflow-y-auto z-50 overflow-hidden"
                                >
                                    {suggestions.map((s, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelectSkill(s)}
                                            className="px-4 py-3 text-sm text-zinc-300 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer transition-colors border-b border-zinc-800/50 last:border-0"
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center mt-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-zinc-500 animate-pulse">Running Prediction Model...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 mt-12 bg-red-400/10 p-4 rounded-xl border border-red-400/20 max-w-md mx-auto">
                        {error}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {predictions.map((pred, index) => (
                            <PredictionCard key={index} data={pred} index={index} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MarketForecast;