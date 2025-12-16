// app/games/memory-match/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Snowfall } from '@/components/snowfall';
import Link from 'next/link';
import { 
  Home, 
  RefreshCw, 
  Clock, 
  Star,
  Trophy,
  CheckCircle,
  Heart,
  Gift,
  Sparkles,
  TreePine,
  Bell,
  CandyCane,
  Snowflake,
//   SantaHat,
  Star as StarIcon,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Playfair_Display } from 'next/font/google';
import Confetti from 'react-confetti';

// Load font locally
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  weight: ['400', '700', '900']
});

// Game configuration
const LEVEL_CONFIG = [
  { 
    level: 1, 
    grid: 4,          // 2x2 pairs
    time: 60,
    moves: 20,
    pairs: 2,
    theme: 'simple',
    difficulty: 'Easy'
  },
  { 
    level: 2, 
    grid: 6,          // 3x2 pairs
    time: 75,
    moves: 25,
    pairs: 3,
    theme: 'medium',
    difficulty: 'Medium'
  },
  { 
    level: 3, 
    grid: 12,         // 4x3 pairs
    time: 90,
    moves: 30,
    pairs: 6,
    theme: 'challenging',
    difficulty: 'Hard'
  },
  { 
    level: 4, 
    grid: 16,         // 4x4 pairs
    time: 105,
    moves: 35,
    pairs: 8,
    theme: 'expert',
    difficulty: 'Expert'
  },
  { 
    level: 5, 
    grid: 20,         // 5x4 pairs
    time: 120,
    moves: 40,
    pairs: 10,
    theme: 'master',
    difficulty: 'Master'
  },
];

// Christmas card types with emojis and colors
const CHRISTMAS_CARDS = [
  { id: 1, type: '🎅', name: 'Santa', color: 'bg-red-500', emoji: '🎅' },
  { id: 2, type: '🎄', name: 'Tree', color: 'bg-green-500', emoji: '🎄' },
  { id: 3, type: '🎁', name: 'Gift', color: 'bg-blue-500', emoji: '🎁' },
  { id: 4, type: '⭐', name: 'Star', color: 'bg-yellow-500', emoji: '⭐' },
  { id: 5, type: '🔔', name: 'Bell', color: 'bg-orange-500', emoji: '🔔' },
  { id: 6, type: '❄️', name: 'Snowflake', color: 'bg-blue-300', emoji: '❄️' },
  { id: 7, type: '🍪', name: 'Cookie', color: 'bg-amber-600', emoji: '🍪' },
  { id: 8, type: '🦌', name: 'Reindeer', color: 'bg-brown-500', emoji: '🦌' },
  { id: 9, type: '👼', name: 'Angel', color: 'bg-white', emoji: '👼' },
  { id: 10, type: '🎶', name: 'Carol', color: 'bg-purple-500', emoji: '🎶' },
  { id: 11, type: '🕯️', name: 'Candle', color: 'bg-yellow-300', emoji: '🕯️' },
  { id: 12, type: '🧦', name: 'Stocking', color: 'bg-red-300', emoji: '🧦' },
  { id: 13, type: '🍬', name: 'Candy', color: 'bg-pink-400', emoji: '🍬' },
  { id: 14, type: '🛷', name: 'Sleigh', color: 'bg-indigo-500', emoji: '🛷' },
  { id: 15, type: '🌟', name: 'Sparkle', color: 'bg-teal-400', emoji: '🌟' },
];

// Card animation types
const CARD_ANIMATIONS = [
  'animate-bounce',
  'animate-pulse',
  'animate-spin-slow',
  'animate-float',
  'animate-shake',
];

type GameState = 'idle' | 'playing' | 'match' | 'mismatch' | 'levelComplete' | 'gameComplete' | 'timeout';
type Card = {
  id: number;
  type: string;
  name: string;
  color: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  animation: string;
};

