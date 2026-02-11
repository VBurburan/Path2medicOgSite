import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { CheckCircle2, BookOpen, Download } from 'lucide-react';

interface ProductCardProps {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  level: string;
  coverImage?: string;
  coverImages?: string[];
  purchaseLink?: string;
  buyLink?: string;
  category?: string | string[];
}

export default function ProductCard({ title, subtitle, description, price, level, coverImage, coverImages, purchaseLink, buyLink, category }: ProductCardProps) {
  const effectiveLink = purchaseLink || buyLink;
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
    if (effectiveLink) {
      window.open(effectiveLink, '_blank');
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
          disabled={!effectiveLink}
        >
          {effectiveLink ? 'Buy Now' : 'Coming Soon'}
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">Preview</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={levelColors[level]}>{level}</Badge>
                <span className="text-xl font-bold text-[#1B4F72]">${price}</span>
              </div>
              <DialogTitle className="text-2xl">{title}</DialogTitle>
              <DialogDescription className="text-base">{subtitle}</DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-6 py-4">
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                {hasMultipleImages ? (
                  <div className="flex gap-2 items-center justify-center">
                    {displayImages.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${title} - View ${index + 1}`}
                        className="max-h-[250px] object-contain shadow-md"
                      />
                    ))}
                  </div>
                ) : (
                  <img 
                    src={displayImages[0]} 
                    alt={title}
                    className="max-h-[300px] w-full object-contain shadow-md"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#1B4F72] mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Description
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#1B4F72] mb-2">Key Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Instant Digital Delivery</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Mobile & Tablet Friendly</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>High-Quality PDF Format</span>
                    </li>
                    {effectiveLink && (
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Download className="h-4 w-4 text-[#5DADE2]" />
                        <span>Secure Download via Thinkific</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between gap-4 items-center border-t pt-4">
              <div className="text-sm text-gray-500 italic hidden sm:block">
                *Secure payment processing
              </div>
              <Button 
                className="w-full sm:w-auto bg-[#E67E22] hover:bg-[#D35400] text-lg px-8" 
                onClick={handlePurchase}
                disabled={!effectiveLink}
              >
                {effectiveLink ? 'Buy Now' : 'Coming Soon'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}