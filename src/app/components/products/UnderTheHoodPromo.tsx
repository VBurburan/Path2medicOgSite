import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import bookCover from '@/assets/underhood-cover.png';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div ref={ref} className={className} style={{
      opacity: isInView ? 1 : 0,
      transform: isInView ? 'none' : 'translateY(32px)',
      transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export function UnderTheHoodHero() {
  const scrollToDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('under-the-hood-detail');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden max-w-4xl mx-auto my-8 group hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/3 bg-[#0D2137] relative p-6 flex items-center justify-center">
          <Badge className="absolute top-4 left-4 bg-[#E03038] text-white hover:bg-[#E03038] font-bold px-3 text-[10px] tracking-wider">
            NEW
          </Badge>
          <img
            src={bookCover}
            alt="Under the Hood eBook cover"
            className="w-3/4 md:w-full h-auto shadow-2xl rounded-sm transform md:scale-110 md:translate-x-4 transition-transform group-hover:scale-[1.12] duration-500"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-[#0D2137] mb-1">
            Under the Hood
          </h3>
          <p className="text-sm font-medium text-[#E03038] mb-4">
            Writing Better NREMT-Aligned EMS Questions
          </p>

          <p className="text-gray-500 mb-5 text-sm leading-relaxed">
            A practical guide to Clinical Judgment item writing, TEIs, and diagnostic error analysis for EMS educators. Learn how to build scenario-based items that measure real clinical reasoning.
          </p>

          <div className="space-y-2.5 mb-6">
            {[
              "Clinical Judgment framework mapped to item writing",
              "TEI deep dives: Multiple Response, Build List, Drag-and-Drop, Options Box",
              "Error Signatures + tagging for actionable remediation reports"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#E03038] font-mono text-xs font-bold mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              className="bg-[#E03038] hover:bg-[#c52830] text-white w-full sm:w-auto font-semibold transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md group/btn"
              onClick={() => window.open('https://path2medic.thinkific.com/enroll/3674017?price_id=4619456', '_blank')}
            >
              Get the eBook — $22.99
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
            </Button>
            <a
              href="#under-the-hood-detail"
              onClick={scrollToDetail}
              className="text-[#0D2137] text-sm font-medium flex items-center group/link cursor-pointer hover:text-[#E03038] transition-colors"
            >
              See what's inside
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UnderTheHoodDetailed() {
  const features = [
    "Clinical Judgment item mapping",
    "Scenario design (three-phase structure)",
    "Distractor engineering + scope traps",
    "TEI construction rules + examples",
    "Metadata schema for item banks",
    "Item rating and difficulty analysis",
    "Diagnostic reporting framework",
  ];

  return (
    <section id="under-the-hood-detail" className="py-20 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-4">Under the Hood</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            A step-by-step system for writing EMS assessment items that reflect real clinical decision-making.
          </p>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: Large Image */}
          <AnimatedSection className="w-full lg:w-5/12 flex justify-center" delay={0.1}>
            <div className="relative">
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-[#E03038]/15 -z-10" />
              <img
                src={bookCover}
                alt="Under the Hood eBook cover"
                className="relative z-10 w-full max-w-md shadow-xl rounded-xl"
              />
            </div>
          </AnimatedSection>

          {/* Right: Content */}
          <AnimatedSection className="w-full lg:w-7/12" delay={0.2}>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                Under the Hood breaks down the Clinical Judgment cycle, shows how to write TEIs that score cleanly, and provides a tagging framework that turns missed questions into targeted remediation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center p-3.5 bg-white rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 group">
                    <span className="text-[#E03038] font-mono text-xs font-bold mr-3 flex-shrink-0 w-5">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="font-medium text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200/60">
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-[#0D2137] hover:bg-[#162d47] text-white font-semibold px-8 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg group"
                    onClick={() => window.open('https://path2medic.thinkific.com/enroll/3674017?price_id=4619456', '_blank')}
                  >
                    Buy Now — $22.99
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-200 text-[#0D2137] hover:bg-[#0D2137] hover:text-white hover:border-[#0D2137] transition-all duration-200"
                    onClick={() => window.open('https://path2medic.thinkific.com/enroll/3674017?price_id=4619456', '_blank')}
                  >
                    Preview Table of Contents
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Instant access after purchase.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Best for:</span>
                  {["Educators", "Program Directors", "Test-Prep Creators"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-[#0D2137]/8 text-[#0D2137] border-0 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Not affiliated with the National Registry of EMTs.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
