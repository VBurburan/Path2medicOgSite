import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import logo from 'figma:asset/7e2353c04204bd5b39085f4855f3eadf3139a233.png';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Path2Medic" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-[#2C3E50] hover:text-[#E67E22] transition-colors">
              Products
            </Link>
            <Link to="/practice" className="text-[#2C3E50] hover:text-[#E67E22] transition-colors">
              Practice Platform
            </Link>
            <Link to="/tutoring" className="text-[#2C3E50] hover:text-[#E67E22] transition-colors">
              Tutoring
            </Link>
            <Link to="/educators" className="text-[#2C3E50] hover:text-[#E67E22] transition-colors">
              For Educators
            </Link>
            <Link to="/about" className="text-[#2C3E50] hover:text-[#E67E22] transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-[#2C3E50] hover:text-[#E67E22] transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/practice">
              <Button className="bg-[#E67E22] hover:bg-[#D35400]">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-[#2C3E50]" />
            ) : (
              <Menu className="h-6 w-6 text-[#2C3E50]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/products"
              className="block text-[#2C3E50] hover:text-[#E67E22] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/practice"
              className="block text-[#2C3E50] hover:text-[#E67E22] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Practice Platform
            </Link>
            <Link
              to="/tutoring"
              className="block text-[#2C3E50] hover:text-[#E67E22] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tutoring
            </Link>
            <Link
              to="/educators"
              className="block text-[#2C3E50] hover:text-[#E67E22] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              For Educators
            </Link>
            <Link
              to="/about"
              className="block text-[#2C3E50] hover:text-[#E67E22] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-[#2C3E50] hover:text-[#E67E22] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 space-y-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/practice" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-[#E67E22] hover:bg-[#D35400]">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}