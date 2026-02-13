import { motion } from "motion/react";

const CompanyCard = ({ company, index, onViewJobs }) => {
    const { name, jobCount, topSkills, lastHiredDate } = company;

    const formattedDate = lastHiredDate
        ? new Date(lastHiredDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
        : "Recently";

    let statusLabel = "Hiring";
    let statusColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";

    if (jobCount >= 10) {
        statusLabel = "Aggressive Hiring";
        statusColor = "text-orange-400 bg-orange-400/10 border-orange-400/20";
    } else if (jobCount >= 5) {
        statusLabel = "Active";
        statusColor = "text-blue-400 bg-blue-400/10 border-blue-400/20";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col h-full p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all group relative overflow-hidden backdrop-blur-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
                        {name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {name}
                        </h3>
                        <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${statusColor}`}>
                            {statusLabel} • {jobCount} Roles
                        </div>
                    </div>
                </div>
            </div>

            <div className="grow">
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Core Stack</p>
                <div className="flex flex-wrap gap-2">
                    {topSkills && topSkills.length > 0 ? (
                        topSkills.map((skill, i) => (
                            <span
                                key={i}
                                className={`text-xs px-2.5 py-1 rounded-md border 
                                    ${i === 0
                                    ? "bg-white/10 text-white border-white/20 font-semibold"
                                    : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50"}`
                                }
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-zinc-600 italic">No specific stack data</span>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Last Posted</span>
                    <span className="text-xs text-zinc-300 font-mono mt-0.5">
                        {formattedDate}
                    </span>
                </div>

                <button
                    onClick={() => onViewJobs(name)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-blue-600 hover:text-white transition-colors text-zinc-300 cursor-pointer"
                >
                    View Jobs &rarr;
                </button>
            </div>
        </motion.div>
    );
};

export default CompanyCard;