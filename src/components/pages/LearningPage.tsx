import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, BookOpen, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number; // in minutes
  completed: boolean;
}

const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Introduction to Password Security',
    description: 'Learn the fundamentals of password security and why strong passwords matter.',
    content: `
      <h3>Why Password Security Matters</h3>
      <p>Passwords are the first line of defense against unauthorized access. A strong password can prevent 95% of common attacks.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Authentication:</strong> Verifying that someone is who they claim to be</li>
        <li><strong>Authorization:</strong> Determining what authenticated users can access</li>
        <li><strong>Encryption:</strong> Converting readable data into unreadable format</li>
      </ul>
      
      <h3>Password Strength Factors</h3>
      <ul>
        <li>Length: Minimum 12 characters recommended</li>
        <li>Complexity: Mix of uppercase, lowercase, numbers, and symbols</li>
        <li>Uniqueness: Different passwords for different accounts</li>
        <li>Unpredictability: Avoid personal information or common patterns</li>
      </ul>
    `,
    duration: 5,
    completed: false,
  },
  {
    id: 'lesson-2',
    title: 'Understanding Dictionary Attacks',
    description: 'Explore how dictionary attacks work and how to defend against them.',
    content: `
      <h3>What is a Dictionary Attack?</h3>
      <p>A dictionary attack is a method of breaking into a password-protected account by systematically entering every word in a dictionary as a password.</p>
      
      <h3>How Dictionary Attacks Work</h3>
      <ol>
        <li>Attacker obtains or creates a wordlist (dictionary)</li>
        <li>Each word is hashed using the same algorithm as the target system</li>
        <li>Hashes are compared against the target password hash</li>
        <li>If a match is found, the password is cracked</li>
      </ol>
      
      <h3>Defense Strategies</h3>
      <ul>
        <li><strong>Avoid Common Words:</strong> Don't use dictionary words as passwords</li>
        <li><strong>Add Complexity:</strong> Mix numbers and symbols with letters</li>
        <li><strong>Use Passphrases:</strong> Combine multiple random words</li>
        <li><strong>Rate Limiting:</strong> Systems should limit login attempts</li>
      </ul>
    `,
    duration: 7,
    completed: false,
  },
  {
    id: 'lesson-3',
    title: 'Brute Force Attacks Explained',
    description: 'Understand brute force attacks and their computational requirements.',
    content: `
      <h3>What is a Brute Force Attack?</h3>
      <p>A brute force attack systematically tries every possible combination of characters until the correct password is found.</p>
      
      <h3>Computational Complexity</h3>
      <p>The time required to crack a password grows exponentially with each additional character:</p>
      <ul>
        <li>6 characters (lowercase): ~308 million combinations</li>
        <li>8 characters (lowercase): ~200 billion combinations</li>
        <li>12 characters (mixed case + numbers): ~475 quadrillion combinations</li>
      </ul>
      
      <h3>Why Length Matters</h3>
      <p>Each additional character multiplies the number of possible combinations by 62 (26 lowercase + 26 uppercase + 10 digits). This exponential growth makes longer passwords exponentially harder to crack.</p>
      
      <h3>Protection Methods</h3>
      <ul>
        <li><strong>Account Lockout:</strong> Lock accounts after failed attempts</li>
        <li><strong>CAPTCHA:</strong> Require human verification</li>
        <li><strong>Multi-Factor Authentication:</strong> Add additional verification layers</li>
        <li><strong>Strong Passwords:</strong> Make brute force computationally infeasible</li>
      </ul>
    `,
    duration: 8,
    completed: false,
  },
  {
    id: 'lesson-4',
    title: 'Hashing and Encryption Basics',
    description: 'Learn how passwords are securely stored using hashing and encryption.',
    content: `
      <h3>What is Hashing?</h3>
      <p>Hashing is a one-way function that converts input data into a fixed-size string of characters. It's impossible to reverse a hash to get the original password.</p>
      
      <h3>Common Hashing Algorithms</h3>
      <ul>
        <li><strong>MD5:</strong> Outdated, vulnerable to collision attacks</li>
        <li><strong>SHA-1:</strong> Deprecated, no longer considered secure</li>
        <li><strong>SHA-256:</strong> Secure, widely used</li>
        <li><strong>bcrypt:</strong> Specifically designed for passwords, includes salt</li>
        <li><strong>Argon2:</strong> Modern, resistant to GPU attacks</li>
      </ul>
      
      <h3>Salting</h3>
      <p>A salt is random data added to a password before hashing. This prevents attackers from using precomputed hash tables (rainbow tables) to crack passwords.</p>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Always use salted hashes</li>
        <li>Use modern algorithms like bcrypt or Argon2</li>
        <li>Never store passwords in plain text</li>
        <li>Use unique salts for each password</li>
      </ul>
    `,
    duration: 10,
    completed: false,
  },
  {
    id: 'lesson-5',
    title: 'Multi-Factor Authentication',
    description: 'Discover how multi-factor authentication adds layers of security.',
    content: `
      <h3>What is Multi-Factor Authentication (MFA)?</h3>
      <p>MFA requires users to provide multiple forms of verification before gaining access. Even if a password is compromised, the account remains secure.</p>
      
      <h3>Types of Authentication Factors</h3>
      <ul>
        <li><strong>Something You Know:</strong> Password, PIN, security question</li>
        <li><strong>Something You Have:</strong> Phone, security key, hardware token</li>
        <li><strong>Something You Are:</strong> Fingerprint, facial recognition, iris scan</li>
        <li><strong>Somewhere You Are:</strong> Location-based verification</li>
      </ul>
      
      <h3>Common MFA Methods</h3>
      <ul>
        <li><strong>SMS/Text Messages:</strong> Code sent to phone (least secure)</li>
        <li><strong>Email Verification:</strong> Code sent to email address</li>
        <li><strong>Authenticator Apps:</strong> Time-based codes (Google Authenticator, Authy)</li>
        <li><strong>Security Keys:</strong> Physical devices (most secure)</li>
        <li><strong>Biometrics:</strong> Fingerprint or facial recognition</li>
      </ul>
      
      <h3>Implementation Tips</h3>
      <ul>
        <li>Enable MFA on all critical accounts</li>
        <li>Use authenticator apps over SMS when possible</li>
        <li>Keep backup codes in a secure location</li>
        <li>Regularly review connected devices</li>
      </ul>
    `,
    duration: 9,
    completed: false,
  },
  {
    id: 'lesson-6',
    title: 'Best Practices for Password Management',
    description: 'Master the strategies for creating and managing secure passwords.',
    content: `
      <h3>Creating Strong Passwords</h3>
      <ul>
        <li><strong>Length:</strong> Use at least 12-16 characters</li>
        <li><strong>Variety:</strong> Mix uppercase, lowercase, numbers, and symbols</li>
        <li><strong>Randomness:</strong> Avoid patterns, sequences, or personal information</li>
        <li><strong>Uniqueness:</strong> Never reuse passwords across accounts</li>
      </ul>
      
      <h3>Password Manager Benefits</h3>
      <ul>
        <li>Generate strong, random passwords</li>
        <li>Securely store passwords encrypted</li>
        <li>Auto-fill passwords on websites</li>
        <li>Track password strength</li>
        <li>Alert you to compromised passwords</li>
      </ul>
      
      <h3>Recommended Password Managers</h3>
      <ul>
        <li>Bitwarden (open-source, free option available)</li>
        <li>1Password (premium, user-friendly)</li>
        <li>LastPass (popular, feature-rich)</li>
        <li>KeePass (offline, open-source)</li>
      </ul>
      
      <h3>Password Hygiene Rules</h3>
      <ul>
        <li>Never share passwords via email or chat</li>
        <li>Don't write passwords on sticky notes</li>
        <li>Change passwords if you suspect compromise</li>
        <li>Use different passwords for different security levels</li>
        <li>Regularly update passwords for critical accounts</li>
      </ul>
    `,
    duration: 8,
    completed: false,
  },
];

