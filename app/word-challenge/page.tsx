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
  Gift,
  AlertTriangle,
  Zap,
  Target,
  Volume2,
  VolumeX,
  Settings,
  Users,
  Award,
  TrendingUp,
  Timer,
  Brain,
  Shield,
  Music,
  Gamepad2,
  BarChart3,
  Crown,
  Moon,
  Sun,
  Heart,
  Flame,
  Puzzle,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Playfair_Display, Inter } from 'next/font/google';
import Confetti from 'react-confetti';

// Load fonts
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  weight: ['400', '700', '900']
});

const inter = Inter({ subsets: ['latin'] });

// Enhanced Game configuration with dynamic difficulty
const LEVEL_CONFIG = [
  { 
    level: 1, 
    time: 120,
    wordsPerLevel: 8,
    missingLetters: 1, 
    hintCost: 5,
    scoreMultiplier: 1,
    difficulty: 'Easy',
    penalty: 0,
    timePerWord: 20,
    color: 'from-emerald-100 to-emerald-50',
    icon: '🎄',
    theme: 'classic',
    bonusMultiplier: 1,
    powerUps: 1
  },
  { 
    level: 2, 
    time: 100,
    wordsPerLevel: 10,
    missingLetters: 1, 
    hintCost: 8,
    scoreMultiplier: 1.5,
    difficulty: 'Medium',
    penalty: 5,
    timePerWord: 12,
    color: 'from-blue-100 to-cyan-50',
    icon: '🎅',
    theme: 'north-pole',
    bonusMultiplier: 1.2,
    powerUps: 2
  },
  { 
    level: 3, 
    time: 85,
    wordsPerLevel: 12,
    missingLetters: 2, 
    hintCost: 12,
    scoreMultiplier: 2,
    difficulty: 'Hard',
    penalty: 8,
    timePerWord: 8,
    color: 'from-violet-100 to-purple-50',
    icon: '🦌',
    theme: 'snowy-forest',
    bonusMultiplier: 1.5,
    powerUps: 2
  },
  { 
    level: 4, 
    time: 70,
    wordsPerLevel: 15,
    missingLetters: 2, 
    hintCost: 15,
    scoreMultiplier: 2.5,
    difficulty: 'Expert',
    penalty: 12,
    timePerWord: 6,
    color: 'from-orange-100 to-amber-50',
    icon: '❄️',
    theme: 'workshop',
    bonusMultiplier: 1.8,
    powerUps: 3
  },
  { 
    level: 5, 
    time: 60,
    wordsPerLevel: 18,
    missingLetters: 3, 
    hintCost: 18,
    scoreMultiplier: 3,
    difficulty: 'Master',
    penalty: 15,
    timePerWord: 5,
    color: 'from-rose-100 to-pink-50',
    icon: '🎁',
    theme: 'christmas-night',
    bonusMultiplier: 2,
    powerUps: 3
  },
  { 
    level: 6, 
    time: 50,
    wordsPerLevel: 20,
    missingLetters: 3, 
    hintCost: 20,
    scoreMultiplier: 3.5,
    difficulty: 'Legend',
    penalty: 20,
    timePerWord: 4,
    color: 'from-amber-100 to-yellow-50',
    icon: '👑',
    theme: 'golden',
    bonusMultiplier: 2.5,
    powerUps: 4
  },
];

