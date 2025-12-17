import { Shield, Github, BookOpen, AlertCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-foreground text-background mt-auto">
      <div className="max-w-[120rem] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-neonaccent" />
              <span className="font-heading text-2xl text-background uppercase">
                Cipher
              </span>
            </div>
            <p className="font-paragraph text-base text-background mb-6 max-w-md">
              An educational cybersecurity tool designed to demonstrate password attack methodologies 
              and promote awareness of strong password practices.
            </p>
            <div className="flex items-center gap-3 bg-neonaccent p-4">
              <AlertCircle className="w-5 h-5 text-foreground flex-shrink-0" />
              <p className="font-paragraph text-sm text-foreground">
                For educational purposes only. Unauthorized system access is illegal.
              </p>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-lg text-background uppercase mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-paragraph text-base text-background hover:text-neonaccent transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="font-paragraph text-base text-background hover:text-neonaccent transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Guide
                </a>
              </li>
              <li>
                <a href="#" className="font-paragraph text-base text-background hover:text-neonaccent transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading text-lg text-background uppercase mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-paragraph text-base text-background hover:text-neonaccent transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="font-paragraph text-base text-background hover:text-neonaccent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="font-paragraph text-base text-background hover:text-neonaccent transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-background">
              © {currentYear} Cipher Attack Simulator. All rights reserved.
            </p>
            <p className="font-paragraph text-sm text-background">
              Built for educational and research purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