export default function LearningPage() {
  const navigate = useNavigate();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('learningProgress');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const currentLesson = lessons.find(l => l.id === currentLessonId);
  const progressPercentage = (completedLessons.length / lessons.length) * 100;
  const isCompleted = completedLessons.length === lessons.length;

  const handleCompleteLesson = () => {
    if (currentLessonId && !completedLessons.includes(currentLessonId)) {
      const updated = [...completedLessons, currentLessonId];
      setCompletedLessons(updated);
      
      if (updated.length === lessons.length) {
        setShowCertificate(true);
      }
    }
    setCurrentLessonId(null);
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      setCompletedLessons([]);
      setCurrentLessonId(null);
      setShowCertificate(false);
    }
  };

  if (currentLesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 max-w-[100rem] mx-auto w-full px-6 py-12">
          <div className="mb-8">
            <button
              onClick={() => setCurrentLessonId(null)}
              className="font-paragraph text-base text-foreground hover:underline mb-6"
            >
              ← Back to Lessons
            </button>
            
            <h1 className="font-heading text-5xl text-foreground mb-4 uppercase">
              {currentLesson.title}
            </h1>
            <p className="font-paragraph text-lg text-foreground mb-6">
              {currentLesson.description}
            </p>
            <p className="font-paragraph text-sm text-foreground mb-6">
              ⏱️ Estimated reading time: {currentLesson.duration} minutes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card className="p-8 border-2 border-foreground">
                <div 
                  className="font-paragraph text-base text-foreground prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </Card>
            </div>

            <div>
              <Card className="p-8 border-2 border-foreground sticky top-24">
                <h3 className="font-heading text-xl text-foreground mb-6 uppercase">Lesson Progress</h3>
                
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-paragraph text-sm text-foreground">Overall Progress</p>
                    <p className="font-heading text-sm text-foreground">{Math.round(progressPercentage)}%</p>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="mb-8">
                  <p className="font-paragraph text-sm text-foreground mb-4">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>

                <Button
                  onClick={handleCompleteLesson}
                  disabled={completedLessons.includes(currentLesson.id)}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-heading text-base uppercase py-6 mb-4"
                >
                  {completedLessons.includes(currentLesson.id) ? '✓ Completed' : 'Mark as Complete'}
                </Button>

                <div className="space-y-2 pt-6 border-t border-foreground/20">
                  {lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3">
                      {completedLessons.includes(lesson.id) ? (
                        <CheckCircle className="w-5 h-5 text-foreground" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-foreground rounded-full" />
                      )}
                      <span className="font-paragraph text-sm text-foreground">
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-background">
          <div className="max-w-[120rem] mx-auto px-6 py-16">
            <div className="mb-12">
              <h1 className="font-heading text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none tracking-tight text-foreground uppercase">
                LEARN
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <p className="font-paragraph text-base text-foreground">
                  Master cybersecurity fundamentals through our comprehensive learning modules.
                </p>
              </div>
              <div>
                <p className="font-paragraph text-base text-foreground">
                  Progress through lessons, test your knowledge, and earn your certificate upon completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="w-full bg-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <div className="bg-neonaccent p-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-foreground uppercase">Your Progress</h2>
                <span className="font-heading text-3xl text-foreground">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-4 mb-6" />
              <p className="font-paragraph text-base text-foreground">
                {completedLessons.length} of {lessons.length} lessons completed
              </p>
            </div>

            {isCompleted && !showCertificate && (
              <div className="bg-secondary border-4 border-foreground p-8 mb-12 text-center">
                <Award className="w-16 h-16 text-foreground mx-auto mb-4" />
                <h3 className="font-heading text-3xl text-foreground mb-4 uppercase">Congratulations!</h3>
                <p className="font-paragraph text-lg text-foreground mb-6">
                  You've completed all lessons! Click below to view your certificate.
                </p>
                <Button
                  onClick={() => setShowCertificate(true)}
                  className="bg-foreground text-background hover:bg-foreground/90 font-heading text-base uppercase px-8 py-6"
                >
                  View Certificate
                </Button>
              </div>
            )}

            {showCertificate && (
              <div className="mb-12">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="font-paragraph text-base text-foreground hover:underline mb-6"
                >
                  ← Back to Lessons
                </button>
                <CertificateComponent completedLessons={completedLessons.length} />
              </div>
            )}
          </div>
        </section>

        {/* Lessons Grid */}
        {!showCertificate && (
          <section className="w-full bg-background">
            <div className="max-w-[100rem] mx-auto px-6 py-12">
              <h2 className="font-heading text-4xl text-foreground mb-12 uppercase">Available Lessons</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className={`p-8 border-2 cursor-pointer transition-all hover:shadow-lg ${
                      completedLessons.includes(lesson.id)
                        ? 'border-foreground bg-neonaccent'
                        : 'border-foreground'
                    }`}
                    onClick={() => setCurrentLessonId(lesson.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <BookOpen className="w-6 h-6 text-foreground" />
                      {completedLessons.includes(lesson.id) && (
                        <CheckCircle className="w-6 h-6 text-foreground" />
                      )}
                    </div>
                    
                    <h3 className="font-heading text-xl text-foreground mb-3 uppercase">
                      {lesson.title}
                    </h3>
                    
                    <p className="font-paragraph text-base text-foreground mb-4">
                      {lesson.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-foreground/20">
                      <span className="font-paragraph text-sm text-foreground">
                        ⏱️ {lesson.duration} min
                      </span>
                      <span className="font-heading text-sm text-foreground uppercase">
                        {completedLessons.includes(lesson.id) ? 'Done' : 'Start'}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              {completedLessons.length > 0 && (
                <div className="mt-12 text-center">
                  <Button
                    onClick={handleResetProgress}
                    variant="outline"
                    className="font-heading text-base uppercase px-8 py-6"
                  >
                    Reset Progress
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

interface CertificateComponentProps {
  completedLessons: number;
}

function CertificateComponent({ completedLessons }: CertificateComponentProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('certificate');
    if (element) {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 1200, 800);
        
        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, 1120, 720);
        
        // Inner border
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 60, 1080, 680);
        
        // Title
        ctx.font = 'bold 72px barlow-medium';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE OF COMPLETION', 600, 150);
        
        // Subtitle
        ctx.font = '32px barlow-extralight';
        ctx.fillText('Cybersecurity Fundamentals', 600, 220);
        
        // Body text
        ctx.font = '24px barlow-extralight';
        ctx.textAlign = 'center';
        ctx.fillText('This certifies that', 600, 320);
        
        ctx.font = 'bold 48px barlow-medium';
        ctx.fillText('Learner', 600, 400);
        
        ctx.font = '24px barlow-extralight';
        ctx.fillText('has successfully completed all 6 lessons in the', 600, 480);
        ctx.fillText('Cipher Attack Simulator Learning Program', 600, 520);
        
        // Company info
        ctx.font = 'bold 28px barlow-medium';
        ctx.fillText('Shieldgate', 600, 600);
        
        ctx.font = '18px barlow-extralight';
        ctx.fillText('CEO: Nicholas Mwenda', 600, 640);
        
        // Date
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.font = '16px barlow-extralight';
        ctx.fillText(`Date: ${dateStr}`, 600, 720);
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'cipher-certificate.png';
        link.click();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center mb-8">
        <Button
          onClick={handlePrint}
          className="bg-foreground text-background hover:bg-foreground/90 font-heading text-base uppercase px-8 py-6"
        >
          Print Certificate
        </Button>
        <Button
          onClick={handleDownload}
          className="bg-neonaccent text-foreground hover:bg-neonaccent/90 font-heading text-base uppercase px-8 py-6"
        >
          Download Certificate
        </Button>
      </div>

      <div
        id="certificate"
        className="bg-background border-8 border-foreground p-12 max-w-4xl mx-auto aspect-video flex flex-col items-center justify-center text-center print:border-0"
      >
        <h1 className="font-heading text-6xl text-foreground mb-4 uppercase tracking-wide">
          Certificate of Completion
        </h1>
        
        <p className="font-paragraph text-3xl text-foreground mb-8">
          Cybersecurity Fundamentals
        </p>
        
        <div className="my-8">
          <p className="font-paragraph text-xl text-foreground mb-4">
            This certifies that
          </p>
          <p className="font-heading text-4xl text-foreground mb-4 uppercase">
            Learner
          </p>
          <p className="font-paragraph text-lg text-foreground">
            has successfully completed all 6 lessons in the<br />
            Cipher Attack Simulator Learning Program
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/30">
          <p className="font-heading text-2xl text-foreground mb-2 uppercase">
            Shieldgate
          </p>
          <p className="font-paragraph text-lg text-foreground">
            CEO: Nicholas Mwenda
          </p>
          <p className="font-paragraph text-base text-foreground mt-4">
            Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