// Expanded Christmas words database
const CHRISTMAS_WORDS = [
  // Level 1 - Basic (3-5 letters)
  { word: 'SNOW', hint: 'White flakes from the sky', category: 'Weather', difficulty: 1, points: 100 },
  { word: 'GIFT', hint: 'Something given during holidays', category: 'Tradition', difficulty: 1, points: 100 },
  { word: 'TREE', hint: 'Decorated with lights and ornaments', category: 'Decoration', difficulty: 1, points: 100 },
  { word: 'STAR', hint: 'Shines on top of the tree', category: 'Decoration', difficulty: 1, points: 100 },
  { word: 'BELL', hint: 'Makes a jingling sound', category: 'Sound', difficulty: 1, points: 100 },
  { word: 'ELF', hint: 'Santa\'s helper', category: 'Character', difficulty: 1, points: 100 },
  { word: 'JOY', hint: 'Feeling of happiness', category: 'Emotion', difficulty: 1, points: 100 },
  { word: 'NOEL', hint: 'French word for Christmas', category: 'Language', difficulty: 1, points: 120 },
  { word: 'HAT', hint: 'Santa wears a red one', category: 'Clothing', difficulty: 1, points: 100 },
  { word: 'TOY', hint: 'Children receive these as gifts', category: 'Gifts', difficulty: 1, points: 100 },
  
  // Level 2 - Intermediate (5-7 letters)
  { word: 'SANTA', hint: 'Man in red suit with gifts', category: 'Character', difficulty: 2, points: 150 },
  { word: 'ANGEL', hint: 'Heavenly being with wings', category: 'Character', difficulty: 2, points: 150 },
  { word: 'CANDY', hint: 'Sweet treat on a cane', category: 'Food', difficulty: 2, points: 150 },
  { word: 'HOLLY', hint: 'Plant with red berries', category: 'Plant', difficulty: 2, points: 150 },
  { word: 'MERRY', hint: 'Another word for happy', category: 'Emotion', difficulty: 2, points: 150 },
  { word: 'PEACE', hint: 'Opposite of war', category: 'Concept', difficulty: 2, points: 160 },
  { word: 'WREATH', hint: 'Circular decoration on doors', category: 'Decoration', difficulty: 2, points: 160 },
  { word: 'SLEIGH', hint: 'Santa\'s vehicle', category: 'Transport', difficulty: 2, points: 160 },
  { word: 'CAROL', hint: 'Christmas song', category: 'Music', difficulty: 2, points: 150 },
  { word: 'LIGHTS', hint: 'Twinkling decorations', category: 'Decoration', difficulty: 2, points: 150 },
  
  // Level 3 - Advanced (7-9 letters)
  { word: 'REINDEER', hint: 'Animal that pulls Santa\'s sleigh', category: 'Animal', difficulty: 3, points: 200 },
  { word: 'SNOWMAN', hint: 'Made of three snowballs', category: 'Character', difficulty: 3, points: 200 },
  { word: 'COOKIE', hint: 'Santa\'s favorite snack', category: 'Food', difficulty: 3, points: 200 },
  { word: 'FAMILY', hint: 'People you celebrate with', category: 'People', difficulty: 3, points: 200 },
  { word: 'PRESENT', hint: 'Another word for gift', category: 'Tradition', difficulty: 3, points: 200 },
  { word: 'MISTLETOE', hint: 'Hang it for kisses', category: 'Plant', difficulty: 3, points: 250 },
  { word: 'FESTIVE', hint: 'Merry and celebratory', category: 'Emotion', difficulty: 3, points: 200 },
  { word: 'CHIMNEY', hint: 'Santa enters through it', category: 'Building', difficulty: 3, points: 220 },
  { word: 'WORKSHOP', hint: 'Where elves make toys', category: 'Place', difficulty: 3, points: 220 },
  { word: 'DECEMBER', hint: 'Christmas month', category: 'Time', difficulty: 3, points: 200 },
  
  // Level 4 - Expert (8-12 letters)
  { word: 'CHRISTMAS', hint: 'December 25th holiday', category: 'Holiday', difficulty: 4, points: 300 },
  { word: 'DECORATION', hint: 'Ornaments and lights', category: 'Decoration', difficulty: 4, points: 300 },
  { word: 'FESTIVITY', hint: 'Celebration and joy', category: 'Event', difficulty: 4, points: 320 },
  { word: 'GARLAND', hint: 'Decorative chain of leaves', category: 'Decoration', difficulty: 4, points: 280 },
  { word: 'EGGNOG', hint: 'Traditional Christmas drink', category: 'Food', difficulty: 4, points: 280 },
  { word: 'NUTCRACKER', hint: 'Ballet and decorative figure', category: 'Tradition', difficulty: 4, points: 350 },
  { word: 'STOCKING', hint: 'Hung by the fireplace', category: 'Tradition', difficulty: 4, points: 280 },
  { word: 'CELEBRATE', hint: 'To have a party', category: 'Event', difficulty: 4, points: 300 },
  { word: 'ADVENT', hint: 'Countdown to Christmas', category: 'Tradition', difficulty: 4, points: 250 },
  { word: 'YULETIDE', hint: 'Old word for Christmas season', category: 'Season', difficulty: 4, points: 350 },
  
  // Level 5 - Master (10+ letters)
  { word: 'FIGGY PUDDING', hint: 'Traditional Christmas dessert', category: 'Food', difficulty: 5, points: 400 },
  { word: 'NORTH POLE', hint: 'Santa\'s home', category: 'Location', difficulty: 5, points: 400 },
  { word: 'KRISS KRINGLE', hint: 'Another name for Santa', category: 'Character', difficulty: 5, points: 450 },
  { word: 'POINSETTIA', hint: 'Christmas flower with red leaves', category: 'Plant', difficulty: 5, points: 400 },
  { word: 'CELEBRATION', hint: 'Party and festivities', category: 'Event', difficulty: 5, points: 400 },
  { word: 'CHRISTMAS EVE', hint: 'Night before Christmas', category: 'Holiday', difficulty: 5, points: 450 },
  { word: 'CHRISTMAS TREE', hint: 'Decorated evergreen tree', category: 'Decoration', difficulty: 5, points: 450 },
  { word: 'FATHER CHRISTMAS', hint: 'British name for Santa', category: 'Character', difficulty: 5, points: 500 },
  { word: 'CHRISTMAS CAROL', hint: 'Traditional Christmas song', category: 'Music', difficulty: 5, points: 450 },
  { word: 'CHRISTMAS DAY', hint: 'December 25th', category: 'Holiday', difficulty: 5, points: 400 },
  
  // Level 6 - Legend (Complex phrases)
  { word: 'TWELVE DAYS OF CHRISTMAS', hint: 'Traditional Christmas carol', category: 'Music', difficulty: 6, points: 600 },
  { word: 'CHRISTMAS PUDDING', hint: 'Traditional British dessert', category: 'Food', difficulty: 6, points: 550 },
  { word: 'CHRISTMAS STOCKING', hint: 'Sock hung for gifts', category: 'Tradition', difficulty: 6, points: 550 },
  { word: 'CHRISTMAS LIGHTS', hint: 'Decorative illumination', category: 'Decoration', difficulty: 6, points: 500 },
  { word: 'CHRISTMAS CAROLS', hint: 'Seasonal songs', category: 'Music', difficulty: 6, points: 500 },
  { word: 'CHRISTMAS ORNAMENT', hint: 'Tree decoration', category: 'Decoration', difficulty: 6, points: 550 },
  { word: 'CHRISTMAS PRESENT', hint: 'Gift given on Christmas', category: 'Tradition', difficulty: 6, points: 500 },
  { word: 'CHRISTMAS DECORATIONS', hint: 'Festive ornaments', category: 'Decoration', difficulty: 6, points: 600 },
  { word: 'CHRISTMAS CELEBRATION', hint: 'Festive party', category: 'Event', difficulty: 6, points: 600 },
  { word: 'MERRY CHRISTMAS', hint: 'Traditional greeting', category: 'Greeting', difficulty: 6, points: 500 },
];

