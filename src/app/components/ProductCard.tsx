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

const LEVEL_COLORS: Record<string, string> = {
  EMT: 'bg-[#1a5f7a]',
  AEMT: 'bg-[#0D2137]',
  Paramedic: 'bg-[#E03038]',
  'AEMT & Paramedic': 'bg-[#E03038]',
  'EMT & Paramedic': 'bg-[#d4a843] text-[#0D2137]',
  'Educators / Tutors': 'bg-[#0D2137]',
  All: 'bg-[#0D2137]',
};

export default function ProductCard({ title, subtitle, description, price, level, coverImage, coverImages, purchaseLink, buyLink }: ProductCardProps) {
  const effectiveLink = purchaseLink || buyLink;
  const displayImages = coverImages || (coverImage ? [coverImage] : []);
  const hasMultipleImages = displayImages.length > 1;

  const handlePurchase = () => {
    if (effectiveLink) {
      window.open(effectiveLink, '_blank');
    }
  };

  const badgeClass = LEVEL_COLORS[level] || LEVEL_COLORS.All;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 flex flex-col">
      {displayImages.length > 0 ? (
        <div className="h-64 overflow-hidden rounded-t-lg bg-[#f8f9fa] flex items-center justify-center p-4">
          {hasMultipleImages ? (
            <div className="flex gap-3 h-full w-full items-center justify-center">
              {displayImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${title} - Book ${index + 1}`}
                  className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{ maxWidth: `${100 / displayImages.length}%` }}
                />
              ))}
            </div>
          ) : (
            <img
              src={displayImages[0]}
              alt={title}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-[#0D2137] to-[#162d47] rounded-t-lg flex items-center justify-center">
          <div className="text-white text-center p-6">
            <div className="text-sm font-semibold mb-2">{subtitle}</div>
            <div className="text-2xl font-bold">{title}</div>
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={badgeClass}>{level}</Badge>
          <span className="text-2xl font-bold text-[#0D2137]">${price}</span>
        </div>
        <CardTitle className="text-lg mt-2 text-[#0D2137] leading-tight">{title}</CardTitle>
        <CardDescription className="text-sm">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button
          className="flex-1 bg-[#E03038] hover:bg-[#c52830] font-semibold"
          onClick={handlePurchase}
          disabled={!effectiveLink}
        >
          {effectiveLink ? 'Buy Now' : 'Coming Soon'}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 border-[#0D2137] text-[#0D2137] hover:bg-[#0D2137]/5">Details</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={badgeClass}>{level}</Badge>
                <span className="text-xl font-bold text-[#0D2137]">${price}</span>
              </div>
              <DialogTitle className="text-2xl text-[#0D2137]">{title}</DialogTitle>
              <DialogDescription className="text-base">{subtitle}</DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6 py-4">
              <div className="flex items-center justify-center bg-[#f8f9fa] rounded-lg p-4">
                {hasMultipleImages ? (
                  <div className="flex gap-2 items-center justify-center">
                    {displayImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${title} - View ${index + 1}`}
                        className="max-h-[250px] object-contain shadow-md rounded"
                      />
                    ))}
                  </div>
                ) : displayImages.length > 0 ? (
                  <img
                    src={displayImages[0]}
                    alt={title}
                    className="max-h-[300px] w-full object-contain shadow-md rounded"
                  />
                ) : null}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#0D2137] mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#0D2137]" />
                    Description
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#0D2137] mb-2">Included</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-[#0D2137]" />
                      <span>Instant Digital Delivery</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-[#0D2137]" />
                      <span>Mobile & Tablet Friendly</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-[#0D2137]" />
                      <span>High-Quality PDF Format</span>
                    </li>
                    {effectiveLink && (
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Download className="h-4 w-4 text-[#0D2137]" />
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
                className="w-full sm:w-auto bg-[#E03038] hover:bg-[#c52830] text-lg px-8 font-semibold"
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
