import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Search } from 'lucide-react';

const AnalyticsChart = ({ defaultSkill }) => {
    const [skill, setSkill] = useState(defaultSkill || 'Python');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [allSkills, setAllSkills] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState(defaultSkill || 'Python');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get('https://skillhub-backend-g2ef.onrender.com/api/jobs/skills');
                setAllSkills(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSkills();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://skillhub-backend-g2ef.onrender.com/api/jobs/stats?skill=${encodeURIComponent(skill)}`);
                const formattedData = Object.entries(response.data).map(([date, count]) => ({
                    date: date.slice(5),
                    jobs: count
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (skill) fetchStats();
    }, [skill]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.length > 0) {
            const filtered = allSkills.filter(s =>
                s.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSkill = (selectedSkill) => {
        setSkill(selectedSkill);
        setInputValue(selectedSkill);
        setShowSuggestions(false);
    };

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6 md:p-8" ref={wrapperRef}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Demand Trends</h2>
                    <p className="text-zinc-400 text-sm">Historical popularity for <span className="text-blue-400 font-semibold">{skill}</span></p>
                </div>

                <div className="relative group w-full md:w-64">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={() => { if (inputValue) setShowSuggestions(true); }}
                            placeholder="Compare a skill..."
                            className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <div className="absolute right-3 top-2.5 text-zinc-400 pointer-events-none">
                            <Search size={16} />
                        </div>
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                            {suggestions.map((s, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelectSkill(s)}
                                    className="px-4 py-2 text-sm text-zinc-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="h-75 w-full">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse">Loading data...</div>
                ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#18181b',
                                    borderColor: '#27272a',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#60a5fa' }}
                            />
                            <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-zinc-500">
                        No data found for "{skill}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsChart;