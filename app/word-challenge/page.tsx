
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
  XCircle,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Sparkles,
  Gift
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
    time: 90, 
    wordsPerLevel: 5, 
    missingLetters: 1, 
    hintCost: 5,
    scoreMultiplier: 1,
    difficulty: 'Easy'
  },
  { 
    level: 2, 
    time: 75, 
    wordsPerLevel: 6, 
    missingLetters: 1, 
    hintCost: 10,
    scoreMultiplier: 1.5,
    difficulty: 'Medium'
  },
  { 
    level: 3, 
    time: 60, 
    wordsPerLevel: 7, 
    missingLetters: 2, 
    hintCost: 15,
    scoreMultiplier: 2,
    difficulty: 'Hard'
  },
  { 
    level: 4, 
    time: 45, 
    wordsPerLevel: 8, 
    missingLetters: 2, 
    hintCost: 20,
    scoreMultiplier: 2.5,
    difficulty: 'Expert'
  },
  { 
    level: 5, 
    time: 30, 
    wordsPerLevel: 10, 
    missingLetters: 3, 
    hintCost: 25,
    scoreMultiplier: 3,
    difficulty: 'Master'
  },
];

// Christmas words database with hints
const CHRISTMAS_WORDS = [
  // Level 1 words (Easy - 3-5 letters)
  { word: 'SNOW', hint: 'White flakes from the sky', category: 'Weather', difficulty: 1 },
  { word: 'GIFT', hint: 'Something given during holidays', category: 'Tradition', difficulty: 1 },
  { word: 'TREE', hint: 'Decorated with lights and ornaments', category: 'Decoration', difficulty: 1 },
  { word: 'STAR', hint: 'Shines on top of the tree', category: 'Decoration', difficulty: 1 },
  { word: 'BELL', hint: 'Makes a jingling sound', category: 'Sound', difficulty: 1 },
  { word: 'ELF', hint: 'Santa\'s helper', category: 'Character', difficulty: 1 },
  { word: 'JOY', hint: 'Feeling of happiness', category: 'Emotion', difficulty: 1 },
  { word: 'HO HO', hint: 'Santa\'s laugh', category: 'Sound', difficulty: 1 },
  
  // Level 2 words (Medium - 5-7 letters)
  { word: 'SANTA', hint: 'Man in red suit with gifts', category: 'Character', difficulty: 2 },
  { word: 'ANGEL', hint: 'Heavenly being with wings', category: 'Character', difficulty: 2 },
  { word: 'CANDY', hint: 'Sweet treat on a cane', category: 'Food', difficulty: 2 },
  { word: 'HOLLY', hint: 'Plant with red berries', category: 'Plant', difficulty: 2 },
  { word: 'JOLLY', hint: 'Merry and cheerful', category: 'Emotion', difficulty: 2 },
  { word: 'MERRY', hint: 'Another word for happy', category: 'Emotion', difficulty: 2 },
  { word: 'PEACE', hint: 'Opposite of war', category: 'Concept', difficulty: 2 },
  { word: 'WREATH', hint: 'Circular decoration on doors', category: 'Decoration', difficulty: 2 },
  
  // Level 3 words (Hard - 7-9 letters)
  { word: 'REINDEER', hint: 'Animal that pulls Santa\'s sleigh', category: 'Animal', difficulty: 3 },
  { word: 'SNOWMAN', hint: 'Made of three snowballs', category: 'Character', difficulty: 3 },
  { word: 'GINGER', hint: 'Type of bread man', category: 'Food', difficulty: 3 },
  { word: 'COOKIE', hint: 'Santa\'s favorite snack', category: 'Food', difficulty: 3 },
  { word: 'CAROLS', hint: 'Christmas songs', category: 'Music', difficulty: 3 },
  { word: 'FAMILY', hint: 'People you celebrate with', category: 'People', difficulty: 3 },
  { word: 'PRESENT', hint: 'Another word for gift', category: 'Tradition', difficulty: 3 },
  { word: 'SLEIGH', hint: 'Santa\'s vehicle', category: 'Transport', difficulty: 3 },
  
  // Level 4 words (Expert - 8-12 letters)
  { word: 'CHRISTMAS', hint: 'December 25th holiday', category: 'Holiday', difficulty: 4 },
  { word: 'DECORATION', hint: 'Ornaments and lights', category: 'Decoration', difficulty: 4 },
  { word: 'FESTIVITY', hint: 'Celebration and joy', category: 'Event', difficulty: 4 },
  { word: 'MISTLETOE', hint: 'Hang it for kisses', category: 'Plant', difficulty: 4 },
  { word: 'CHIMNEY', hint: 'Santa enters through it', category: 'Building', difficulty: 4 },
  { word: 'WORKSHOP', hint: 'Where elves make toys', category: 'Place', difficulty: 4 },
  { word: 'CANDLE', hint: 'Provides warm light', category: 'Decoration', difficulty: 4 },
  { word: 'GARLAND', hint: 'Decorative chain of leaves', category: 'Decoration', difficulty: 4 },
  
  // Level 5 words (Master - 10+ letters)
  { word: 'NUTCRACKER', hint: 'Ballet and decorative figure', category: 'Tradition', difficulty: 5 },
  { word: 'STOCKING', hint: 'Hung by the fireplace', category: 'Tradition', difficulty: 5 },
  { word: 'CELEBRATION', hint: 'Party and festivities', category: 'Event', difficulty: 5 },
  { word: 'ADVENT', hint: 'Countdown to Christmas', category: 'Tradition', difficulty: 5 },
  { word: 'YULETIDE', hint: 'Old word for Christmas season', category: 'Season', difficulty: 5 },
  { word: 'FIGGY PUDDING', hint: 'Traditional Christmas dessert', category: 'Food', difficulty: 5 },
  { word: 'NORTH POLE', hint: 'Santa\'s home', category: 'Location', difficulty: 5 },
  { word: 'KRISS KRINGLE', hint: 'Another name for Santa', category: 'Character', difficulty: 5 },
];

