import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, ArrowRight, User } from 'lucide-react';

// Author image import
import vincentHeadshot from '@/assets/vincent-headshot.png';

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
      <section className="bg-gradient-to-b from-[#F8F9FA] to-white pt-12 pb-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Image Column */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#0D2137] rounded-lg opacity-10 transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <img 
                  src={product.coverImage} 
                  alt={product.title} 
                  className="relative z-10 w-full max-w-[350px] shadow-2xl rounded-lg transform transition-transform group-hover:-translate-y-1"
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="w-full md:w-2/3">
              <Badge className="mb-4 bg-[#E03038] hover:bg-[#c52830] text-white px-3 py-1">
                {product.level}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-[#0D2137] mb-2 leading-tight">
                {product.title}
              </h1>
              <h2 className="text-xl md:text-2xl text-[#0D2137] font-semibold mb-6">
                {product.subtitle}
              </h2>
              <p className="text-lg text-gray-700 italic border-l-4 border-[#E03038] pl-4 mb-8">
                "{product.tagline}"
              </p>
              
              <div className="flex flex-col sm:flex-row items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-[#0D2137]">${product.price}</span>
                <span className="text-gray-500">{product.pages} Pages • PDF Download</span>
              </div>

              <div className="flex flex-col gap-3 max-w-md">
                <Button 
                  size="lg" 
                  className="bg-[#0D2137] hover:bg-[#0D2137] text-white text-lg h-14 w-full shadow-lg"
                  onClick={() => window.open(product.buyLink, '_blank')}
                >
                  Buy Now
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Instant digital download — PDF
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg text-gray-700 max-w-none">
            {product.description}
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0D2137] mb-12 text-center">What's Inside</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-[#E03038]/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#E03038]" />
                </div>
                <h3 className="font-bold text-[#0D2137] mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0D2137] mb-8 text-center">Who This Is For</h2>
          <div className="bg-[#E6F3F5] rounded-2xl p-8 md:p-10">
            <ul className="space-y-4">
              {product.audience.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-[#0D2137] p-1 rounded-full mt-1 flex-shrink-0">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-gray-200 rounded-xl">
            <img 
              src={vincentHeadshot} 
              alt="Vincent Burburan" 
              className="w-20 h-20 rounded-full object-cover border-2 border-[#0D2137]"
            />
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-[#0D2137] text-lg">Written by Vincent Burburan, NRP</h3>
              <p className="text-sm text-gray-600 mt-1">
                National Registry Paramedic, NAEMSE Level 1 Instructor, University of Florida Critical Care Paramedic Program graduate. 10+ years EMS experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0D2137] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8">
            Instant digital download. Start studying in minutes.
          </p>
          <Button 
            size="lg" 
            className="bg-[#E03038] hover:bg-[#c52830] text-white text-lg h-14 px-12 shadow-lg"
            onClick={() => window.open(product.buyLink, '_blank')}
          >
            Buy Now - ${product.price}
          </Button>
        </div>
      </section>
    </Layout>
  );
}
