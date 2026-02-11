import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Twitter, Linkedin } from 'lucide-react';
import logo from 'figma:asset/7e2353c04204bd5b39085f4855f3eadf3139a233.png';

export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              <img src={logo} alt="Path2Medic" className="h-12 w-auto" />
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Master the thinking process, not just the content.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-[#E67E22]" />
              <a href="mailto:vincent@path2medic.com" className="hover:text-[#E67E22] transition-colors">
                vincent@path2medic.com
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <a href="#" className="hover:text-[#E67E22] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#E67E22] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#E67E22] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  EMT Resources
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  AEMT Resources
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Paramedic Resources
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/practice" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Practice Questions
                </Link>
              </li>
              <li>
                <Link to="/tutoring" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Tutoring
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Login
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/customer-portal" className="inline-block px-3 py-1 bg-[#1a5f7a] text-white text-xs rounded hover:bg-[#134b61] transition-colors">
                  Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Path2Medic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}