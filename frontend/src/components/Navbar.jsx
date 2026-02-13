import { Link } from 'react-router-dom';
import {useState} from "react";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-4/5 rounded-4xl m-auto bg-nav-gray text-white shadow-lg mt-4">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                <div className="shrink-0">
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-blue-400">
                        Skill<span className="text-white">Hub</span>
                    </Link>
                </div>

                <div className="hidden md:flex grow justify-center space-x-10 font-normal">
                    <Link to="/trends" className="hover:text-blue-400 transition">Trends</Link>
                    <Link to="/market-forecast" className="hover:text-blue-400 transition">Market Forecast</Link>
                    <Link to="/companies" className="hover:text-blue-400 transition">Companies</Link>
                </div>

                <div className="hidden md:block">
                    <Link to="/market-forecast" className="bg-zinc-800 px-6 py-2 rounded-4xl border-t border-t-zinc-500 font-bold hover:bg-blue-500 transition whitespace-nowrap">
                        Predict Skills
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white focus:outline-none"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden px-6 pb-6 flex flex-col space-y-4 animate-fadeIn">
                    <Link to="/trends" className="text-center py-2" onClick={() => setIsOpen(false)}>Trends</Link>
                    <Link to="/market-forecast" className="text-center py-2" onClick={() => setIsOpen(false)}>Market Forecast</Link>
                    <Link to="/companies" className="text-center py-2" onClick={() => setIsOpen(false)}>Companies</Link>
                    <Link to="/market-forecast" className="bg-blue-600 px-5 py-2 rounded-4xl font-bold text-center" onClick={() => setIsOpen(false)}>
                        Get Predicted
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;