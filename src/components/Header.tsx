import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-neonaccent sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Shield className="w-8 h-8 text-foreground" />
            <span className="font-heading text-xl text-foreground uppercase tracking-wide">
              Cipher Attack Simulator
            </span>
          </Link>
          
          <nav className="flex items-center gap-8">
            <a 
              href="#configure" 
              className="font-paragraph text-base text-foreground hover:underline transition-all"
            >
              Simulation
            </a>
            <a 
              href="#learn" 
              className="font-paragraph text-base text-foreground hover:underline transition-all"
            >
              Learn
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
