import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Background from '../components/Background';
import AnimatedText from "../components/AnimatedText.jsx";
import CompanyCard from "../components/CompanyCard.jsx";
import JobSlideOver from "../components/JobSlideOver.jsx";

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/companies/info');
                setCompanies(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleViewJobs = async (companyName) => {
        setSelectedCompany(companyName);
        setIsSlideOverOpen(true);
        setJobsLoading(true);
        setCompanyJobs([]);

        try {
            const response = await axios.get(`http://localhost:8080/api/companies/${companyName}/jobs`);
            setCompanyJobs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setJobsLoading(false);
        }
    };

    const filteredCompanies = companies
        .filter(company => {
            const term = searchTerm.toLowerCase();
            return company.name.toLowerCase().includes(term) ||
                company.topSkills.some(skill => skill.toLowerCase().includes(term));
        })
        .sort((a, b) => {
            return new Date(b.lastHiredDate || 0) - new Date(a.lastHiredDate || 0);
        });

    return (
        <div className="relative min-h-screen font-sans text-white selection:bg-blue-500/30">
            <Background />

            <main className="container mx-auto px-6 py-12">
                <div className="mb-12 text-center md:text-left">
                    <AnimatedText
                        text="Top Hiring"
                        className="block text-white text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-2"
                        delay={0.1}
                    />
                    <AnimatedText
                        text="Companies"
                        className="block text-blue-400 pb-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
                        delay={0.2}
                    />
                    <p className="mt-4 max-w-2xl text-lg text-zinc-400 mx-auto md:mx-0">
                        Discover who is hiring actively. We track company tech stacks based on their
                        job history so you can find the perfect engineering culture.
                    </p>

                    <div className="mt-8 max-w-md mx-auto md:mx-0 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by company or skill (e.g. 'Java')..."
                            className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-zinc-500">Loading company profiles...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCompanies.map((company, index) => (
                            <CompanyCard
                                key={index}
                                company={company}
                                index={index}
                                onViewJobs={handleViewJobs}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredCompanies.length === 0 && (
                    <div className="text-zinc-500 mt-8">No companies found matching "{searchTerm}"</div>
                )}
            </main>

            <JobSlideOver
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                companyName={selectedCompany}
                jobs={companyJobs}
                loading={jobsLoading}
            />
        </div>
    );
};

export default Companies;