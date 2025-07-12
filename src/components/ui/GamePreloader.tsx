import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const PreloaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #382542 0%, #793367 50%, #a66740 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
`;

const GameIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(166, 103, 64, 0.1) 0%, rgba(121, 51, 103, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const LoadingBar = styled(motion.div)`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 24px;
  overflow: hidden;
  position: relative;
`;

const LoadingProgress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #f5f5f5 0%, #e5e5e5 100%);
  border-radius: 2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const LoadingText = styled(motion.div)`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 16px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const FloatingParticles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
`;

interface GamePreloaderProps {
  isVisible: boolean;
  onComplete: () => void;
  gameName?: string;
}

const GamePreloader: React.FC<GamePreloaderProps> = ({ 
  isVisible, 
  onComplete,
  gameName = "Game" 
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    if (!isVisible) return;

    const loadingSteps = [
      { progress: 20, text: "Loading assets..." },
      { progress: 40, text: "Preparing game engine..." },
      { progress: 60, text: "Setting up environment..." },
      { progress: 80, text: "Almost ready..." },
      { progress: 100, text: "Let's play!" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <PreloaderContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FloatingParticles>
            {particles.map((particle) => (
              <Particle
                key={particle.id}
                initial={{ 
                  x: `${particle.x}%`, 
                  y: `${particle.y}%`,
                  opacity: 0 
                }}
                animate={{ 
                  y: `${particle.y - 20}%`,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </FloatingParticles>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <GameIcon
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={{
                  fontSize: '2rem',
                  color: '#382542'
                }}
              >
                🎮
              </motion.div>
            </GameIcon>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <LoadingBar>
              <LoadingProgress
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </LoadingBar>
          </motion.div>

          <LoadingText
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingText}
          </LoadingText>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              marginTop: '12px',
              textAlign: 'center'
            }}
          >
            {gameName}
          </motion.div>
        </PreloaderContainer>
      )}
    </AnimatePresence>
  );
};

export default GamePreloader; 