// HPI 1.6-V
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Shield, Lock, AlertTriangle, Clock, Hash, CheckCircle, XCircle, Terminal, Cpu, Key, ChevronRight, ArrowDown } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Interfaces ---
type AttackMode = 'dictionary' | 'bruteforce';
type PasswordType = 'plain' | 'hashed';

interface SimulationResult {
  cracked: boolean;
  matchedPassword?: string;
  attempts: number;
  timeElapsed: number;
}

// --- Utility Components ---

// Scroll Reveal Component
const AnimatedElement: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 ${className || ''}`}>
      {children}
    </div>
  );
};

// Marquee Component
const Marquee: React.FC<{ text: string; reverse?: boolean }> = ({ text, reverse = false }) => {
  return (
    <div className="relative flex overflow-hidden bg-neonaccent py-4 border-y border-foreground">
      <div className={`animate-marquee whitespace-nowrap flex gap-8 ${reverse ? 'flex-row-reverse' : ''}`}>
        {Array(10).fill(text).map((t, i) => (
          <span key={i} className="text-foreground font-heading text-xl uppercase tracking-widest font-bold">
            {t} •
          </span>
        ))}
      </div>
      <div className={`absolute top-0 py-4 animate-marquee2 whitespace-nowrap flex gap-8 ${reverse ? 'flex-row-reverse' : ''}`}>
        {Array(10).fill(text).map((t, i) => (
          <span key={i} className="text-foreground font-heading text-xl uppercase tracking-widest font-bold">
            {t} •
          </span>
        ))}
      </div>
      <style>{`
        .animate-marquee { animation: marquee 25s linear infinite; }
        .animate-marquee2 { animation: marquee2 25s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        @keyframes marquee2 { 0% { transform: translateX(100%); } 100% { transform: translateX(0%); } }
      `}</style>
    </div>
  );
};

// --- Main Component ---

export default function HomePage() {
  // --- State Management (Preserved from Original) ---
  const [attackMode, setAttackMode] = useState<AttackMode>('dictionary');
  const [passwordType, setPasswordType] = useState<PasswordType>('plain');
  const [targetPassword, setTargetPassword] = useState('');
  const [wordlist, setWordlist] = useState('');
  const [maxAttempts, setMaxAttempts] = useState('10000');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState(0);

  // --- Logic (Preserved from Original) ---
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const runDictionaryAttack = async (target: string, words: string[], max: number): Promise<SimulationResult> => {
    const startTime = Date.now();
    const isHashed = passwordType === 'hashed';
    
    for (let i = 0; i < Math.min(words.length, max); i++) {
      setCurrentAttempt(i + 1);
      await new Promise(resolve => setTimeout(resolve, 10)); 
      
      const word = words[i].trim();
      const compareValue = isHashed ? simpleHash(word) : word;
      
      if (compareValue === target) {
        return {
          cracked: true,
          matchedPassword: word,
          attempts: i + 1,
          timeElapsed: Date.now() - startTime
        };
      }
    }
    
    return {
      cracked: false,
      attempts: Math.min(words.length, max),
      timeElapsed: Date.now() - startTime
    };
  };

  const runBruteForceAttack = async (target: string, max: number): Promise<SimulationResult> => {
    const startTime = Date.now();
    const isHashed = passwordType === 'hashed';
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let attemptCount = 0;
    
    for (let length = 1; length <= 8; length++) {
      const maxCombinations = Math.pow(charset.length, length);
      const combinations = Math.min(maxCombinations, max - attemptCount);
      
      for (let i = 0; i < combinations; i++) {
        if (attemptCount >= max) break;
        
        attemptCount++;
        setCurrentAttempt(attemptCount);
        
        let attempt = '';
        let num = i;
        for (let j = 0; j < length; j++) {
          attempt += charset[num % charset.length];
          num = Math.floor(num / charset.length);
        }
        
        if (i % 100 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
        
        const compareValue = isHashed ? simpleHash(attempt) : attempt;
        
        if (compareValue === target) {
          return {
            cracked: true,
            matchedPassword: attempt,
            attempts: attemptCount,
            timeElapsed: Date.now() - startTime
          };
        }
      }
      
      if (attemptCount >= max) break;
    }
    
    return {
      cracked: false,
      attempts: attemptCount,
      timeElapsed: Date.now() - startTime
    };
  };

  const startSimulation = async () => {
    if (!targetPassword) {
      alert('Please enter a target password');
      return;
    }

    if (attackMode === 'dictionary' && !wordlist) {
      alert('Please enter a wordlist for dictionary attack');
      return;
    }

    setIsRunning(true);
    setResult(null);
    setCurrentAttempt(0);

    try {
      let simulationResult: SimulationResult;

      if (attackMode === 'dictionary') {
        const words = wordlist.split('\n').filter(w => w.trim());
        simulationResult = await runDictionaryAttack(targetPassword, words, parseInt(maxAttempts));
      } else {
        simulationResult = await runBruteForceAttack(targetPassword, parseInt(maxAttempts));
      }

      setResult(simulationResult);
    } catch (error) {
      console.error('Simulation error:', error);
      alert('An error occurred during simulation');
    } finally {
      setIsRunning(false);
    }
  };

  const resetSimulation = () => {
    setResult(null);
    setCurrentAttempt(0);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-neonaccent selection:text-black overflow-clip">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center pt-20 pb-12 px-6 border-b border-foreground/10">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-[120rem] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <AnimatedElement>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-foreground/20 rounded-full bg-secondary/50 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-neonaccent animate-pulse"></span>
                <span className="text-xs font-heading uppercase tracking-wider">System v2.0 Online</span>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={100}>
              <h1 className="font-heading text-[15vw] lg:text-[12rem] leading-[0.8] tracking-tighter uppercase text-foreground mix-blend-difference">
                Cipher
                <span className="block text-4xl lg:text-6xl tracking-normal font-light mt-4 text-foreground/60">
                  Protocol
                </span>
              </h1>
            </AnimatedElement>

            <AnimatedElement delay={200}>
              <p className="text-xl lg:text-2xl max-w-2xl leading-relaxed border-l-2 border-neonaccent pl-6">
                An advanced educational environment for simulating cryptographic attacks. 
                Understand the mechanics of <span className="font-bold bg-neonaccent/20 px-1">Brute Force</span> and <span className="font-bold bg-neonaccent/20 px-1">Dictionary</span> vectors in real-time.
              </p>
            </AnimatedElement>

            <AnimatedElement delay={300}>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button 
                  onClick={() => document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-foreground text-background hover:bg-neonaccent hover:text-foreground font-heading text-lg uppercase px-8 py-6 rounded-none border-2 border-transparent hover:border-foreground transition-all duration-300"
                >
                  Initialize Simulation
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent text-foreground border-2 border-foreground hover:bg-foreground hover:text-background font-heading text-lg uppercase px-8 py-6 rounded-none transition-all duration-300"
                >
                  Learn Protocols
                </Button>
              </div>
            </AnimatedElement>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[70vh] w-full">
             <AnimatedElement delay={400} className="w-full h-full">
                <div className="relative w-full h-full border border-foreground/10 bg-secondary p-2">
                  <div className="absolute top-4 right-4 z-20 bg-neonaccent px-4 py-1 font-heading text-sm font-bold uppercase tracking-widest">
                    Secure Enclave
                  </div>
                  <Image
                    src="https://static.wixstatic.com/media/cac9fe_5064c9ee89db4865b316fa05636be03f~mv2.png?originWidth=384&originHeight=512"
                    alt="Abstract visualization of digital security lock mechanism"
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                  />
                  {/* Decorative Overlay */}
                  <div className="absolute inset-0 border-[1px] border-foreground/20 m-4 pointer-events-none"></div>
                  <div className="absolute bottom-8 left-8 bg-background/90 backdrop-blur p-4 border border-foreground/10 max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4" />
                      <span className="text-xs font-mono">status: monitoring</span>
                    </div>
                    <div className="h-1 w-full bg-foreground/10 overflow-hidden">
                      <div className="h-full bg-neonaccent w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
             </AnimatedElement>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-foreground/40" />
        </div>
      </section>

      {/* --- MARQUEE WARNING --- */}
      <Marquee text="Educational Purpose Only • Unauthorized Access is Illegal • Secure Your Data •" />

      {/* --- SIMULATION DASHBOARD --- */}
      <section id="simulation" className="relative w-full bg-secondary py-24 px-6">
        <div className="max-w-[120rem] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sticky Config Panel */}
            <div className="lg:w-1/3 relative">
              <div className="sticky top-24 space-y-8">
                <AnimatedElement>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-12 bg-neonaccent"></div>
                    <h2 className="font-heading text-4xl lg:text-5xl uppercase">Config<br/>Matrix</h2>
                  </div>
                </AnimatedElement>

                <AnimatedElement delay={100}>
                  <Card className="p-8 border-2 border-foreground rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-background">
                    <div className="space-y-8">
                      {/* Attack Mode */}
                      <div className="space-y-4">
                        <Label className="font-heading text-lg uppercase flex items-center gap-2">
                          <Cpu className="w-5 h-5" /> Attack Vector
                        </Label>
                        <RadioGroup value={attackMode} onValueChange={(value) => setAttackMode(value as AttackMode)} className="grid grid-cols-1 gap-3">
                          <div className={`flex items-center space-x-3 border p-4 transition-colors ${attackMode === 'dictionary' ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground'}`}>
                            <RadioGroupItem value="dictionary" id="dictionary" className="border-current text-current" />
                            <Label htmlFor="dictionary" className="font-heading uppercase cursor-pointer flex-1">Dictionary</Label>
                          </div>
                          <div className={`flex items-center space-x-3 border p-4 transition-colors ${attackMode === 'bruteforce' ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground'}`}>
                            <RadioGroupItem value="bruteforce" id="bruteforce" className="border-current text-current" />
                            <Label htmlFor="bruteforce" className="font-heading uppercase cursor-pointer flex-1">Brute Force</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Password Type */}
                      <div className="space-y-4">
                        <Label className="font-heading text-lg uppercase flex items-center gap-2">
                          <Key className="w-5 h-5" /> Target Type
                        </Label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setPasswordType('plain')}
                            className={`flex-1 py-2 px-4 font-heading uppercase text-sm border border-foreground transition-all ${passwordType === 'plain' ? 'bg-neonaccent text-foreground font-bold' : 'bg-transparent hover:bg-foreground/5'}`}
                          >
                            Plain Text
                          </button>
                          <button 
                            onClick={() => setPasswordType('hashed')}
                            className={`flex-1 py-2 px-4 font-heading uppercase text-sm border border-foreground transition-all ${passwordType === 'hashed' ? 'bg-neonaccent text-foreground font-bold' : 'bg-transparent hover:bg-foreground/5'}`}
                          >
                            Hashed
                          </button>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-6">
                        <div className="relative group">
                          <Label htmlFor="target" className="font-heading text-sm uppercase mb-2 block text-foreground/70">Target Password</Label>
                          <Input
                            id="target"
                            type="text"
                            value={targetPassword}
                            onChange={(e) => setTargetPassword(e.target.value)}
                            placeholder={passwordType === 'plain' ? 'secret123' : 'hash_value'}
                            className="font-mono text-lg border-x-0 border-t-0 border-b-2 border-foreground rounded-none px-0 focus-visible:ring-0 focus-visible:border-neonaccent bg-transparent"
                            disabled={isRunning}
                          />
                          {passwordType === 'plain' && targetPassword && (
                            <div className="absolute right-0 top-8 text-xs font-mono text-foreground/40">
                              Hash: {simpleHash(targetPassword).substring(0, 8)}...
                            </div>
                          )}
                        </div>

                        {attackMode === 'dictionary' && (
                          <div className="relative">
                            <Label htmlFor="wordlist" className="font-heading text-sm uppercase mb-2 block text-foreground/70">Dictionary Source</Label>
                            <Textarea
                              id="wordlist"
                              value={wordlist}
                              onChange={(e) => setWordlist(e.target.value)}
                              placeholder="admin&#10;password&#10;123456"
                              className="font-mono text-sm border-2 border-foreground/20 rounded-none focus-visible:ring-0 focus-visible:border-foreground min-h-[120px] bg-secondary"
                              disabled={isRunning}
                            />
                            <div className="text-right text-xs font-mono mt-1 text-foreground/50">
                              {wordlist.split('\n').filter(w => w.trim()).length} entries
                            </div>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="maxAttempts" className="font-heading text-sm uppercase mb-2 block text-foreground/70">Max Iterations</Label>
                          <Input
                            id="maxAttempts"
                            type="number"
                            value={maxAttempts}
                            onChange={(e) => setMaxAttempts(e.target.value)}
                            className="font-mono text-lg border-x-0 border-t-0 border-b-2 border-foreground rounded-none px-0 focus-visible:ring-0 focus-visible:border-neonaccent bg-transparent"
                            disabled={isRunning}
                          />
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="pt-4 flex flex-col gap-3">
                        <Button
                          onClick={startSimulation}
                          disabled={isRunning}
                          className="w-full bg-foreground text-background hover:bg-neonaccent hover:text-foreground font-heading text-xl uppercase py-8 rounded-none transition-all duration-300 relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {isRunning ? <Clock className="animate-spin" /> : <Terminal />}
                            {isRunning ? 'Processing...' : 'Execute Attack'}
                          </span>
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Button>
                        
                        {result && (
                          <Button
                            onClick={resetSimulation}
                            variant="ghost"
                            className="w-full font-heading uppercase tracking-widest hover:bg-destructive hover:text-destructiveforeground rounded-none"
                          >
                            Reset Parameters
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </AnimatedElement>
              </div>
            </div>

            {/* Results & Visualization Area */}
            <div className="lg:w-2/3 space-y-8">
              <AnimatedElement delay={200}>
                <div className="flex items-end justify-between border-b border-foreground pb-4">
                  <h3 className="font-heading text-2xl uppercase">Live Terminal</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </AnimatedElement>

              {/* Dynamic Visualization Container */}
              <div className="min-h-[600px] bg-black text-green-500 font-mono p-8 relative overflow-hidden rounded-none border-l-4 border-neonaccent">
                {/* Background Matrix Effect */}
                <div className="absolute inset-0 opacity-20 pointer-events-none select-none overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap animate-marquee" style={{ animationDuration: `${Math.random() * 5 + 2}s`, opacity: Math.random() }}>
                      {Array.from({ length: 10 }).map(() => Math.random().toString(36).substring(2)).join(' ')}
                    </div>
                  ))}
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  {!isRunning && !result && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                      <Shield className="w-24 h-24 mb-6 stroke-1" />
                      <p className="text-xl uppercase tracking-widest">System Idle</p>
                      <p className="text-sm mt-2">Awaiting Configuration Parameters...</p>
                    </div>
                  )}

                  {isRunning && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-full max-w-md space-y-8">
                        <div className="text-center space-y-2">
                          <div className="inline-block p-4 border border-green-500 rounded-full animate-pulse">
                            <Lock className="w-12 h-12" />
                          </div>
                          <h4 className="text-2xl uppercase tracking-widest animate-pulse">Cracking...</h4>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs uppercase">
                            <span>Progress</span>
                            <span>{Math.min((currentAttempt / parseInt(maxAttempts)) * 100, 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-green-900 w-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-neonaccent"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((currentAttempt / parseInt(maxAttempts)) * 100, 100)}%` }}
                              transition={{ type: "tween", ease: "linear" }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="border border-green-900 p-4 bg-green-900/10">
                            <div className="text-xs uppercase text-green-400 mb-1">Attempt #</div>
                            <div className="text-2xl font-bold text-white">{currentAttempt.toLocaleString()}</div>
                          </div>
                          <div className="border border-green-900 p-4 bg-green-900/10">
                            <div className="text-xs uppercase text-green-400 mb-1">Method</div>
                            <div className="text-xl font-bold text-white uppercase">{attackMode}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {result && !isRunning && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                      <div className={`p-8 border-2 ${result.cracked ? 'border-neonaccent bg-neonaccent/10' : 'border-red-500 bg-red-900/10'} mb-8 text-center max-w-lg w-full`}>
                        {result.cracked ? (
                          <>
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-neonaccent" />
                            <h2 className="text-4xl font-heading uppercase text-white mb-2">Access Granted</h2>
                            <p className="text-green-400">Target password successfully identified.</p>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                            <h2 className="text-4xl font-heading uppercase text-white mb-2">Access Denied</h2>
                            <p className="text-red-400">Maximum attempts reached without success.</p>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="bg-white/5 p-4 border border-white/10">
                          <div className="text-xs uppercase text-gray-400 mb-1">Result</div>
                          <div className="text-lg text-white break-all font-bold">
                            {result.matchedPassword || '---'}
                          </div>
                        </div>
                        <div className="bg-white/5 p-4 border border-white/10">
                          <div className="text-xs uppercase text-gray-400 mb-1">Total Attempts</div>
                          <div className="text-lg text-white font-bold">
                            {result.attempts.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white/5 p-4 border border-white/10">
                          <div className="text-xs uppercase text-gray-400 mb-1">Time Elapsed</div>
                          <div className="text-lg text-white font-bold">
                            {(result.timeElapsed / 1000).toFixed(3)}s
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Insight Block */}
              {result && !isRunning && (
                <AnimatedElement>
                  <div className="bg-foreground text-background p-8 flex items-start gap-6">
                    <AlertTriangle className="w-12 h-12 flex-shrink-0 text-neonaccent" />
                    <div>
                      <h4 className="font-heading text-2xl uppercase mb-4 text-neonaccent">Security Analysis</h4>
                      <p className="text-lg leading-relaxed opacity-90">
                        {result.cracked 
                          ? `The password "${result.matchedPassword}" was compromised in ${(result.timeElapsed / 1000).toFixed(2)} seconds. This demonstrates high vulnerability to ${attackMode} attacks. Immediate action: Increase complexity and length.`
                          : `The target withstood ${result.attempts} attempts. While this specific attack failed, remember that modern GPUs can calculate billions of hashes per second. Constant vigilance is required.`
                        }
                      </p>
                    </div>
                  </div>
                </AnimatedElement>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- EDUCATIONAL SECTION --- */}
      <section id="learn" className="w-full bg-background py-32 px-6 border-t border-foreground">
        <div className="max-w-[120rem] mx-auto">
          <AnimatedElement>
            <h2 className="font-heading text-6xl lg:text-8xl uppercase mb-24 text-center">
              Defense <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">Protocols</span>
            </h2>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground border border-foreground">
            {/* Card 1 */}
            <div className="bg-background p-12 group hover:bg-foreground hover:text-background transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="font-heading text-9xl">01</span>
              </div>
              <h3 className="font-heading text-3xl uppercase mb-6 relative z-10">Dictionary<br/>Attacks</h3>
              <p className="text-lg leading-relaxed relative z-10">
                Attackers use massive lists of common passwords (like "123456" or "password"). If your password is a common word or phrase, it can be cracked in milliseconds.
              </p>
              <div className="mt-8 pt-8 border-t border-current opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="font-mono text-sm uppercase">Defense: Avoid dictionary words</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-background p-12 group hover:bg-foreground hover:text-background transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="font-heading text-9xl">02</span>
              </div>
              <h3 className="font-heading text-3xl uppercase mb-6 relative z-10">Brute Force<br/>Mechanics</h3>
              <p className="text-lg leading-relaxed relative z-10">
                The "try every key" approach. It guarantees success eventually, but the time required grows exponentially with password length. Adding one character can change crack time from hours to centuries.
              </p>
              <div className="mt-8 pt-8 border-t border-current opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="font-mono text-sm uppercase">Defense: Length is strength</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-background p-12 group hover:bg-foreground hover:text-background transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="font-heading text-9xl">03</span>
              </div>
              <h3 className="font-heading text-3xl uppercase mb-6 relative z-10">Entropy &<br/>Complexity</h3>
              <p className="text-lg leading-relaxed relative z-10">
                True security comes from unpredictability. Mixing case, numbers, and symbols increases the "search space" an attacker must traverse.
              </p>
              <div className="mt-8 pt-8 border-t border-current opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="font-mono text-sm uppercase">Defense: Use complex patterns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VISUAL BREAK --- */}
      <section className="w-full h-[60vh] relative overflow-hidden">
        <Image
          src="https://static.wixstatic.com/media/cac9fe_c314ba28df6e45dba849eeb83f5458b4~mv2.png?originWidth=1152&originHeight=576"
          alt="Abstract network visualization"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-background max-w-4xl px-6">
            <h2 className="font-heading text-5xl lg:text-7xl uppercase mb-8">Knowledge is the only firewall</h2>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-neonaccent text-foreground hover:bg-white font-heading text-xl uppercase px-12 py-8 rounded-none"
            >
              Restart System
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}