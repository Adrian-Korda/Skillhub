import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Background from '../components/Background';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';
import Leaderboard from "../components/Leaderboard.jsx";
import AnimatedText from "../components/AnimatedText.jsx";

const Trends = () => {
    const [stats, setStats] = useState({
        top: null,
        rising: null,
        falling: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const [topRes, risingRes, fallingRes] =
                    await Promise.all([
                        axios.get('https://skillhub-backend-g2ef.onrender.com/api/jobs/top-skill'),
                        axios.get('https://skillhub-backend-g2ef.onrender.com/api/jobs/rising-skill'),
                        axios.get('https://skillhub-backend-g2ef.onrender.com/api/jobs/falling-skill')
                    ]);

                setStats({
                    top: topRes.data,
                    rising: risingRes.data,
                    falling: fallingRes.data
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMarketData();
    }, []);

    return (
        <div className="relative min-h-screen font-sans text-white selection:bg-blue-500/30">
            <Background/>

            <main className="container mx-auto px-6 py-12">

                <div className="mb-12 text-center md:text-left">

                    <AnimatedText
                        text="Market"
                        className="block text-white text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-2"
                        delay={0.1}
                    />

                    <AnimatedText
                        text="Trends & Insights"
                        className="block text-blue-400 pb-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
                        delay={0.2}
                    />

                    <p className="mt-4 max-w-2xl text-lg text-zinc-400 mx-auto md:mx-0">
                        Real-time analysis of the job market. Tracking thousands of job listings to identify rising
                        stars and cooling trends.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <StatCard
                        title="Market Leader"
                        value={loading ? "Loading..." : stats.top?.name}
                        subValue={`${stats.top?.value || 0} active jobs`}
                        type="neutral"
                    />
                    <StatCard
                        title="Fastest Growing"
                        value={loading ? "Loading..." : stats.rising?.name}
                        subValue={`${stats.rising?.value?.toFixed(0)}% growth`}
                        type="increase"
                    />
                    <StatCard
                        title="Cooling Down"
                        value={loading ? "Loading..." : stats.falling?.name}
                        subValue={`${stats.falling?.value?.toFixed(0)}% slow down`}
                        type="decrease"
                    />
                </div>

                <div className="mt-12">
                    {stats.top?.name && (
                        <AnalyticsChart defaultSkill={stats.top.name}/>
                    )}
                </div>

                <div className="mt-12">
                    <Leaderboard/>
                </div>

            </main>
        </div>
    );
};

export default Trends;