import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const VARIANTS = {
    neutral: {
        color: "text-blue-400",
        bgGradient: "from-blue-900/20 to-zinc-900/50",
        iconBg: "bg-blue-500/10",
        Icon: Activity
    },
    increase: {
        color: "text-emerald-400",
        bgGradient: "from-emerald-900/20 to-zinc-900/50",
        iconBg: "bg-emerald-500/10",
        Icon: ArrowUpRight
    },
    decrease: {
        color: "text-rose-400",
        bgGradient: "from-rose-900/20 to-zinc-900/50",
        iconBg: "bg-rose-500/10",
        Icon: ArrowDownRight
    }
};

const StatCard = ({ title, value, subValue, type = "neutral" }) => {

    const style = VARIANTS[type] || VARIANTS.neutral;
    const { Icon, color, bgGradient, iconBg } = style;

    return (
        <div className={`relative overflow-hidden rounded-3xl border 
        border-white/10 bg-linear-to-br ${bgGradient} 
        p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-2xl`}>

            <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
                {title}
            </h3>

            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-white">
                    {value || "..."}
                </span>
            </div>

            <div className={`mt-2 flex items-center text-sm font-semibold ${color}`}>
                <div className={`rounded-full p-1 ${iconBg} mr-2`}>
                    <Icon size={14} strokeWidth={3} />
                </div>
                <span>{subValue}</span>
            </div>
        </div>
    );
};

export default StatCard;