type GameState = 'idle' | 'playing' | 'correct' | 'incorrect' | 'timeout' | 'levelComplete' | 'gameComplete';
type LetterState = 'hidden' | 'revealed' | 'correct' | 'incorrect';

interface GameWord {
  original: string;
  display: string;
  missingIndices: number[];
  hint: string;
  category: string;
  currentInput: string[];
  letterStates: LetterState[];
  solved: boolean;
}

export default function WordChallengePage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVEL_CONFIG[0].time);
  const [currentWords, setCurrentWords] = useState<GameWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement | null>(null);
  const levelUpAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    correctAudioRef.current = new Audio('/sounds/correct.mp3');
    incorrectAudioRef.current = new Audio('/sounds/incorrect.mp3');
    levelUpAudioRef.current = new Audio('/sounds/level-up.mp3');
    
    // Fallback to online sounds
    correctAudioRef.current.onerror = () => {
      correctAudioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
    };
    incorrectAudioRef.current.onerror = () => {
      incorrectAudioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
    };
    levelUpAudioRef.current.onerror = () => {
      levelUpAudioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    };
  }, []);

  // Generate random missing letters for a word
  const generateMissingLetters = useCallback((word: string, count: number): number[] => {
    const wordLength = word.length;
    const indices: number[] = [];
    
    // Don't hide spaces or hyphens
    const validIndices = Array.from(word).map((char, idx) => 
      char !== ' ' && char !== '-' ? idx : -1
    ).filter(idx => idx !== -1);
    
    if (validIndices.length <= count) {
      return validIndices;
    }
    
    // Randomly select indices to hide
    while (indices.length < count) {
      const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    
    return indices.sort((a, b) => a - b);
  }, []);

  // Create game words for current level
  const generateLevelWords = useCallback((levelIndex: number): GameWord[] => {
    const config = LEVEL_CONFIG[levelIndex];
    const wordsForLevel = CHRISTMAS_WORDS.filter(word => word.difficulty <= levelIndex + 1);
    
    // Shuffle and select words
    const shuffled = [...wordsForLevel].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, config.wordsPerLevel);
    
    return selected.map(wordData => {
      const missingIndices = generateMissingLetters(wordData.word, config.missingLetters);
      const displayArray = Array.from(wordData.word);
      
      // Create display with underscores for missing letters
      const display = displayArray.map((char, idx) => {
        if (char === ' ') return ' ';
        if (char === '-') return '-';
        return missingIndices.includes(idx) ? '_' : char;
      }).join('');
      
      const currentInput = displayArray.map((char, idx) => 
        missingIndices.includes(idx) ? '' : char
      );
      
      const letterStates: LetterState[] = displayArray.map((_, idx) => 
        missingIndices.includes(idx) ? 'hidden' : 'revealed'
      );
      
      return {
        original: wordData.word,
        display,
        missingIndices,
        hint: wordData.hint,
        category: wordData.category,
        currentInput,
        letterStates,
        solved: false
      };
    });
  }, [generateMissingLetters]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setLevel(0);
    setScore(0);
    setHintsUsed(0);
    setStreak(0);
    setShowConfetti(false);
    const words = generateLevelWords(0);
    setCurrentWords(words);
    setCurrentWordIndex(0);
    setShowHint(false);
    setTimeLeft(LEVEL_CONFIG[0].time);
    
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
    
    // Focus first input after a delay
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }, 100);
  }, [generateLevelWords]);

  const nextWord = useCallback(() => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowHint(false);
      
      // Focus first input of next word
      setTimeout(() => {
        const nextWord = currentWords[currentWordIndex + 1];
        const firstMissingIndex = nextWord.missingIndices[0];
        if (inputRefs.current[firstMissingIndex]) {
          inputRefs.current[firstMissingIndex]?.focus();
        }
      }, 100);
    } else {
      // Level complete
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState('levelComplete');
      
      // Play level up sound
      if (levelUpAudioRef.current) {
        levelUpAudioRef.current.currentTime = 0;
        levelUpAudioRef.current.play().catch(console.error);
      }
      
      // Add bonus points for unused time
      const timeBonus = Math.floor(timeLeft * 10);
      setScore(prev => prev + timeBonus);
    }
  }, [currentWordIndex, currentWords, timeLeft]);

  const checkWord = useCallback(() => {
    const currentWord = currentWords[currentWordIndex];
    const userInput = currentWord.currentInput.join('');
    const isCorrect = userInput === currentWord.original;
    
    // Update letter states
    const newLetterStates = [...currentWord.letterStates];
    const newCurrentInput = [...currentWord.currentInput];
    
    for (let i = 0; i < currentWord.original.length; i++) {
      if (currentWord.missingIndices.includes(i)) {
        const userChar = newCurrentInput[i];
        const correctChar = currentWord.original[i];
        newLetterStates[i] = userChar === correctChar ? 'correct' : 'incorrect';
      }
    }
    
    const updatedWords = [...currentWords];
    updatedWords[currentWordIndex] = {
      ...currentWord,
      letterStates: newLetterStates,
      solved: isCorrect
    };
    setCurrentWords(updatedWords);
    
    if (isCorrect) {
      // Correct answer
      setGameState('correct');
      setStreak(prev => prev + 1);
      
      // Calculate score
      const baseScore = 100 * (level + 1);
      const streakBonus = Math.floor(streak * 20);
      const hintPenalty = showHint ? LEVEL_CONFIG[level].hintCost * 10 : 0;
      const wordScore = Math.max(baseScore + streakBonus - hintPenalty, 50);
      
      setScore(prev => prev + wordScore);
      setFeedback({ type: 'correct', message: `Excellent! +${wordScore} points` });
      
      if (correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0;
        correctAudioRef.current.play().catch(console.error);
      }
      
      // Move to next word after delay
      setTimeout(() => {
        nextWord();
        setGameState('playing');
        setFeedback(null);
      }, 1500);
    } else {
      // Incorrect answer
      setGameState('incorrect');
      setStreak(0);
      setFeedback({ type: 'incorrect', message: 'Not quite! Try again' });
      
      if (incorrectAudioRef.current) {
        incorrectAudioRef.current.currentTime = 0;
        incorrectAudioRef.current.play().catch(console.error);
      }
      
      setTimeout(() => {
        setGameState('playing');
        setFeedback(null);
      }, 1500);
    }
  }, [currentWords, currentWordIndex, level, streak, showHint, nextWord]);

  const handleLetterInput = (index: number, value: string) => {
    if (gameState !== 'playing') return;
    
    const updatedWords = [...currentWords];
    const currentWord = updatedWords[currentWordIndex];
    
    // Only allow letters
    const letter = value.toUpperCase().replace(/[^A-Z]/g, '');
    if (letter && letter.length > 1) return;
    
    currentWord.currentInput[index] = letter || '';
    setCurrentWords(updatedWords);
    
    // Auto-focus next input
    if (letter && index < currentWord.original.length - 1) {
      const nextIndex = findNextMissingIndex(index + 1);
      if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
        setTimeout(() => inputRefs.current[nextIndex]?.focus(), 10);
      }
    }
    
    // Auto-check if all letters are filled
    const allFilled = currentWord.missingIndices.every(idx => 
      currentWord.currentInput[idx].length === 1
    );
    if (allFilled) {
      setTimeout(checkWord, 100);
    }
  };

  const findNextMissingIndex = (startFrom: number): number => {
    const currentWord = currentWords[currentWordIndex];
    for (let i = startFrom; i < currentWord.original.length; i++) {
      if (currentWord.missingIndices.includes(i)) {
        return i;
      }
    }
    return -1;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const currentWord = currentWords[currentWordIndex];
    
    if (e.key === 'Backspace' && !currentWord.currentInput[index]) {
      // Move to previous input on backspace
      const prevIndex = findPreviousMissingIndex(index - 1);
      if (prevIndex !== -1 && inputRefs.current[prevIndex]) {
        setTimeout(() => {
          inputRefs.current[prevIndex]?.focus();
          inputRefs.current[prevIndex]?.select();
        }, 10);
      }
    } else if (e.key === 'Enter') {
      checkWord();
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = findPreviousMissingIndex(index - 1);
      if (prevIndex !== -1 && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex]?.focus();
        e.preventDefault();
      }
    } else if (e.key === 'ArrowRight') {
      const nextIndex = findNextMissingIndex(index + 1);
      if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
        e.preventDefault();
      }
    }
  };

  const findPreviousMissingIndex = (startFrom: number): number => {
    const currentWord = currentWords[currentWordIndex];
    for (let i = startFrom; i >= 0; i--) {
      if (currentWord.missingIndices.includes(i)) {
        return i;
      }
    }
    return -1;
  };

  const useHint = () => {
    if (gameState !== 'playing' || showHint) return;
    
    const currentWord = currentWords[currentWordIndex];
    const unsolvedIndices = currentWord.missingIndices.filter(idx => 
      !currentWord.currentInput[idx] || currentWord.currentInput[idx] !== currentWord.original[idx]
    );
    
    if (unsolvedIndices.length === 0) return;
    
    // Reveal one random letter
    const randomIndex = unsolvedIndices[Math.floor(Math.random() * unsolvedIndices.length)];
    const correctLetter = currentWord.original[randomIndex];
    
    const updatedWords = [...currentWords];
    updatedWords[currentWordIndex].currentInput[randomIndex] = correctLetter;
    updatedWords[currentWordIndex].letterStates[randomIndex] = 'revealed';
    setCurrentWords(updatedWords);
    
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    
    // Focus next unsolved input
    const nextIndex = findNextMissingIndex(randomIndex + 1);
    if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 10);
    }
  };

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
    setShowHint(false);
    
    const words = generateLevelWords(nextLevelIndex);
    setCurrentWords(words);
    setCurrentWordIndex(0);
    setTimeLeft(LEVEL_CONFIG[nextLevelIndex].time);
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
    
    // Focus first input
    setTimeout(() => {
      if (words[0]?.missingIndices[0] !== undefined) {
        const firstIndex = words[0].missingIndices[0];
        if (inputRefs.current[firstIndex]) {
          inputRefs.current[firstIndex]?.focus();
        }
      }
    }, 100);
  };

  const restartGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startGame();
  };

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentWord = currentWords[currentWordIndex];
  const levelConfig = LEVEL_CONFIG[level];
  const progress = currentWordIndex / currentWords.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-red-50 overflow-x-hidden">
      <Snowfall />
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} onConfettiComplete={() => setShowConfetti(false)} />}
      
      <nav className="relative z-10 border-b bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-red-600" />
            <span className="text-lg font-semibold text-gray-800">Christmas Word Challenge</span>
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
            🎄 Christmas Word Challenge 🎄
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in the missing letters to complete Christmas words! Gets harder each level!
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
              <Sparkles className="w-5 h-5" />
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
              <Star className="w-5 h-5" />
              <span className="font-semibold">Streak</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {streak} 🔥
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">Hints</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {hintsUsed}
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        {gameState === 'idle' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto mb-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play:</h2>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <span>Fill in the missing letters in Christmas words</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Each level gets harder with more missing letters</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Use hints sparingly - they cost points!</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>Build streaks for bonus points</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span>Complete all 5 levels to win!</span>
              </li>
            </ul>
            
            <div className="text-center">
              <Button
                size="lg"
                onClick={startGame}
                className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-8 py-6 text-lg"
              >
                Start Challenge
              </Button>
            </div>
          </div>
        )}

        {/* Game Area */}
        {gameState !== 'idle' && gameState !== 'gameComplete' && gameState !== 'timeout' && currentWord && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Word {currentWordIndex + 1} of {currentWords.length}
                </span>
                <span className="text-sm font-semibold text-red-600">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Word Category and Hint */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold">{currentWord.category}</span>
              </div>
              
              <div className="mb-4">
                <p className="text-lg text-gray-700">{currentWord.hint}</p>
              </div>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div className={cn(
                "text-center mb-6 p-4 rounded-xl animate-bounce",
                feedback.type === 'correct' 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-red-100 text-red-800 border border-red-200"
              )}>
                <div className="flex items-center justify-center gap-2">
                  {feedback.type === 'correct' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                  <span className="text-xl font-semibold">{feedback.message}</span>
                </div>
              </div>
            )}

            {/* Word Display */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
                {Array.from(currentWord.original).map((letter, index) => {
                  const isMissing = currentWord.missingIndices.includes(index);
                  const isSpace = letter === ' ';
                  const isHyphen = letter === '-';
                  const state = currentWord.letterStates[index];
                  
                  if (isSpace) {
                    return <div key={index} className="w-8 md:w-10" />;
                  }
                  
                  if (isHyphen) {
                    return (
                      <div key={index} className="flex items-center justify-center w-8 md:w-10 h-14">
                        <span className="text-2xl font-bold text-gray-800">-</span>
                      </div>
                    );
                  }
                  
                  if (isMissing) {
                    return (
                      <div key={index} className="relative">
                        <input
                          ref={el => inputRefs.current[index] = el}
                          type="text"
                          maxLength={1}
                          value={currentWord.currentInput[index]}
                          onChange={(e) => handleLetterInput(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          disabled={gameState !== 'playing'}
                          className={cn(
                            "w-12 h-14 md:w-14 md:h-16 text-center text-2xl md:text-3xl font-bold rounded-lg border-2",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            state === 'correct' && "border-green-500 bg-green-50 text-green-700",
                            state === 'incorrect' && "border-red-500 bg-red-50 text-red-700",
                            state === 'hidden' && "border-blue-300 bg-blue-50 text-blue-800",
                            state === 'revealed' && "border-purple-500 bg-purple-50 text-purple-700",
                            gameState !== 'playing' && "opacity-75 cursor-not-allowed"
                          )}
                        />
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                          {index + 1}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className="relative">
                      <div className={cn(
                        "w-12 h-14 md:w-14 md:h-16 flex items-center justify-center text-2xl md:text-3xl font-bold rounded-lg",
                        "border-2 border-gray-300 bg-gray-100 text-gray-700"
                      )}>
                        {letter}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                        {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Word length indicator */}
              <div className="text-center text-sm text-gray-500">
                {currentWord.original.length} letters
              </div>
            </div>

            {/* Level Info */}
            <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Missing Letters</div>
                  <div className="text-2xl font-bold text-red-600">
                    {levelConfig.missingLetters}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Words in Level</div>
                  <div className="text-2xl font-bold text-green-600">
                    {currentWords.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Score Multiplier</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {levelConfig.scoreMultiplier}x
                  </div>
                </div>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={checkWord}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                disabled={gameState !== 'playing'}
              >
                Check Word
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={useHint}
                variant="outline"
                size="lg"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
                disabled={gameState !== 'playing' || showHint}
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Use Hint (-{levelConfig.hintCost}pts)
              </Button>
              
              <Button
                onClick={restartGame}
                variant="ghost"
                size="lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Restart
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
                  <div className="text-sm text-gray-600">Words Solved</div>
                  <div className="text-2xl font-bold text-green-600">{currentWords.filter(w => w.solved).length}/{currentWords.length}</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Time Bonus</div>
                  <div className="text-2xl font-bold text-blue-600">+{Math.floor(timeLeft * 10)}</div>
                </div>
              </div>
              
              {level < LEVEL_CONFIG.length - 1 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Next Level</div>
                  <div className="text-xl font-bold text-orange-600">
                    Level {level + 2}: {LEVEL_CONFIG[level + 1].difficulty}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {LEVEL_CONFIG[level + 1].missingLetters} missing letters • {LEVEL_CONFIG[level + 1].time}s time
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
                <ChevronRight className="w-5 h-5 ml-2" />
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
            
            <h2 className="text-4xl font-bold text-gray-800 mb-2">🏆 Challenge Complete! 🏆</h2>
            <p className="text-2xl font-bold text-red-600 mb-2">Final Score: {score}</p>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Levels Completed</div>
                  <div className="text-2xl font-bold text-green-600">{LEVEL_CONFIG.length}</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Hints Used</div>
                  <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
                <div className="text-lg font-bold text-pink-600">🎅 Master of Christmas Words! 🎅</div>
                <p className="text-sm text-gray-600 mt-1">
                  You&apos;ve conquered all levels! You&apos;re a true Christmas word expert!
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
              You completed {currentWords.filter(w => w.solved).length} out of {currentWords.length} words.
            </p>
            <p className="text-xl font-bold text-red-600 mb-6">Final Score: {score}</p>
            
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

      {/* Footer Instructions */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Tips & Strategies:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Use category and hint clues wisely</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Think about common Christmas phrases</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Save hints for really tough words</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Watch the timer - it gets shorter each level</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Build streaks for big bonuses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Complete all 5 levels for maximum score</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">🎄 Christmas Word Categories:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from(new Set(CHRISTMAS_WORDS.map(w => w.category))).map(category => (
                <span key={category} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}