// Game modes
const GAME_MODES = [
  { id: 'classic', name: 'Classic', description: 'Standard word challenge', icon: '🎄', timeMultiplier: 1 },
  { id: 'time-attack', name: 'Time Attack', description: 'Race against the clock', icon: '⏱️', timeMultiplier: 0.7 },
  { id: 'zen', name: 'Zen Mode', description: 'Relaxed, no time limit', icon: '🧘', timeMultiplier: 0 },
  { id: 'hardcore', name: 'Hardcore', description: 'No hints, high stakes', icon: '💀', timeMultiplier: 1.3 },
  { id: 'multiplayer', name: 'Multiplayer', description: 'Play with friends', icon: '👥', timeMultiplier: 1 },
];

// Power-ups
const POWER_UPS = [
  { id: 'time-plus', name: 'Time Freeze', description: 'Adds 15 seconds', icon: '⏰', cost: 50, effect: 'addTime' },
  { id: 'hint-bonus', name: 'Smart Hint', description: 'Reveals a strategic letter', icon: '💡', cost: 75, effect: 'smartHint' },
  { id: 'streak-shield', name: 'Streak Shield', description: 'Protects your streak once', icon: '🛡️', cost: 100, effect: 'protectStreak' },
  { id: 'double-points', name: 'Double Points', description: '2x points for next word', icon: '2️⃣', cost: 150, effect: 'doublePoints' },
  { id: 'skip-word', name: 'Word Skip', description: 'Skip current word', icon: '⏭️', cost: 200, effect: 'skipWord' },
];

type GameState = 'idle' | 'playing' | 'correct' | 'incorrect' | 'timeout' | 'levelComplete' | 'gameComplete' | 'levelTransition' | 'paused' | 'shop';
type LetterState = 'hidden' | 'revealed' | 'correct' | 'incorrect' | 'bonus';
type GameMode = 'classic' | 'time-attack' | 'zen' | 'hardcore' | 'multiplayer';

interface GameWord {
  original: string;
  display: string;
  missingIndices: number[];
  hint: string;
  category: string;
  currentInput: string[];
  letterStates: LetterState[];
  solved: boolean;
  difficulty: number;
  points: number;
  timeSpent: number;
}

interface PlayerStats {
  totalGames: number;
  totalScore: number;
  highestScore: number;
  longestStreak: number;
  levelsCompleted: number;
  perfectGames: number;
  totalPlayTime: number;
  favoriteCategory: string;
}

// Simple UI Components (since we don't have the actual UI components)
const Progress = ({ value = 0, className }: { value?: number; className?: string }) => (
  <div className={cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700", className)}>
    <div className="h-full w-full flex-1 bg-blue-600 transition-all" style={{ transform: `translateX(-${100 - value}%)` }} />
  </div>
);

const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode; variant?: string; className?: string }) => {
  const variantClasses = variant === 'outline' 
    ? "border border-gray-300 dark:border-gray-600 bg-transparent" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors", variantClasses, className)}>
      {children}
    </span>
  );
};

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm", className)}>
    {children}
  </div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-6", className)}>{children}</div>
);

const Tabs = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("", className)}>{children}</div>
);

const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1", className)}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, onClick, className }: { children: React.ReactNode; value: string; onClick: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all",
      "data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50",
      className
    )}
  >
    {children}
  </button>
);

const TabsContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mt-2", className)}>{children}</div>
);

const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
      checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
    )}
  >
    <span className={cn(
      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
      checked ? "translate-x-6" : "translate-x-1"
    )} />
  </button>
);

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const TooltipContent = ({ children }: { children: React.ReactNode }) => <div className="hidden">{children}</div>;

