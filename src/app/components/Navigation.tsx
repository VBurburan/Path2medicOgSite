import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, GraduationCap, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import logoHorizontal from '@/assets/logo-horizontal.png';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const scrolled = useScrollPosition(20);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,1)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled
          ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
          : 'none',
        borderBottom: scrolled ? 'none' : '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center group">
            <img
              src={logoHorizontal}
              alt="Path2Medic"
              className="h-14 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* Products Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-[#2C3E50] hover:text-[#E03038] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-[15px] font-medium">
                Products
                <ChevronDown className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-[580px] bg-white rounded-xl shadow-xl border border-gray-100/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 top-full overflow-hidden">
                <div className="flex flex-row p-6 gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-[#0D2137] font-semibold text-xs uppercase tracking-wider">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>For Students</span>
                    </div>
                    <div className="space-y-1">
                      <Link to="/products/proof-is-in-the-pudding" className="block group/item rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038] transition-colors">The Proof is in the Pudding</div>
                        <div className="text-xs text-gray-400 mt-0.5">EMT Test Strategy Guide</div>
                      </Link>
                      <Link to="/products/spot-it-sort-it-solve-it" className="block group/item rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038] transition-colors">Spot It, Sort It, Solve It</div>
                        <div className="text-xs text-gray-400 mt-0.5">Clinical Judgment Framework</div>
                      </Link>
                      <Link to="/products/cat-got-your-tongue" className="block group/item rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038] transition-colors">CAT Got Your Tongue?</div>
                        <div className="text-xs text-gray-400 mt-0.5">Computer Adaptive Testing Guide</div>
                      </Link>
                      <Link to="/products/clinical-judgment-workbook-paramedic" className="block group/item rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038] transition-colors">Clinical Judgment Workbook</div>
                        <div className="text-xs text-gray-400 mt-0.5">Paramedic Practice Scenarios</div>
                      </Link>
                      <Link to="/products" className="block mt-2 px-3 text-xs font-semibold text-[#E03038] hover:underline">
                        View All Products →
                      </Link>
                    </div>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="w-1/3 flex flex-col gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-[#0D2137] font-semibold text-xs uppercase tracking-wider">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>For Educators</span>
                      </div>
                      <Link to="/products/under-the-hood" className="block group/item rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038] transition-colors">Under the Hood</div>
                        <div className="text-xs text-gray-400 mt-0.5">Item Writing Guide</div>
                      </Link>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-[#0D2137] font-semibold text-xs uppercase tracking-wider">
                        <User className="h-3.5 w-3.5" />
                        <span>Service</span>
                      </div>
                      <Link to="/tutoring" className="block group/item rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-gray-900 group-hover/item:text-[#E03038] transition-colors">1-on-1 Coaching</div>
                        <div className="text-xs text-gray-400 mt-0.5">Private NREMT Tutoring</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/practice" className="text-[#2C3E50] hover:text-[#E03038] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-[15px] font-medium">
              Practice
            </Link>
            <Link to="/tutoring" className="text-[#2C3E50] hover:text-[#E03038] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-[15px] font-medium">
              Tutoring
            </Link>
            <Link to="/about" className="text-[#2C3E50] hover:text-[#E03038] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-[15px] font-medium">
              About
            </Link>
            <Link to="/contact" className="text-[#2C3E50] hover:text-[#E03038] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-[15px] font-medium">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button className="bg-[#0D2137] hover:bg-[#162d47] gap-2 font-medium transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-400 hover:text-gray-600">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-[#2C3E50] font-medium hover:bg-gray-50">Login</Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-[#E03038] hover:bg-[#c52830] font-medium transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-[#2C3E50]" /> : <Menu className="h-6 w-6 text-[#2C3E50]" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[600px] opacity-100 pb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-1 pt-2">
            <div>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center justify-between w-full text-[#2C3E50] hover:text-[#E03038] transition-colors py-3 px-3 rounded-lg hover:bg-gray-50"
              >
                <span className="font-medium">Products</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isProductsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-4 space-y-1 mt-1 border-l-2 border-gray-100 ml-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 mb-1 px-3">For Students</div>
                  <Link to="/products/proof-is-in-the-pudding" className="block text-sm text-gray-600 hover:text-[#E03038] py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>The Proof is in the Pudding</Link>
                  <Link to="/products/spot-it-sort-it-solve-it" className="block text-sm text-gray-600 hover:text-[#E03038] py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Spot It, Sort It, Solve It</Link>
                  <Link to="/products/cat-got-your-tongue" className="block text-sm text-gray-600 hover:text-[#E03038] py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>CAT Got Your Tongue?</Link>
                  <Link to="/products/clinical-judgment-workbook-paramedic" className="block text-sm text-gray-600 hover:text-[#E03038] py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Clinical Judgment Workbook</Link>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3 mb-1 px-3">For Educators</div>
                  <Link to="/products/under-the-hood" className="block text-sm text-gray-600 hover:text-[#E03038] py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Under the Hood</Link>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3 mb-1 px-3">Service</div>
                  <Link to="/tutoring" className="block text-sm text-gray-600 hover:text-[#E03038] py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsMenuOpen(false)}>1-on-1 Coaching</Link>
                  <Link to="/products" className="block text-sm font-semibold text-[#E03038] mt-2 px-3" onClick={() => setIsMenuOpen(false)}>View All Products</Link>
                </div>
              </div>
            </div>
            <Link to="/practice" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors py-3 px-3 rounded-lg hover:bg-gray-50 font-medium" onClick={() => setIsMenuOpen(false)}>Practice</Link>
            <Link to="/tutoring" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors py-3 px-3 rounded-lg hover:bg-gray-50 font-medium" onClick={() => setIsMenuOpen(false)}>Tutoring</Link>
            <Link to="/about" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors py-3 px-3 rounded-lg hover:bg-gray-50 font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-[#2C3E50] hover:text-[#E03038] transition-colors py-3 px-3 rounded-lg hover:bg-gray-50 font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="pt-4 space-y-2 border-t border-gray-100 mt-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-[#0D2137] hover:bg-[#162d47] gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
                  </Link>
                  <Button variant="ghost" className="w-full text-gray-500" onClick={() => { signOut(); setIsMenuOpen(false); }}>Sign Out</Button>
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
        </div>
      </div>
    </nav>
  );
}
