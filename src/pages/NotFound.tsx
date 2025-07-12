import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.1, 0.5, 0.1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Floating geometric shapes */}
            <motion.div
                className="absolute top-20 left-20 w-32 h-32 border border-purple-400/30 rounded-lg"
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-24 h-24 border border-blue-400/30 rounded-full"
                animate={{
                    rotate: [360, 0],
                    scale: [1, 0.8, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="text-center max-w-2xl mx-auto">
                    {/* 404 Number */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                        className="mb-8"
                    >
                        <h1 className="text-9xl md:text-[12rem] font-bold text-secondary bg-clip-text">
                            404
                        </h1>
                    </motion.div>

                    {/* Error message */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            The page you're looking for seems to have wandered off into the digital void. 
                            Don't worry, even the best explorers sometimes take a wrong turn!
                        </p>
                    </motion.div>

                    {/* Interactive floating element that follows mouse */}
                    <motion.div
                        className="absolute w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"
                        animate={{
                            x: mousePosition.x - 128,
                            y: mousePosition.y - 128,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 50,
                            damping: 20,
                        }}
                    />

                    {/* Action buttons */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoHome}
                            className="btn-class px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-400/30"
                        >
                            🏠 Go Home
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoBack}
                            className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white/30 hover:border-white/60 transition-all duration-300"
                        >
                            ← Go Back
                        </motion.button>
                    </motion.div>

                    {/* Fun fact */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                    >
                        <p className="text-gray-300 text-sm">
                            💡 <span className="font-semibold">Fun Fact:</span> The 404 error was first introduced by Tim Berners-Lee in 1990. 
                            The number 404 was chosen because room 404 at CERN (where the web was invented) was the server room!
                        </p>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                        className="absolute -top-10 -left-10 w-20 h-20 border border-purple-400/20 rounded-full"
                        animate={{
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-10 -right-10 w-16 h-16 border border-pink-400/20 rounded-lg"
                        animate={{
                            rotate: [360, 180, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </div>
            </div>
        </div>
    );
} 