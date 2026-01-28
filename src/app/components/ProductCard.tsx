import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface ProductCardProps {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  level: 'EMT' | 'AEMT' | 'Paramedic' | 'All';
  coverImage?: string;
  coverImages?: string[]; // For bundles with multiple books
  purchaseLink?: string; // Thinkific purchase link
  category?: string | string[]; // Category for filtering (not displayed)
}

export default function ProductCard({ title, subtitle, description, price, level, coverImage, coverImages, purchaseLink, category }: ProductCardProps) {
  const levelColors = {
    EMT: 'bg-[#7FA99B] hover:bg-[#6B8F85]',
    AEMT: 'bg-[#5DADE2] hover:bg-[#3498DB]',
    Paramedic: 'bg-[#E67E22] hover:bg-[#D35400]',
    All: 'bg-[#1B4F72] hover:bg-[#154360]'
  };

  // Determine which images to display
  const displayImages = coverImages || (coverImage ? [coverImage] : []);
  const hasMultipleImages = displayImages.length > 1;

  const handlePurchase = () => {
    if (purchaseLink) {
      window.open(purchaseLink, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      {displayImages.length > 0 ? (
        <div className="h-64 overflow-hidden rounded-t-lg bg-white flex items-center justify-center p-4">
          {hasMultipleImages ? (
            <div className="flex gap-3 h-full w-full items-center justify-center">
              {displayImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${title} - Book ${index + 1}`}
                  className="h-full object-contain"
                  style={{ maxWidth: `${100 / displayImages.length}%` }}
                />
              ))}
            </div>
          ) : (
            <img 
              src={displayImages[0]} 
              alt={title}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-[#1B4F72] to-[#5DADE2] rounded-t-lg flex items-center justify-center">
          <div className="text-white text-center p-6">
            <div className="text-sm font-semibold mb-2">{subtitle}</div>
            <div className="text-2xl font-bold">{title}</div>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className={levelColors[level]}>{level}</Badge>
          <span className="text-2xl font-bold text-[#1B4F72]">${price}</span>
        </div>
        <CardTitle className="text-xl mt-2">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          className="flex-1 bg-[#E67E22] hover:bg-[#D35400]" 
          onClick={handlePurchase}
          disabled={!purchaseLink}
        >
          {purchaseLink ? 'Buy Now' : 'Coming Soon'}
        </Button>
        <Button variant="outline" className="flex-1">Preview</Button>
      </CardFooter>
    </Card>
  );
}