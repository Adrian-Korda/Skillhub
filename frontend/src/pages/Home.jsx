import AnimatedText from '../components/AnimatedText.jsx';
import Background from '../components/Background.jsx';
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="grow flex flex-col items-center justify-center text-center my-20">

            <Background />
            <div className="flex flex-col items-center z-10">
                <AnimatedText
                    text="Welcome to"
                    className="text-3xl md:text-4xl text-white font-medium opacity-90"
                />

                <div className="flex my-5">
                    <AnimatedText
                        text="Skill"
                        className="text-6xl md:text-8xl font-black tracking-tighter text-blue-400"
                        delay={0.5}
                    />
                    <AnimatedText
                        text="Hub"
                        className="text-6xl md:text-8xl font-black tracking-tighter text-white"
                        delay={0.8}
                    />
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-6 text-gray-400 text-lg md:text-xl max-w-xl font-light leading-relaxed"
            >
                Your home for everything tech market related.
                Track trending skills, analyze company hiring, and predict your future.
            </motion.p>

            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, type: "spring", stiffness: 200 }}
                onClick={() => navigate('/trends')} // 3. Add navigation
                className="mt-10 px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-full
               hover:bg-blue-500 hover:scale-105 transition-all duration-300
               shadow-lg shadow-blue-500/20 cursor-pointer"
            >
                GET STARTED
            </motion.button>
        </div>
    );
};

export default Home;