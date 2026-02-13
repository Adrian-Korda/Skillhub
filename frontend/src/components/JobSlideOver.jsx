import React from 'react';
import { motion, AnimatePresence } from "motion/react";

const JobSlideOver = ({ isOpen, onClose, companyName, jobs, loading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white">Open Positions</h2>
                                <p className="text-sm text-zinc-400">at <span className="text-blue-400">{companyName}</span></p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-40 space-y-3">
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm text-zinc-500">Fetching jobs...</p>
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="text-center text-zinc-500 mt-10">
                                    No active job listings found in our database.
                                </div>
                            ) : (
                                jobs.map((job) => (
                                    <JobItem key={job.id} job={job} />
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const JobItem = ({ job }) => {
    const hasLink = job.sourceUrl && job.sourceUrl.trim() !== "";
    const isRemoteOk = job.sourceUrl && job.sourceUrl.toLowerCase().includes("remoteok");

    return (
        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 hover:border-blue-500/30 hover:bg-zinc-800/60 transition-all group">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">
                        {job.jobTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location || "Remote"}
                        </span>
                        <span>•</span>
                        <span>{new Date(job.datePosted).toLocaleDateString()}</span>

                        {isRemoteOk && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-zinc-400">
                                    via <span className="font-bold text-white">Remote OK</span>
                                    <span>®</span>
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {hasLink ? (
                    <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-3 py-1.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                    >
                        Apply
                    </a>
                ) : (
                    <button
                        disabled
                        className="shrink-0 px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-500 border border-zinc-700 rounded-lg cursor-not-allowed"
                    >
                        No Link
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobSlideOver;