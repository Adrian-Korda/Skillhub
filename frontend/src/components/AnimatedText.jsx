import { motion } from "motion/react";

const AnimatedText = ({ text, className, delay = 0 }) => {
    const letters = Array.from(text);

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
        },
    };

    return (
        <motion.div
            style={{ display: "flex" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{ display: "inline-block" }}
                    whileHover={{
                        y: -15,
                        scale: 1.3,
                        color: "#60a5fa",
                        zIndex: 10,
                        transition: { type: "spring", stiffness: 300 }
                    }}
                    className="cursor-default relative"
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default AnimatedText;