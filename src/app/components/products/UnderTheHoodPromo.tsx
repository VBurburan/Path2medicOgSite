import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, ArrowRight, BookOpen, Layers, AlertTriangle, FileText, Database, BarChart3, Star } from 'lucide-react';
import bookCover from '@/assets/underhood-cover.png';

export function UnderTheHoodHero() {
  const scrollToDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('under-the-hood-detail');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto my-8">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/3 bg-[#1B4F72] relative p-6 flex items-center justify-center">
          <Badge className="absolute top-4 left-4 bg-white text-[#E67E22] hover:bg-white font-bold px-3">
            New
          </Badge>
          <img 
            src={bookCover} 
            alt="Under the Hood eBook cover" 
            className="w-3/4 md:w-full h-auto shadow-2xl rounded-sm transform md:scale-110 md:translate-x-4 transition-transform hover:scale-105 duration-500"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-[#1B4F72] mb-1">
            Under the Hood: Writing Better NREMT-Aligned EMS Questions
          </h3>
          <p className="text-sm font-medium text-[#E67E22] mb-4">
            A practical guide to Clinical Judgment item writing, TEIs, and diagnostic error analysis for EMS educators.
          </p>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Most EMS exams test recall. This guide teaches you how to write questions that measure clinical judgment—aligned to how the NREMT actually tests today. Learn how to build scenario-based items, use TEI formats effectively, and diagnose why students miss questions using a repeatable error signature system.
          </p>

          <div className="space-y-2 mb-6">
            {[
              "Clinical Judgment framework mapped to item writing",
              "TEI deep dives: Multiple Response, Build List, Drag-and-Drop, Options Box",
              "Error Signatures + tagging to generate actionable remediation reports"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7FA99B] mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button 
              className="bg-[#E67E22] hover:bg-[#D35400] text-white w-full sm:w-auto font-semibold"
              onClick={() => window.open('https://path2medic.thinkific.com/enroll/3674017?price_id=4619456', '_blank')}
            >
              Get the eBook
            </Button>
            <a 
              href="#under-the-hood-detail" 
              onClick={scrollToDetail}
              className="text-[#1B4F72] hover:text-[#5DADE2] text-sm font-medium flex items-center group cursor-pointer"
            >
              See what’s inside
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UnderTheHoodDetailed() {
  const features = [
    { label: "Clinical Judgment item mapping", icon: FileText },
    { label: "Scenario design (three-phase structure)", icon: Layers },
    { label: "Distractor engineering + scope traps", icon: AlertTriangle },
    { label: "TEI construction rules + examples", icon: Database },
    { label: "Metadata schema for item banks", icon: BookOpen },
    { label: "Item rating and difficulty analysis", icon: Star },
    { label: "Diagnostic reporting framework", icon: BarChart3 },
  ];

  return (
    <section id="under-the-hood-detail" className="py-16 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1B4F72] mb-12 text-center">Under the Hood</h2>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Large Image */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1B4F72] to-[#5DADE2] rounded-2xl transform -rotate-6 scale-95 opacity-20"></div>
              <img 
                src={bookCover} 
                alt="Under the Hood eBook cover" 
                className="relative z-10 w-full max-w-md shadow-2xl rounded-lg"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-7/12">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Under the Hood is a step-by-step system for writing EMS assessment items that reflect real clinical decision-making and current NREMT exam structure. It breaks down the Clinical Judgment cycle, shows how to write TEIs that score cleanly, and provides a tagging framework that turns missed questions into targeted remediation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="bg-[#E67E22]/10 p-2 rounded-full mr-3">
                      <feature.icon className="w-5 h-5 text-[#E67E22]" />
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{feature.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg"
                    className="bg-[#1B4F72] hover:bg-[#154160] text-white font-bold text-lg px-8"
                    onClick={() => window.open('https://path2medic.thinkific.com/enroll/3674017?price_id=4619456', '_blank')}
                  >
                    Buy Now
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-[#1B4F72] text-[#1B4F72] hover:bg-[#1B4F72]/5"
                    onClick={() => window.open('https://path2medic.thinkific.com/enroll/3674017?price_id=4619456', '_blank')} 
                  >
                    Preview the Table of Contents
                  </Button>
                </div>
                <p className="text-sm text-gray-500 italic">
                  Instant access after purchase.
                </p>
                
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Best for:</span>
                  {["Educators", "Program Directors", "Test-Prep Creators"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-[#5DADE2]/10 text-[#1B4F72] border-[#5DADE2]/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xs text-gray-400 mt-2">
                  Not affiliated with the National Registry of EMTs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
