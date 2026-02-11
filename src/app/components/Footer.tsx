import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Instagram } from 'lucide-react';
import logoDark from '@/assets/logo-dark.jpg';

export default function Footer() {
  return (
    <footer
      className="bg-[#0D2137] text-white relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Top red gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E03038]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src={logoDark} alt="Path2Medic" className="h-16 w-auto hover:opacity-80 transition-opacity duration-200" />
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Think Like a Clinician. Pass Like a Pro.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-[#E03038]" />
              <a href="mailto:vincent@path2medic.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                vincent@path2medic.com
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <a href="https://www.tiktok.com/@path2medic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.78a8.18 8.18 0 003.76.91V6.24a4.85 4.85 0 01-1-.24v.69z"/></svg>
              </a>
              <a href="https://www.instagram.com/path2medic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/path2medic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-white/60 mb-4">Study Guides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products/proof-is-in-the-pudding" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">The Proof is in the Pudding</Link></li>
              <li><Link to="/products/spot-it-sort-it-solve-it" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">Spot It, Sort It, Solve It</Link></li>
              <li><Link to="/products/cat-got-your-tongue" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">CAT Got Your Tongue?</Link></li>
              <li><Link to="/products/clinical-judgment-workbook-paramedic" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">CJ & TEI Workbook</Link></li>
              <li><Link to="/products/under-the-hood" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">Under the Hood</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-white/60 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/practice" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">Practice Questions</Link></li>
              <li><Link to="/tutoring" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">1-on-1 Coaching</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">Student Dashboard</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">Login / Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-white/60 mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">Contact</Link></li>
              <li><Link to="/educators" className="text-gray-400 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">For Educators</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Path2Medic. All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-600">Built with evidence-based principles.</p>
        </div>
      </div>
    </footer>
  );
}
