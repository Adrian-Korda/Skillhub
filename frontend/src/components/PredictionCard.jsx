import React from 'react';
import { motion } from "motion/react";

const PredictionCard = ({ data, index }) => {
    const { skill, prediction, confidence, latest_rolling_avg } = data;

    const isRising = prediction === "RISING";

    const statusText = isRising ? "Rising Up" : "Cooling Down";
    const statusColor = isRising ? "text-emerald-400" : "text-rose-400";
    const barColor = isRising ? "bg-emerald-500" : "bg-rose-500";
    const glowColor = isRising ? "from-emerald-500/10" : "from-rose-500/10";
    const statusBg = isRising
        ? "bg-emerald-500/10 border-emerald-500/20"
        : "bg-rose-500/10 border-rose-500/20";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-blue-500/30 transition-all"
        >
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${glowColor} to-transparent blur-3xl rounded-full pointer-events-none`} />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{skill}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Market Status</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusBg} ${statusColor} flex items-center gap-2 uppercase tracking-wide`}>
                    {statusText}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                    <p className="text-[10px] text-zinc-400 uppercase mb-1">Forecast Certainty</p>
                    <div className="flex items-end gap-1">
                        <span className="text-2xl font-bold text-white">{confidence}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-700/50 rounded-full mt-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${barColor}`}
                        />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                    <p className="text-[10px] text-zinc-400 uppercase mb-1">Daily Demand</p>
                    <div className="flex items-end gap-1">
                        <span className="text-2xl font-bold text-white">{Math.round(latest_rolling_avg)}</span>
                        <span className="text-xs text-zinc-500 mb-1.5">posts/day</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">Avg. new listings</p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center text-[10px] text-zinc-500">
                <span>Based on recent job market data</span>
            </div>
        </motion.div>
    );
};

export default PredictionCard;