export default function MemoryMatchPage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVEL_CONFIG[0].time);
  const [movesLeft, setMovesLeft] = useState(LEVEL_CONFIG[0].moves);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'match' | 'combo' | 'streak'; message: string } | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const matchAudioRef = useRef<HTMLAudioElement | null>(null);
  const mismatchAudioRef = useRef<HTMLAudioElement | null>(null);
  const levelUpAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    matchAudioRef.current = new Audio('/sounds/match.mp3');
    mismatchAudioRef.current = new Audio('/sounds/mismatch.mp3');
    levelUpAudioRef.current = new Audio('/sounds/level-up.mp3');
    
    // Fallback to online sounds
    matchAudioRef.current.onerror = () => {
      matchAudioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    };
    mismatchAudioRef.current.onerror = () => {
      mismatchAudioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
    };
    levelUpAudioRef.current.onerror = () => {
      levelUpAudioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    };
  }, []);

  // Generate cards for current level
  const generateCards = useCallback((levelIndex: number): Card[] => {
    const config = LEVEL_CONFIG[levelIndex];
    const selectedCards = CHRISTMAS_CARDS.slice(0, config.pairs);
    
    // Create pairs
    let cardPairs: Card[] = [];
    selectedCards.forEach(card => {
      // Add two copies of each card with random animations
      const animation1 = CARD_ANIMATIONS[Math.floor(Math.random() * CARD_ANIMATIONS.length)];
      const animation2 = CARD_ANIMATIONS[Math.floor(Math.random() * CARD_ANIMATIONS.length)];
      
      cardPairs.push({
        ...card,
        id: card.id * 100 + 1,
        isFlipped: false,
        isMatched: false,
        animation: animation1
      });
      
      cardPairs.push({
        ...card,
        id: card.id * 100 + 2,
        isFlipped: false,
        isMatched: false,
        animation: animation2
      });
    });
    
    // Shuffle cards
    return cardPairs.sort(() => Math.random() - 0.5);
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setLevel(0);
    setScore(0);
    setStreak(0);
    setCombo(0);
    setMatches(0);
    setShowConfetti(false);
    
    const initialCards = generateCards(0);
    setCards(initialCards);
    setFlippedCards([]);
    setTimeLeft(LEVEL_CONFIG[0].time);
    setMovesLeft(LEVEL_CONFIG[0].moves);
    
    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [generateCards]);

  const handleCardClick = useCallback((index: number) => {
    if (gameState !== 'playing' || movesLeft <= 0) return;
    
    const card = cards[index];
    
    // Don't allow clicking already flipped or matched cards
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    
    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];
      
      // Use moves
      setMovesLeft(prev => prev - 1);
      
      if (firstCard.type === secondCard.type) {
        // Match found
        setTimeout(() => {
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          setCards(newCards);
          setFlippedCards([]);
          setMatches(prev => prev + 1);
          setStreak(prev => prev + 1);
          setCombo(prev => prev + 1);
          
          // Calculate score
          const baseScore = 100 * (level + 1);
          const streakBonus = Math.floor(streak * 50);
          const comboBonus = Math.floor(combo * 25);
          const timeBonus = Math.floor(timeLeft * 0.5);
          const matchScore = baseScore + streakBonus + comboBonus + timeBonus;
          
          setScore(prev => prev + matchScore);
          
          // Show feedback
          if (combo >= 2) {
            setFeedback({ type: 'combo', message: `COMBO x${combo}! +${matchScore}` });
          } else if (streak >= 3) {
            setFeedback({ type: 'streak', message: `STREAK ${streak}! +${matchScore}` });
          } else {
            setFeedback({ type: 'match', message: `Match! +${matchScore}` });
          }
          
          // Play match sound
          if (matchAudioRef.current) {
            matchAudioRef.current.currentTime = 0;
            matchAudioRef.current.play().catch(console.error);
          }
          
          // Check if level is complete
          const totalPairs = LEVEL_CONFIG[level].pairs;
          if (matches + 1 >= totalPairs) {
            setTimeout(() => {
              setGameState('levelComplete');
              if (levelUpAudioRef.current) {
                levelUpAudioRef.current.currentTime = 0;
                levelUpAudioRef.current.play().catch(console.error);
              }
            }, 1000);
          }
          
          setTimeout(() => setFeedback(null), 1500);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
          setStreak(0);
          
          // Play mismatch sound
          if (mismatchAudioRef.current) {
            mismatchAudioRef.current.currentTime = 0;
            mismatchAudioRef.current.play().catch(console.error);
          }
        }, 1000);
      }
    }
  }, [cards, flippedCards, gameState, level, matches, movesLeft, streak, combo, timeLeft]);

  const nextLevel = () => {
    const nextLevelIndex = level + 1;
    
    if (nextLevelIndex >= LEVEL_CONFIG.length) {
      // Game complete
      setShowConfetti(true);
      setGameState('gameComplete');
      return;
    }
    
    setLevel(nextLevelIndex);
    setStreak(0);
    setCombo(0);
    setMatches(0);
    
    const newCards = generateCards(nextLevelIndex);
    setCards(newCards);
    setFlippedCards([]);
    setTimeLeft(LEVEL_CONFIG[nextLevelIndex].time);
    setMovesLeft(LEVEL_CONFIG[nextLevelIndex].moves);
    setGameState('playing');
    
    // Start timer for new level
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const restartGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startGame();
  };

  // Calculate grid columns based on level
  const getGridCols = () => {
    const gridSize = LEVEL_CONFIG[level]?.grid || 4;
    if (gridSize <= 4) return 'grid-cols-2';
    if (gridSize <= 6) return 'grid-cols-3';
    if (gridSize <= 12) return 'grid-cols-4';
    if (gridSize <= 16) return 'grid-cols-4';
    return 'grid-cols-5';
  };

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const levelConfig = LEVEL_CONFIG[level];
  const progress = matches / (levelConfig?.pairs || 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-red-50 overflow-x-hidden">
      <Snowfall />
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} onConfettiComplete={() => setShowConfetti(false)} />}
      
      <nav className="relative z-10 border-b bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-red-600" />
            <span className="text-lg font-semibold text-gray-800">Christmas Memory Match</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/games">
              <Button variant="ghost" size="sm">
                Back to Games
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className={cn("text-4xl md:text-5xl font-bold text-gray-800 mb-4", playfair.className)}>
            🎄 Christmas Memory Match 🎄
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find matching Christmas pairs! Remember positions and make matches before time runs out!
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Score</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{score}</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Level</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {level + 1}
              <span className="text-sm text-gray-500 ml-2">({levelConfig?.difficulty})</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Time</span>
            </div>
            <div className={cn(
              "text-3xl font-bold",
              timeLeft > 30 ? "text-blue-600" : "text-red-600 animate-pulse"
            )}>
              {timeLeft}s
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Moves</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {movesLeft}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Matches</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">
              {matches}/{levelConfig?.pairs || 0}
            </div>
          </div>
        </div>

        {/* Streak & Combo Stats */}
        {(streak > 0 || combo > 0) && (
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
            {streak > 2 && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <span className="font-bold text-yellow-700">STREAK</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{streak} 🔥</div>
              </div>
            )}
            
            {combo > 1 && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <StarIcon className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-700">COMBO</span>
                </div>
                <div className="text-2xl font-bold text-pink-600">x{combo} ✨</div>
              </div>
            )}
          </div>
        )}

        {/* Game Instructions */}
        {gameState === 'idle' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto mb-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play:</h2>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <span>Click cards to reveal Christmas symbols</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Find matching pairs of symbols</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Complete each level before time or moves run out</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>Build streaks and combos for bonus points!</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span>Complete all 5 levels to become a Memory Master!</span>
              </li>
            </ul>
            
            <div className="text-center">
              <Button
                size="lg"
                onClick={startGame}
                className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-8 py-6 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Memory Challenge
              </Button>
            </div>
          </div>
        )}

        {/* Game Area */}
        {gameState !== 'idle' && gameState !== 'gameComplete' && gameState !== 'timeout' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Level {level + 1}: {levelConfig.difficulty}
                </span>
                <span className="text-sm font-semibold text-red-600">
                  {Math.round(progress * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div className={cn(
                "text-center mb-6 p-4 rounded-xl animate-bounce",
                feedback.type === 'match' && "bg-green-100 text-green-800 border border-green-200",
                feedback.type === 'combo' && "bg-purple-100 text-purple-800 border border-purple-200",
                feedback.type === 'streak' && "bg-yellow-100 text-yellow-800 border border-yellow-200"
              )}>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-xl font-semibold">{feedback.message}</span>
                </div>
              </div>
            )}

            {/* Level Info */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Grid Size</div>
                  <div className="text-xl font-bold text-blue-600">
                    {levelConfig.grid} cards
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Pairs to Find</div>
                  <div className="text-xl font-bold text-green-600">
                    {levelConfig.pairs}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Max Moves</div>
                  <div className="text-xl font-bold text-purple-600">
                    {levelConfig.moves}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Time Limit</div>
                  <div className="text-xl font-bold text-orange-600">
                    {levelConfig.time}s
                  </div>
                </div>
              </div>
            </div>

            {/* Card Grid */}
            <div className={cn(
              "grid gap-3 md:gap-4 mx-auto mb-6",
              getGridCols(),
              levelConfig.grid <= 4 && "max-w-sm",
              levelConfig.grid <= 6 && "max-w-md",
              levelConfig.grid <= 12 && "max-w-2xl",
              levelConfig.grid <= 16 && "max-w-3xl",
              levelConfig.grid <= 20 && "max-w-4xl",
            )}>
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  disabled={gameState !== 'playing' || card.isMatched || flippedCards.length >= 2}
                  className={cn(
                    "relative aspect-square rounded-xl transition-all duration-300",
                    "flex items-center justify-center text-4xl md:text-5xl",
                    "hover:scale-105 hover:shadow-xl active:scale-95",
                    !card.isFlipped && !card.isMatched && "bg-gradient-to-br from-blue-100 to-red-100",
                    card.isFlipped && !card.isMatched && cn(card.color, "text-white shadow-lg", card.animation),
                    card.isMatched && cn("bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl", card.animation),
                    card.isMatched && "ring-4 ring-green-300",
                    flippedCards.includes(index) && "ring-4 ring-blue-400",
                    (gameState !== 'playing' || card.isMatched) && "cursor-default"
                  )}
                >
                  {/* Card back (unflipped) */}
                  {!card.isFlipped && !card.isMatched && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-red-400 to-green-400 opacity-80" />
                    </div>
                  )}
                  
                  {/* Card front (flipped or matched) */}
                  {(card.isFlipped || card.isMatched) && (
                    <div className={cn(
                      "transform transition-transform duration-300",
                      card.isFlipped && "scale-100",
                      card.isMatched && "scale-110"
                    )}>
                      {card.emoji}
                    </div>
                  )}
                  
                  {/* Matched indicator */}
                  {card.isMatched && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  )}
                  
                  {/* Card number (for debugging) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="absolute top-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
                      {index}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={restartGame}
                variant="outline"
                size="lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Restart Level
              </Button>
              
              <Button
                onClick={() => {
                  // Reveal all cards temporarily (cheat/hint)
                  if (gameState === 'playing' && movesLeft > 5) {
                    const newCards = cards.map(card => ({ ...card, isFlipped: true }));
                    setCards(newCards);
                    setMovesLeft(prev => prev - 5);
                    
                    setTimeout(() => {
                      const resetCards = cards.map(card => 
                        card.isMatched ? card : { ...card, isFlipped: false }
                      );
                      setCards(resetCards);
                    }, 2000);
                  }
                }}
                variant="outline"
                size="lg"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                disabled={gameState !== 'playing' || movesLeft <= 5}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Peek (-5 moves)
              </Button>
            </div>
          </div>
        )}

        {/* Level Complete Screen */}
        {gameState === 'levelComplete' && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 max-w-md mx-auto text-center shadow-xl animate-in zoom-in duration-500">
            <div className="inline-block p-4 bg-white rounded-full mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Level {level + 1} Complete! 🎉</h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Moves Used</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {levelConfig.moves - movesLeft}/{levelConfig.moves}
                  </div>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Time Bonus</div>
                  <div className="text-2xl font-bold text-blue-600">+{Math.floor(timeLeft * 10)}</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Level Score</div>
                <div className="text-2xl font-bold text-orange-600">
                  {matches * 100 * (level + 1) + Math.floor(timeLeft * 10)}
                </div>
              </div>
              
              {level < LEVEL_CONFIG.length - 1 && (
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Next Level</div>
                  <div className="text-xl font-bold text-green-600">
                    Level {level + 2}: {LEVEL_CONFIG[level + 1].difficulty}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {LEVEL_CONFIG[level + 1].grid} cards • {LEVEL_CONFIG[level + 1].pairs} pairs
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={nextLevel}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                {level < LEVEL_CONFIG.length - 1 ? 'Continue to Next Level' : 'View Final Results'}
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={restartGame}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </div>
          </div>
        )}

        {/* Game Complete Screen */}
        {gameState === 'gameComplete' && (
          <div className="bg-gradient-to-br from-yellow-50 to-red-50 rounded-2xl p-8 max-w-md mx-auto text-center shadow-xl animate-in zoom-in duration-500">
            <div className="inline-block p-4 bg-white rounded-full mb-4">
              <Trophy className="w-20 h-20 text-yellow-500" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-2">🏆 Memory Master! 🏆</h2>
            <p className="text-2xl font-bold text-red-600 mb-2">Final Score: {score}</p>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Levels Completed</div>
                  <div className="text-2xl font-bold text-green-600">{LEVEL_CONFIG.length}</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Matches</div>
                  <div className="text-2xl font-bold text-pink-600">
                    {LEVEL_CONFIG.reduce((sum, config) => sum + config.pairs, 0)}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
                <div className="text-lg font-bold text-pink-600">🎄 Christmas Memory Champion! 🎄</div>
                <p className="text-sm text-gray-600 mt-1">
                  You&apos;ve mastered all levels! Your memory skills are truly impressive!
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link href="/">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button
                size="lg"
                onClick={restartGame}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </div>
          </div>
        )}

        {/* Timeout Screen */}
        {gameState === 'timeout' && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 max-w-md mx-auto text-center shadow-xl">
            <div className="inline-block p-4 bg-white rounded-full mb-4">
              <Clock className="w-16 h-16 text-red-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">⏰ Time&apos;s Up!</h2>
            <p className="text-gray-600 mb-6">
              You found {matches} out of {levelConfig.pairs} pairs in level {level + 1}.
            </p>
            <p className="text-xl font-bold text-red-600 mb-6">Score: {score}</p>
            
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={restartGame}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Tips & Strategies */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Memory Tips & Strategies:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Start by revealing cards around the edges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Remember positions of unique symbols first</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Build combos by making consecutive matches</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Watch your moves - use them wisely!</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Use the &quot;Peek&quot; feature only when necessary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Complete matches quickly to build streaks</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🎄 Memory Challenge Levels:</h4>
            <div className="space-y-2">
              {LEVEL_CONFIG.map((config, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Level {config.level}: {config.difficulty}</span>
                  <span className="text-gray-600">{config.grid} cards, {config.pairs} pairs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add custom animations to tailwind config
// In your tailwind.config.js, add:
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'spin-slow': 'spin 3s linear infinite',
//         'float': 'float 3s ease-in-out infinite',
//         'shake': 'shake 0.5s ease-in-out',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//         shake: {
//           '0%, 100%': { transform: 'translateX(0)' },
//           '25%': { transform: 'translateX(-5px)' },
//           '75%': { transform: 'translateX(5px)' },
//         },
//       },
//     },
//   },
// }