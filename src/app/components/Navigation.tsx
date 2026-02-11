import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, GraduationCap, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import logo from '@/assets/logo.png';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Path2Medic" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Products Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-[#2C3E50] hover:text-[#E03038] transition-colors whitespace-nowrap focus:outline-none py-4">
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-[600px] bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 top-full overflow-hidden">
                <div className="flex flex-row p-6 gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-[#0D2137] font-semibold border-b border-gray-100 pb-2">
                      <BookOpen className="h-4 w-4" />
                      <span>For Students</span>
                    </div>
                    <div className="space-y-3">
                      <Link to="/products/proof-is-in-the-pudding" className="block group/item">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038]">The Proof is in the Pudding</div>
                        <div className="text-xs text-gray-500">EMT Test Strategy Guide</div>
                      </Link>
                      <Link to="/products/spot-it-sort-it-solve-it" className="block group/item">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038]">Spot It, Sort It, Solve It</div>
                        <div className="text-xs text-gray-500">Clinical Judgment Framework</div>
                      </Link>
                      <Link to="/products/cat-got-your-tongue" className="block group/item">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038]">CAT Got Your Tongue?</div>
                        <div className="text-xs text-gray-500">Computer Adaptive Testing Guide</div>
                      </Link>
                      <Link to="/products/clinical-judgment-workbook-paramedic" className="block group/item">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038]">Clinical Judgment Workbook</div>
                        <div className="text-xs text-gray-500">Paramedic Practice Scenarios</div>
                      </Link>
                      <Link to="/products" className="block mt-4 text-xs font-semibold text-[#E03038] hover:underline">
                        View All Products →
                      </Link>
                    </div>
                  </div>
                  <div className="w-1/3 flex flex-col gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-[#0D2137] font-semibold border-b border-gray-100 pb-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>For Educators</span>
                      </div>
                      <Link to="/products/under-the-hood" className="block group/item">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038]">Under the Hood</div>
                        <div className="text-xs text-gray-500">Item Writing Guide</div>
                      </Link>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-[#0D2137] font-semibold border-b border-gray-100 pb-2">
                        <User className="h-4 w-4" />
                        <span>Service</span>
                      </div>
                      <Link to="/tutoring" className="block group/item">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038]">1-on-1 Coaching</div>
                        <div className="text-xs text-gray-500">Private NREMT Tutoring</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/practice" className="text-[#2C3E50] hover:text-[#E03038] transition-colors whitespace-nowrap">
              Practice
            </Link>
            <Link to="/tutoring" className="text-[#2C3E50] hover:text-[#E03038] transition-colors whitespace-nowrap">
              Tutoring
            </Link>
            <Link to="/about" className="text-[#2C3E50] hover:text-[#E03038] transition-colors whitespace-nowrap">
              About
            </Link>
            <Link to="/contact" className="text-[#2C3E50] hover:text-[#E03038] transition-colors whitespace-nowrap">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-500">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-[#E03038] hover:bg-[#c52830]">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X className="h-6 w-6 text-[#2C3E50]" /> : <Menu className="h-6 w-6 text-[#2C3E50]" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center justify-between w-full text-[#2C3E50] hover:text-[#E03038] transition-colors py-2"
              >
                <span>Products</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProductsOpen && (
                <div className="pl-4 space-y-3 mt-2 border-l-2 border-gray-100 ml-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-1">For Students</div>
                  <Link to="/products/proof-is-in-the-pudding" className="block text-sm text-gray-600 hover:text-[#E03038]" onClick={() => setIsMenuOpen(false)}>The Proof is in the Pudding</Link>
                  <Link to="/products/spot-it-sort-it-solve-it" className="block text-sm text-gray-600 hover:text-[#E03038]" onClick={() => setIsMenuOpen(false)}>Spot It, Sort It, Solve It</Link>
                  <Link to="/products/cat-got-your-tongue" className="block text-sm text-gray-600 hover:text-[#E03038]" onClick={() => setIsMenuOpen(false)}>CAT Got Your Tongue?</Link>
                  <Link to="/products/clinical-judgment-workbook-paramedic" className="block text-sm text-gray-600 hover:text-[#E03038]" onClick={() => setIsMenuOpen(false)}>Clinical Judgment Workbook</Link>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">For Educators</div>
                  <Link to="/products/under-the-hood" className="block text-sm text-gray-600 hover:text-[#E03038]" onClick={() => setIsMenuOpen(false)}>Under the Hood</Link>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">Service</div>
                  <Link to="/tutoring" className="block text-sm text-gray-600 hover:text-[#E03038]" onClick={() => setIsMenuOpen(false)}>1-on-1 Coaching</Link>
                  <Link to="/products" className="block text-sm font-medium text-[#E03038] mt-3" onClick={() => setIsMenuOpen(false)}>View All Products</Link>
                </div>
              )}
            </div>
            <Link to="/practice" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors" onClick={() => setIsMenuOpen(false)}>Practice</Link>
            <Link to="/tutoring" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors" onClick={() => setIsMenuOpen(false)}>Tutoring</Link>
            <Link to="/about" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={() => { signOut(); setIsMenuOpen(false); }}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-[#E03038] hover:bg-[#c52830]">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
