import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GamePreloader from "../components/ui/GamePreloader";
import { animate, motion } from "framer-motion";
import { soundService } from "../services/SoundService";
import { useSound } from "../hooks/useSound";
import styled from "styled-components";

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

export default function GamesLayout() {
    const { playGameShow } = useSound();
    const navigate = useNavigate();
    const [showPreloader, setShowPreloader] = useState(true);
    const [gameName, setGameName] = useState("Game");
    const location = useLocation();
    // const primary = useMotionValue('#382542')
    // const background = useMotionTemplate`linear-gradient(to bottom right, ${primary}, #793367, #a66740)`

    useEffect(() => {
        // Show preloader when navigating to a game
        if (location.pathname.includes('/whot')) {
            setGameName("Whot");
        } else if (location.pathname.includes('/tictactoe')) {
            setGameName("Tic Tac Toe");
        } else if (location.pathname.includes('/memory')) {
            setGameName("Memory Match");
        } else if (location.pathname.includes('/snake')) {
            setGameName("Snake Game");
        } else if (location.pathname.includes('/puzzle')) {
            setGameName("Puzzle Solver");
        } else if (location.pathname.includes('/wordscramble')) {
            setGameName("Word Scramble");
        } else if (location.pathname.includes('/colormatch')) {
            setGameName("Color Match");
        } else if (location.pathname.includes('/math')) {
            setGameName("Math Challenge");
        } else {
            setGameName("Game");
        }

        // Only show preloader for actual games, not the games list
        if (location.pathname !== '/games') {
            setShowPreloader(true);
        } else {
            setShowPreloader(false);
        }
    }, [location.pathname]);

    const handlePreloaderComplete = () => {
        setShowPreloader(false);
        // const gameBackground = document.getElementById('game-background')
        animate('#382542', '#171616', {
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.5,
            onUpdate: (latest) => {
                document.body.style.background = latest
            }
        })
        playGameShow();
    };

    const handleBackToLists = () => {
        soundService.stopAll();
        soundService.stop('gameStart');
        navigate('/games');
        // const gameBackground = document.getElementById('game-background')
        animate('#171616', '#382542', {
            duration: 1.5,
            ease: "easeInOut",
            delay: 1,
            onUpdate: (latest) => {
                document.body.style.background = latest
            }
        })
    }

    // Cleanup function to stop all sounds when component unmounts
    useEffect(() => {
        return () => {
            // Stop all sounds when leaving the games page
            soundService.stopAll();
            soundService.stop('gameStart'); // Specifically stop game start music
            document.body.style.background = '#382542'
        };
    }, []);

    return (


        <motion.div id="game-background" className={`flex w-full flex-col items-center justify-center pt-2 pb-2 rounded-lg bg-transparent relative`}>
            {
                showPreloader && (

                    <GamePreloader
                        isVisible={showPreloader}
                        onComplete={handlePreloaderComplete}
                        gameName={gameName}
                    />
                )
            }
            {
                !showPreloader && (
                    <>
                        <div className="flex gap-4 items-center">
                            <GameIcon className="game-avatar" >
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
                        </div>
                        <Outlet context={{ handleBackToLists }} />
                    </>
                )
            }

        </motion.div>

    )
}