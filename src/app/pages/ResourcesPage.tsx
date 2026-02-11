import React from 'react';
import DashboardLayout from '../components/portal/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { products } from '../data/products';

export default function ResourcesPage() {
  // For now, show all available study guides with buy links.
  // Eventually this can integrate with Thinkific API to check purchases.
  const studyGuides = products.filter((p) => p.buyLink);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-[#0D2137]">Resources</h1>
        <p className="text-gray-500 text-sm">
          Your study guides and downloadable resources. Purchase links open in a new tab.
        </p>

        {studyGuides.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No resources available yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {studyGuides.map((guide) => (
            <Card key={guide.slug} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  {/* Cover thumbnail */}
                  {guide.coverImage && (
                    <img
                      src={guide.coverImage}
                      alt={guide.title}
                      className="w-16 h-20 object-cover rounded border border-gray-200 flex-shrink-0"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0D2137] truncate">{guide.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{guide.subtitle}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-medium text-[#1a5f7a]">${guide.price}</span>
                      <span className="text-xs text-gray-400">{guide.pages} pages</span>
                      <span className="text-xs text-gray-400">{guide.level}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={guide.buyLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1.5" />
                        Get
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
