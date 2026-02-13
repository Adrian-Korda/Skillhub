import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
    const [topSkills, setTopSkills] = useState([]);
    const [growthSkills, setGrowthSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topRes, growthRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/jobs/top-list'),
                    axios.get('http://localhost:8080/api/jobs/growth-list')
                ]);

                setTopSkills(topRes.data);
                setGrowthSkills(growthRes.data.filter(item => item.value > 0));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Market Leaders</h3>
                        <p className="text-xs text-zinc-400">Most job openings (Total Volume)</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-zinc-500">Loading...</p>
                ) : (
                    <div className="space-y-2">
                        {topSkills.map((skill, i) => (
                            <SkillRow
                                key={i}
                                item={skill}
                                index={i}
                                maxValue={topSkills[0]?.value || 100}
                                isGrowth={false}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Rising Stars</h3>
                        <p className="text-xs text-zinc-400">Fastest growth (7-day trend)</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-zinc-500">Loading...</p>
                ) : (
                    <div className="space-y-2">
                        {growthSkills.map((skill, i) => (
                            <SkillRow
                                key={i}
                                item={skill}
                                index={i}
                                maxValue={growthSkills[0]?.value || 100}
                                isGrowth={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const SkillRow = ({ item, index, maxValue, isGrowth }) => {
    const percentage = Math.max(5, (item.value / maxValue) * 100);
    const colorClass = isGrowth ? 'text-emerald-400' : 'text-blue-400';
    const bgClass = isGrowth ? 'bg-emerald-500' : 'bg-blue-500';

    return (
        <div className="relative mb-4 group">
            <div className="flex justify-between items-end mb-1 text-sm">
                <span className="font-medium text-zinc-300 flex items-center gap-2">
                    <span className="text-zinc-500 font-mono text-xs">#{index + 1}</span>
                    {item.name}
                </span>
                <span className={`${colorClass} font-bold`}>
                    {isGrowth ? `+${item.value}%` : item.value}
                </span>
            </div>

            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${bgClass} opacity-60 group-hover:opacity-100 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default Leaderboard;