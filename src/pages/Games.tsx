
import PageTransition from "../components/ui/PageTransition";
import useDocumentTitle from "../hooks/useDocumentTitle";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { polaroidVariants } from "../utils/variants";
import { useState } from "react";

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

const GamesContainer = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    list-style: none;
    padding: 20px;
    margin: 0;
    width: 100%;
    max-width: 1400px;
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        padding: 16px;
    }
    
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 12px;
    }
   
   .item {
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(56, 37, 66, 0.1);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(166, 103, 64, 0.1) 0%, rgba(121, 51, 103, 0.05) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        
        &::before {
            opacity: 1;
        }
    }

    .game-content {
        position: relative;
        z-index: 1;
    }
    
    .game-title {
        color: #382542;
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 8px 0;
    }
    
    .game-description {
        color: #666;
        font-size: 0.95rem;
        margin: 0;
        line-height: 1.5;
    }
    
    .game-avatar {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        transition: transform 0.3s ease;
    }
    
    &:hover .game-avatar {
        transform: scale(1.1) rotate(5deg);
    }
   }
`

const gamesList = [
    {
        name: 'Whot',
        description: 'A classic Nigerian card game with strategic gameplay',
        image: 'https://via.placeholder.com/150',
        link: '/whot'
    },
    {
        name: 'Tic Tac Toe',
        description: 'The timeless game of X\'s and O\'s',
        image: 'https://via.placeholder.com/150',
        link: '/tictactoe'
    },
    {
        name: 'Memory Match',
        description: 'Test your memory with this card matching game',
        image: 'https://via.placeholder.com/150',
        link: '/memory'
    },
    {
        name: 'Snake Game',
        description: 'Classic snake game with modern graphics',
        image: 'https://via.placeholder.com/150',
        link: '/snake'
    },
    {
        name: 'Puzzle Solver',
        description: 'Challenge your mind with brain teasers',
        image: 'https://via.placeholder.com/150',
        link: '/puzzle'
    },
    {
        name: 'Word Scramble',
        description: 'Unscramble words and expand your vocabulary',
        image: 'https://via.placeholder.com/150',
        link: '/wordscramble'
    },
    // {
    //     name: 'Color Match',
    //     description: 'Match colors and create beautiful patterns',
    //     image: 'https://via.placeholder.com/150',
    //     link: '/colormatch'
    // },
    // {
    //     name: 'Math Challenge',
    //     description: 'Quick math problems to sharpen your skills',
    //     image: 'https://via.placeholder.com/150',
    //     link: '/math'
    // }
]

export default function Games() {

    useDocumentTitle('Games Page')
    const [showGames, setShowGames] = useState(false)
    return (
        <>
            <PageTransition onAnimationComplete={() => {
                setShowGames(true)
            }} />
            <div className="flex w-full flex-col mt-8 justify-center ">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Game Collection</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">Explore our collection of interactive games and challenges</p>
                </div>
                {showGames && <GamesList games={gamesList} />}
            </div>
        </>
    );
}


const GamesList = ({ games }: { games: Readonly<typeof gamesList> }) => {
    const navigate = useNavigate();


    const handleNavigate = (link: string) => {
        if (link === '/whot') {
            navigate(`/games${link}`);
        } else {
            toast.error('This game is not available yet');
        }
    }
    return (
        <GamesContainer>

            {games.map((game, index) => (
                <motion.li onClick={() => handleNavigate(game.link)} className="item" key={game.name} initial="offscreen" whileInView="onscreen" variants={polaroidVariants(index)}>
                    <div className="game-content">
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
                            <div className="flex flex-col gap-1">
                                <h3 className="game-title">{game.name}</h3>
                                <p className="game-description">{game.description}</p>
                            </div>
                        </div>
                    </div>
                </motion.li>
            ))}

        </GamesContainer>
    )
}