export default function WordChallengePremiumPage() {
  // Core game state
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(1000);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVEL_CONFIG[0].time);
  const [currentWords, setCurrentWords] = useState<GameWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | 'bonus'; message: string } | null>(null);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [levelCompleteScore, setLevelCompleteScore] = useState(0);
  const [levelCompleteTimeBonus, setLevelCompleteTimeBonus] = useState(0);
  const [wordsSolved, setWordsSolved] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  // Enhanced features
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<'normal' | 'hard' | 'expert'>('normal');
  const [powerUps, setPowerUps] = useState<string[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalGames: 0,
    totalScore: 0,
    highestScore: 0,
    longestStreak: 0,
    levelsCompleted: 0,
    perfectGames: 0,
    totalPlayTime: 0,
    favoriteCategory: 'Decoration'
  });
  
  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  
  // Multiplayer
  const [multiplayerRoom, setMultiplayerRoom] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const gameStartTimeRef = useRef<number>(0);
  

  useEffect(() => {
    // Load saved stats
    const savedStats = localStorage.getItem('christmas-word-stats');
    if (savedStats) {
      try {
        setPlayerStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
    

    return () => {
      // Cleanup
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Generate missing letters for a word
  const generateMissingLetters = useCallback((word: string, count: number): number[] => {
    const validIndices = Array.from(word)
      .map((char, idx) => (char !== ' ' && char !== '-') ? idx : -1)
      .filter(idx => idx !== -1);
    
    if (validIndices.length <= count) return validIndices;
    
    const indices: number[] = [];
    const vowels = 'AEIOU';
    const wordArray = Array.from(word);
    
    // Strategy: prioritize consonants for harder challenge
    const consonants = validIndices.filter(idx => !vowels.includes(wordArray[idx].toUpperCase()));
    const vowelIndices = validIndices.filter(idx => vowels.includes(wordArray[idx].toUpperCase()));
    
    // Add consonants first
    while (indices.length < count && consonants.length > 0) {
      const randomIdx = Math.floor(Math.random() * consonants.length);
      indices.push(consonants.splice(randomIdx, 1)[0]);
    }
    
    // Fill remaining with vowels if needed
    while (indices.length < count && vowelIndices.length > 0) {
      const randomIdx = Math.floor(Math.random() * vowelIndices.length);
      indices.push(vowelIndices.splice(randomIdx, 1)[0]);
    }
    
    return indices.sort((a, b) => a - b);
  }, []);

  // Enhanced word generation
  const generateLevelWords = useCallback((levelIndex: number, mode: GameMode = 'classic'): GameWord[] => {
    const config = LEVEL_CONFIG[levelIndex];
    
    // Get words for current difficulty
    const baseWords = CHRISTMAS_WORDS.filter(word => word.difficulty === levelIndex + 1);
    
    // Add some challenge words (30% from next level)
    const challengeWords = CHRISTMAS_WORDS
      .filter(word => word.difficulty === levelIndex + 2)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(config.wordsPerLevel * 0.3));
    
    const allWords = [...baseWords, ...challengeWords].sort(() => Math.random() - 0.5);
    const selected = allWords.slice(0, config.wordsPerLevel);
    
    return selected.map(wordData => {
      // Dynamic missing letters based on difficulty
      let missingCount = config.missingLetters;
      if (difficulty === 'hard') missingCount += 1;
      if (difficulty === 'expert') missingCount += 2;
      
      // Don't hide too many letters
      const maxHidden = Math.min(missingCount, wordData.word.replace(/[ -]/g, '').length - 1);
      const missingIndices = generateMissingLetters(wordData.word, maxHidden);
      
      const displayArray = Array.from(wordData.word);
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
        solved: false,
        difficulty: wordData.difficulty,
        points: wordData.points,
        timeSpent: 0
      };
    });
  }, [difficulty, generateMissingLetters]);

  // Update player stats
  const updateStats = useCallback(() => {
    const playTime = gameStartTimeRef.current ? Math.floor((Date.now() - gameStartTimeRef.current) / 1000) : 0;
    
    setPlayerStats(prev => {
      const newStats = {
        ...prev,
        totalGames: prev.totalGames + 1,
        totalScore: prev.totalScore + score,
        highestScore: Math.max(prev.highestScore, score),
        longestStreak: Math.max(prev.longestStreak, maxStreak),
        levelsCompleted: prev.levelsCompleted + level,
        totalPlayTime: prev.totalPlayTime + playTime
      };
      
      // Save to localStorage
      try {
        localStorage.setItem('christmas-word-stats', JSON.stringify(newStats));
      } catch (error) {
        console.error('Error saving stats:', error);
      }
      
      return newStats;
    });
  }, [score, maxStreak, level]);

  // Enhanced game start
  const startGame = useCallback(() => {
    gameStartTimeRef.current = Date.now();
    setGameState('playing');
    setLevel(0);
    setScore(0);
    setCoins(prev => Math.max(prev - 10, 0));
    setHintsUsed(0);
    setStreak(0);
    setMaxStreak(0);
    setShowConfetti(false);
    setWordsSolved(0);
    setMultiplier(1);
    setActivePowerUps([]);
    
    const words = generateLevelWords(0, gameMode);
    setCurrentWords(words);
    setCurrentWordIndex(0);
    setShowHint(false);
    
    // Adjust time based on mode and difficulty
    let baseTime = LEVEL_CONFIG[0].time;
    if (gameMode === 'time-attack') baseTime *= 0.7;
    if (gameMode === 'zen') baseTime = 9999;
    if (difficulty === 'hard') baseTime *= 0.9;
    if (difficulty === 'expert') baseTime *= 0.8;
    
    setTimeLeft(Math.floor(baseTime));
    
    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameMode !== 'zen') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('timeout');
            updateStats();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Auto-focus
    if (autoFocus) {
      setTimeout(() => {
        const firstMissing = words[0]?.missingIndices[0];
        if (firstMissing !== undefined && inputRefs.current[firstMissing]) {
          inputRefs.current[firstMissing]?.focus();
        }
      }, 300);
    }
    
   
  }, [gameMode, difficulty, generateLevelWords, autoFocus, updateStats]);

  // ============ GAME FUNCTIONS ============

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

  const completeLevel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const solvedWords = currentWords.filter(w => w.solved).length;
    const timeBonus = Math.floor(timeLeft * LEVEL_CONFIG[level].scoreMultiplier * 15);
    const completionBonus = Math.floor((solvedWords / currentWords.length) * 1500 * LEVEL_CONFIG[level].scoreMultiplier);
    const perfectBonus = solvedWords === currentWords.length ? 1000 : 0;
    
    setLevelCompleteScore(score);
    setLevelCompleteTimeBonus(timeBonus);
    setWordsSolved(solvedWords);
    
    // Add bonuses
    const newScore = score + timeBonus + completionBonus + perfectBonus;
    const earnedCoins = Math.floor((timeBonus + completionBonus + perfectBonus) / 20);
    
    setScore(newScore);
    setCoins(prev => prev + earnedCoins);
    
    // Check for perfect level
    if (solvedWords === currentWords.length) {
      setPlayerStats(prev => ({
        ...prev,
        perfectGames: prev.perfectGames + 1
      }));
    }
    
    // Show level complete screen
    setGameState('levelComplete');
  
    
    // Grant power-ups for next level
    const newPowerUps = POWER_UPS
      .sort(() => Math.random() - 0.5)
      .slice(0, LEVEL_CONFIG[level].powerUps)
      .map(p => p.id);
    
    setPowerUps(newPowerUps);
  }, [currentWords, level, score, timeLeft]);

  const checkWord = useCallback(() => {
    const currentWord = currentWords[currentWordIndex];
    const userInput = currentWord.currentInput.join('');
    const isCorrect = userInput === currentWord.original;
    
    // Calculate time spent on this word
    const wordTimeSpent = Math.floor((Date.now() - gameStartTimeRef.current) / 1000) - currentWord.timeSpent;
    
    // Update word with time spent
    const updatedWords = [...currentWords];
    updatedWords[currentWordIndex] = {
      ...currentWord,
      timeSpent: wordTimeSpent
    };
    setCurrentWords(updatedWords);
    
    if (isCorrect) {
      // Correct answer
      setGameState('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      
      // Enhanced scoring
      let baseScore = currentWord.points * (level + 1);
      let streakBonus = Math.pow(2, Math.min(newStreak, 6)) * 25;
      let timeBonus = Math.max(30 - wordTimeSpent, 0) * 10;
      let difficultyBonus = difficulty === 'hard' ? 1.5 : difficulty === 'expert' ? 2 : 1;
      
      // Apply multipliers
      if (activePowerUps.includes('double-points')) {
        baseScore *= 2;
        setActivePowerUps(prev => prev.filter(p => p !== 'double-points'));
      }
      
      const wordScore = Math.floor(
        (baseScore + streakBonus + timeBonus) * 
        LEVEL_CONFIG[level].scoreMultiplier * 
        difficultyBonus * 
        multiplier
      );
      
      // Bonus coins
      const earnedCoins = Math.floor(wordScore / 10);
      setCoins(prev => prev + earnedCoins);
      
      setScore(prev => prev + wordScore);
      setFeedback({ 
        type: 'correct', 
        message: `Excellent! +${wordScore} points • +${earnedCoins} coins` 
      });
      
    
      // Mark word as solved
      const solvedWords = [...currentWords];
      solvedWords[currentWordIndex].solved = true;
      solvedWords[currentWordIndex].letterStates = solvedWords[currentWordIndex].letterStates.map(
        (state, idx) => state === 'hidden' ? 'correct' : state
      );
      setCurrentWords(solvedWords);
      
      // Move to next word
      setTimeout(() => {
        if (currentWordIndex < currentWords.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setGameState('playing');
          setFeedback(null);
          
          // Auto-focus next word
          if (autoFocus) {
            setTimeout(() => {
              const nextWord = currentWords[currentWordIndex + 1];
              const firstMissing = nextWord.missingIndices[0];
              if (firstMissing !== undefined && inputRefs.current[firstMissing]) {
                inputRefs.current[firstMissing]?.focus();
              }
            }, 100);
          }
        } else {
          // Level complete
          completeLevel();
        }
      }, 1500);
    } else {
      // Incorrect answer
      setGameState('incorrect');
      
      // Apply penalties
      const timePenalty = LEVEL_CONFIG[level].penalty;
      if (gameMode !== 'zen') {
        setTimeLeft(prev => Math.max(prev - timePenalty, 0));
      }
      
      // Check for streak protection
      if (activePowerUps.includes('streak-shield')) {
        setActivePowerUps(prev => prev.filter(p => p !== 'streak-shield'));
        setFeedback({ 
          type: 'bonus', 
          message: `Streak protected by shield! -${timePenalty}s only` 
        });
      } else {
        setStreak(0);
        setFeedback({ 
          type: 'incorrect', 
          message: `Not quite! -${timePenalty}s penalty` 
        });
      }
      
      // Highlight incorrect letters
      const updatedWords = [...currentWords];
      const currentWordCopy = { ...updatedWords[currentWordIndex] };
      
      currentWord.missingIndices.forEach(idx => {
        const userChar = currentWordCopy.currentInput[idx];
        const correctChar = currentWord.original[idx];
        if (userChar && userChar !== correctChar) {
          currentWordCopy.letterStates[idx] = 'incorrect';
        }
      });
      
      updatedWords[currentWordIndex] = currentWordCopy;
      setCurrentWords(updatedWords);
      
     
      
      setTimeout(() => {
        setGameState('playing');
        setFeedback(null);
      }, 2000);
    }
  }, [currentWords, currentWordIndex, streak, maxStreak, level, difficulty, activePowerUps, multiplier, gameMode, autoFocus, completeLevel]);

  const continueToNextLevel = () => {
    // Check if this is the last level
    if (level >= LEVEL_CONFIG.length - 1) {
      setShowConfetti(true);
      setGameState('gameComplete');
      updateStats();
      return;
    }
    
    // Move to transition screen
    setGameState('levelTransition');
  };

  const nextLevel = () => {
    const nextLevelIndex = level + 1;
    
    if (nextLevelIndex >= LEVEL_CONFIG.length) {
      // Game complete
      setShowConfetti(true);
      setGameState('gameComplete');
      updateStats();
      return;
    }
    
    // Start next level
    setLevel(nextLevelIndex);
    setStreak(0);
    setShowHint(false);
    setMultiplier(1);
    
    const words = generateLevelWords(nextLevelIndex, gameMode);
    setCurrentWords(words);
    setCurrentWordIndex(0);
    
    // Adjust time based on mode and difficulty
    let baseTime = LEVEL_CONFIG[nextLevelIndex].time;
    if (gameMode === 'time-attack') baseTime *= 0.7;
    if (gameMode === 'zen') baseTime = 9999;
    if (difficulty === 'hard') baseTime *= 0.9;
    if (difficulty === 'expert') baseTime *= 0.8;
    
    setTimeLeft(Math.floor(baseTime));
    setGameState('playing');
    
    // Start timer for new level
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameMode !== 'zen') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('timeout');
            updateStats();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Focus first input with delay
    if (autoFocus) {
      setTimeout(() => {
        if (words[0]?.missingIndices[0] !== undefined) {
          const firstIndex = words[0].missingIndices[0];
          if (inputRefs.current[firstIndex]) {
            inputRefs.current[firstIndex]?.focus();
          }
        }
      }, 300);
    }
   
  };

  const restartGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startGame();
  };

  const activatePowerUp = useCallback((powerUpId: string) => {
    const powerUp = POWER_UPS.find(p => p.id === powerUpId);
    if (!powerUp || coins < powerUp.cost) return;
    
    setCoins(prev => prev - powerUp.cost);
    setActivePowerUps(prev => [...prev, powerUpId]);
    
    switch (powerUp.effect) {
      case 'addTime':
        setTimeLeft(prev => prev + 15);
        setFeedback({ type: 'bonus', message: '+15 seconds added!' });
        break;
      case 'smartHint':
        const currentWord = currentWords[currentWordIndex];
        const unsolved = currentWord.missingIndices.filter(idx => !currentWord.currentInput[idx]);
        if (unsolved.length > 0) {
          const idx = unsolved[Math.floor(Math.random() * unsolved.length)];
          const updatedWords = [...currentWords];
          updatedWords[currentWordIndex].currentInput[idx] = currentWord.original[idx];
          updatedWords[currentWordIndex].letterStates[idx] = 'bonus';
          setCurrentWords(updatedWords);
          setFeedback({ type: 'bonus', message: 'Smart hint revealed a letter!' });
        }
        break;
      case 'doublePoints':
        setMultiplier(2);
        setFeedback({ type: 'bonus', message: '2x points activated for next word!' });
        break;
    }
    
  
  }, [coins, currentWords, currentWordIndex]);

  // Render level transition screen
  const renderLevelTransition = () => {
    if (gameState !== 'levelTransition') return null;
    
    const nextLevelConfig = LEVEL_CONFIG[level + 1];
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-xl animate-in zoom-in duration-500">
          <div className="inline-block p-4 bg-white dark:bg-gray-700 rounded-full mb-4">
            <Zap className="w-16 h-16 text-yellow-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">🎯 Level Up!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Get ready for the next challenge!</p>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Score</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Bonus</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+{levelCompleteTimeBonus}</div>
              </div>
            </div>
            
            <div className={`bg-gradient-to-r ${nextLevelConfig.color} rounded-lg p-4 border-2 border-yellow-200 dark:border-yellow-700`}>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                <span className="text-2xl">{nextLevelConfig.icon}</span>
                <span>Level {nextLevelConfig.level}: {nextLevelConfig.difficulty}</span>
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>Words:</span>
                  </span>
                  <span className="font-semibold">{nextLevelConfig.wordsPerLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>Missing Letters:</span>
                  </span>
                  <span className="font-semibold">{nextLevelConfig.missingLetters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Time Limit:</span>
                  </span>
                  <span className="font-semibold">{nextLevelConfig.time}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Penalty per Error:</span>
                  </span>
                  <span className="font-semibold text-red-500 dark:text-red-400">-{nextLevelConfig.penalty}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Score Multiplier:</span>
                  </span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">{nextLevelConfig.scoreMultiplier}x</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            size="lg"
            onClick={nextLevel}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white animate-pulse"
          >
            Start Level {level + 2}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderPowerUpBar = () => (
    <div className="container mx-auto px-4 mb-6">
      <div className="bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Power-ups
          </h3>
          <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
            {activePowerUps.length} Active
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {POWER_UPS.map(powerUp => (
            <TooltipProvider key={powerUp.id}>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={() => activatePowerUp(powerUp.id)}
                    disabled={coins < powerUp.cost || gameState !== 'playing'}
                    className={cn(
                      "group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700",
                      "border-2 rounded-xl p-3 transition-all duration-300",
                      "hover:scale-105 hover:shadow-lg",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      activePowerUps.includes(powerUp.id) 
                        ? "border-yellow-500 shadow-lg shadow-yellow-500/20" 
                        : "border-gray-200 dark:border-gray-600"
                    )}
                  >
                    <div className="text-2xl mb-2">{powerUp.icon}</div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {powerUp.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      🪙 {powerUp.cost}
                    </div>
                    {activePowerUps.includes(powerUp.id) && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{powerUp.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{powerUp.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStatsDashboard = () => (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          Player Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Games</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {playerStats.totalGames}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Highest Score</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {playerStats.highestScore}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {playerStats.longestStreak} 🔥
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Perfect Games</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {playerStats.perfectGames} ⭐
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderGameModeSelector = () => (
    <div className="max-w-4xl mx-auto mb-8">
      <Tabs>
        <TabsList className="grid grid-cols-5 mb-6 bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-sm">
          {GAME_MODES.map(mode => (
            <TabsTrigger 
              key={mode.id} 
              value={mode.id}
              onClick={() => setGameMode(mode.id as GameMode)}
              className={cn(
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-green-500",
                gameMode === mode.id ? "bg-gradient-to-r from-red-500 to-green-500 text-white" : ""
              )}
            >
              <span className="mr-2">{mode.icon}</span>
              {mode.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent>
          <Card className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-5xl mb-4">
                {GAME_MODES.find(m => m.id === gameMode)?.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {GAME_MODES.find(m => m.id === gameMode)?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {GAME_MODES.find(m => m.id === gameMode)?.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1"
                  >
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-focus:</label>
                  <Switch checked={autoFocus} onCheckedChange={setAutoFocus} />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Animations:</label>
                  <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={startGame}
                className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Gamepad2 className="w-6 h-6 mr-2" />
                Start {gameMode === 'multiplayer' ? 'Multiplayer Game' : 'Game'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Main render
  return (
    <div className={cn(
      "min-h-screen overflow-x-hidden transition-colors duration-300",
      darkMode 
        ? "bg-gradient-to-b from-gray-900 to-gray-950 text-white" 
        : "bg-gradient-to-b from-blue-50 via-red-50 to-green-50"
    )}>
      <Snowfall />
      {showConfetti && (
        <Confetti 
          recycle={false} 
          numberOfPieces={300}
          colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']}
          onConfettiComplete={() => setShowConfetti(false)} 
        />
      )}
      
      {renderLevelTransition()}
      
      {/* Game Header */}
      <div className="relative z-10 border-b bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-r from-red-500 to-green-500 rounded-lg group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  Christmas Word Challenge
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Premium Edition
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/30 dark:to-green-900/30">
                <Crown className="w-3 h-3 mr-1 text-yellow-500" />
                Level {level + 1}
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
                <Flame className="w-3 h-3 mr-1 text-orange-500" />
                Streak: {streak}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGameState(gameState === 'paused' ? 'playing' : 'paused')}
                    className="relative"
                  >
                    <Settings className="w-5 h-5" />
                    {gameState === 'paused' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
           
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{darkMode ? 'Light mode' : 'Dark mode'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
                 <div className="flex items-center gap-4">
           
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
          </div>
            
          </div>
        </div>
      </div>
 
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={cn(
            "text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-green-600 to-blue-600 bg-clip-text text-transparent",
            playfair.className
          )}>
            🎅 Christmas Word Challenge 🎄
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            The ultimate Christmas word puzzle experience! Test your vocabulary across multiple game modes, 
            use power-ups, and climb the leaderboards!
          </p>
        </div>
        
        {/* Game Mode Selector */}
        {gameState === 'idle' && (
          <>
            {renderGameModeSelector()}
            {renderStatsDashboard()}
          </>
        )}
        
        {/* Game Stats Bar */}
        {gameState !== 'idle' && gameState !== 'levelComplete' && gameState !== 'gameComplete' && gameState !== 'levelTransition' && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Score</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{score}</div>
              </CardContent>
            </Card>
            
            <Card className={`bg-gradient-to-br ${LEVEL_CONFIG[level].color} dark:from-gray-800/20 dark:to-gray-900/20`}>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Level</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {level + 1} {LEVEL_CONFIG[level].icon}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time</div>
                <div className={cn(
                  "text-2xl font-bold",
                  timeLeft > 30 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400 animate-pulse"
                )}>
                  {gameMode === 'zen' ? '∞' : `${timeLeft}s`}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Streak</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {streak}
                  {streak >= 5 && " 🚀"}
                  {streak >= 10 && " 🔥"}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Multiplier</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {multiplier}x
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Coins</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  🪙 {coins}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Power-up Bar */}
        {gameState === 'playing' && renderPowerUpBar()}
        
        {/* Main Game Area */}
        {gameState === 'playing' && currentWords[currentWordIndex] && (
          <div className="bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                    Word {currentWordIndex + 1}/{currentWords.length}
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
                    <Target className="w-3 h-3 mr-1" />
                    {currentWords[currentWordIndex].category}
                  </Badge>
                </div>
                <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {Math.round((currentWordIndex / currentWords.length) * 100)}% Complete
                </div>
              </div>
              <Progress 
                value={(currentWordIndex / currentWords.length) * 100} 
                className="h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              />
            </div>
            
            {/* Hint & Feedback */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-6 py-3 rounded-full mb-4">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {currentWords[currentWordIndex].hint}
                </p>
              </div>
              
              {feedback && (
                <div className={cn(
                  "animate-bounce text-center mb-6 p-4 rounded-2xl border-2",
                  feedback.type === 'correct' 
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300"
                    : feedback.type === 'bonus'
                    ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-300"
                    : "bg-gradient-to-r from-red-100 to-pink-100 border-red-300 text-red-800 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300"
                )}>
                  <div className="flex items-center justify-center gap-3">
                    {feedback.type === 'correct' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : feedback.type === 'bonus' ? (
                      <Star className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                    <span className="text-xl font-semibold">{feedback.message}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Word Display */}
            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                {Array.from(currentWords[currentWordIndex].original).map((letter, index) => {
                  const isMissing = currentWords[currentWordIndex].missingIndices.includes(index);
                  const isSpace = letter === ' ';
                  const isHyphen = letter === '-';
                  const state = currentWords[currentWordIndex].letterStates[index];
                  
                  if (isSpace) return <div key={index} className="w-8 md:w-10" />;
                  if (isHyphen) {
                    return (
                      <div key={index} className="flex items-center justify-center w-12 h-16">
                        <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">-</span>
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
                          value={currentWords[currentWordIndex].currentInput[index]}
                          onChange={(e) => handleLetterInput(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          disabled={gameState !== 'playing'}
                          className={cn(
                            "w-14 h-16 md:w-16 md:h-20 text-center text-3xl md:text-4xl font-bold rounded-xl border-3",
                            "focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition-all",
                            "shadow-lg hover:shadow-xl",
                            state === 'correct' && "border-green-500 bg-gradient-to-b from-green-100 to-green-50 text-green-700 dark:from-green-900 dark:to-green-800 dark:text-green-300",
                            state === 'incorrect' && "border-red-500 bg-gradient-to-b from-red-100 to-red-50 text-red-700 dark:from-red-900 dark:to-red-800 dark:text-red-300",
                            state === 'bonus' && "border-yellow-500 bg-gradient-to-b from-yellow-100 to-yellow-50 text-yellow-700 dark:from-yellow-900 dark:to-yellow-800 dark:text-yellow-300",
                            state === 'hidden' && "border-blue-300 bg-gradient-to-b from-blue-50 to-white text-blue-800 dark:from-blue-900 dark:to-gray-800 dark:text-blue-300",
                            gameState !== 'playing' && "opacity-75 cursor-not-allowed"
                          )}
                        />
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className="relative">
                      <div className={cn(
                        "w-14 h-16 md:w-16 md:h-20 flex items-center justify-center text-3xl md:text-4xl font-bold rounded-xl",
                        "border-3 border-gray-300 bg-gradient-to-b from-gray-100 to-white text-gray-700",
                        "dark:border-gray-600 dark:from-gray-800 dark:to-gray-900 dark:text-gray-300"
                      )}>
                        {letter}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                {currentWords[currentWordIndex].original.length} letters • 
                {currentWords[currentWordIndex].missingIndices.length} missing • 
                {currentWords[currentWordIndex].points} base points
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={checkWord}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-lg"
                disabled={gameState !== 'playing'}
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Check Answer
              </Button>
              
              <Button
                onClick={useHint}
                variant="outline"
                size="lg"
                className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 px-6 py-6"
                disabled={gameState !== 'playing' || showHint}
              >
                <HelpCircle className="w-6 h-6 mr-2" />
                Use Hint
                <Badge className="ml-2 bg-purple-500">-{LEVEL_CONFIG[level].hintCost}pts</Badge>
              </Button>
              
              <Button
                onClick={() => setGameState('paused')}
                variant="ghost"
                size="lg"
                className="px-6 py-6"
              >
                <Clock className="w-6 h-6 mr-2" />
                Pause
              </Button>
            </div>
          </div>
        )}
        
        {/* Level Complete Screen */}
        {gameState === 'levelComplete' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl animate-in zoom-in duration-500 border border-gray-300 dark:border-gray-600">
              <div className="inline-block p-6 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full mb-6">
                <Trophy className="w-20 h-20 text-yellow-600 dark:text-yellow-400" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                🎉 Level {level + 1} Complete! 🎉
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Words Solved</div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {wordsSolved}/{currentWords.length}
                        {wordsSolved === currentWords.length && " ⭐"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Time Bonus</div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        +{levelCompleteTimeBonus}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      🎁 Rewards Earned
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">🪙</div>
                        <div>
                          <div className="font-semibold">+{Math.floor(levelCompleteTimeBonus / 20)} Coins</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">For time bonus</div>
                        </div>
                      </div>
                      
                      {powerUps.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">⚡</div>
                          <div>
                            <div className="font-semibold">{powerUps.length} Power-ups</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked for next level</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={continueToNextLevel}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
                >
                  {level < LEVEL_CONFIG.length - 1 ? 'Continue to Next Level' : 'View Final Results'}
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={restartGame}
                  className="w-full py-6"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Pause Menu */}
        {gameState === 'paused' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Game Paused</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Sound</span>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Music</span>
                  <Switch checked={musicEnabled} onCheckedChange={setMusicEnabled} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Animations</span>
                  <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>
              
              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => setGameState('playing')}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-6"
                >
                  Resume Game
                </Button>
                
                <Button
                  variant="outline"
                  onClick={restartGame}
                  className="w-full py-6"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Restart Level
                </Button>
                
                <Link href="/">
                  <Button variant="ghost" className="w-full py-6">
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Game Complete Screen */}
        {gameState === 'gameComplete' && (
          <div className="bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20 rounded-2xl p-8 max-w-md mx-auto text-center shadow-xl animate-in zoom-in duration-500">
            <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full mb-4">
              <Trophy className="w-20 h-20 text-yellow-500 dark:text-yellow-400" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">🏆 Challenge Complete! 🏆</h2>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Final Score: {score}</p>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Levels Completed</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{LEVEL_CONFIG.length}</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hints Used</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{hintsUsed}</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Max Streak</div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{maxStreak} 🔥</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {LEVEL_CONFIG.reduce((total, config) => total + config.wordsPerLevel, 0)}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg p-4">
                <div className="text-lg font-bold text-pink-600 dark:text-pink-400">🎅 Master of Christmas Words! 🎅</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 max-w-md mx-auto text-center shadow-xl">
            <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full mb-4">
              <Clock className="w-16 h-16 text-red-500 dark:text-red-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">⏰ Time&apos;s Up!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You completed {currentWords.filter(w => w.solved).length} out of {currentWords.length} words in Level {level + 1}.
            </p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400 mb-6">Score: {score}</p>
            
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
      </main>

      {/* Footer Instructions */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🎯 Tips & Strategies:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Use category and hint clues wisely</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Think about common Christmas phrases</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Save hints for really tough words</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Watch the timer - wrong answers cost time!</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Build streaks for exponential bonuses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Complete all 6 levels for maximum score</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">🎄 Christmas Word Categories:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from(new Set(CHRISTMAS_WORDS.map(w => w.category))).map(category => (
                <span key={category} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300">
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