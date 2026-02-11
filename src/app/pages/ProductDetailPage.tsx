import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

// Author image import
import vincentHeadshot from '@/assets/vincent-headshot.png';

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

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = products.find(p => p.slug === slug);

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F8F9FA] to-white pt-12 pb-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
            {/* Image Column */}
            <AnimatedSection className="w-full md:w-1/3 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#E03038]/15 to-[#d4a843]/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[#0D2137] rounded-xl opacity-8 transform translate-x-4 translate-y-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="relative z-10 w-full max-w-[350px] shadow-2xl rounded-xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl"
                />
              </div>
            </AnimatedSection>

            {/* Content Column */}
            <div className="w-full md:w-2/3">
              <AnimatedSection delay={0.1}>
                <Badge className="mb-4 bg-[#E03038] hover:bg-[#c52830] text-white px-4 py-1.5 rounded-lg font-semibold text-sm">
                  {product.level}
                </Badge>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <h1 className="text-3xl md:text-5xl font-bold text-[#0D2137] mb-2 leading-tight tracking-tight">
                  {product.title}
                </h1>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <h2 className="text-xl md:text-2xl text-[#0D2137]/70 font-semibold mb-6">
                  {product.subtitle}
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={0.25}>
                <p className="text-lg text-gray-500 italic border-l-2 border-[#E03038]/30 pl-5 mb-8 leading-relaxed">
                  "{product.tagline}"
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="flex flex-col sm:flex-row items-baseline gap-4 mb-8">
                  <span className="text-5xl font-bold text-[#0D2137] tracking-tight">${product.price}</span>
                  <span className="text-gray-400 font-medium">{product.pages} Pages &bull; PDF Download</span>
                </div>

                <div className="flex flex-col gap-3 max-w-md">
                  <Button
                    size="lg"
                    className="bg-[#0D2137] hover:bg-[#162d47] text-white text-lg h-14 w-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 rounded-xl font-semibold"
                    onClick={() => window.open(product.buyLink, '_blank')}
                  >
                    Buy Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-xs text-center text-gray-400 font-medium">
                    Instant digital download -- PDF
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="prose prose-lg text-gray-500 max-w-none leading-relaxed">
              {product.description}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3 text-center">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-14 text-center tracking-tight">What's Inside</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.08}>
                <div className="bg-white p-7 rounded-2xl shadow-md border-0 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group h-full">
                  <div className="bg-[#E03038]/10 w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-5 h-5 text-[#E03038]" />
                  </div>
                  <h3 className="font-bold text-[#0D2137] mb-2 text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#E03038] mb-3 text-center">Audience</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2137] mb-10 text-center tracking-tight">Who This Is For</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="bg-gradient-to-br from-[#0D2137]/[0.03] to-[#E03038]/[0.03] rounded-2xl p-8 md:p-10 border border-[#0D2137]/5">
              <ul className="space-y-4">
                {product.audience.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group/item">
                    <div className="bg-[#0D2137] p-1.5 rounded-lg mt-0.5 flex-shrink-0 group-hover/item:bg-[#E03038] transition-colors duration-300">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-600 font-medium text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-white rounded-2xl shadow-md border-0 hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#E03038]/20 to-[#d4a843]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <img
                  src={vincentHeadshot}
                  alt="Vincent Burburan"
                  className="relative w-20 h-20 rounded-full object-cover ring-2 ring-[#0D2137]/10"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-[#0D2137] text-lg">Written by Vincent Burburan, NRP</h3>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                  National Registry Paramedic, NAEMSE Level 1 Instructor, University of Florida Critical Care Paramedic Program graduate. 10+ years EMS experience.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#0D2137] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(224,48,56,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,67,0.06)_0%,_transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to Get Started?</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-xl text-white/60 mb-10 leading-relaxed">
              Instant digital download. Start studying in minutes.
            </p>
            <Button
              size="lg"
              className="bg-[#E03038] hover:bg-[#c52830] text-white text-lg h-14 px-12 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 rounded-xl font-semibold"
              onClick={() => window.open(product.buyLink, '_blank')}
            >
              Buy Now - ${product.price}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
