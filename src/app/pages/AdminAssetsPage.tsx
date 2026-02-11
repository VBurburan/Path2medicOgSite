import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Upload, Image as ImageIcon, Copy, ExternalLink, Trash2, Check, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAssetsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkAuthAndLoadAssets();
  }, [refreshTrigger]);

  const checkAuthAndLoadAssets = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user?.user_metadata?.role !== 'admin') {
        navigate('/login');
        return;
      }

      // List files from public bucket
      const { data, error } = await supabase.storage
        .from('path2medic-public')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error('Error loading assets:', error);
        toast.error('Failed to load assets');
      } else {
        setAssets(data || []);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('path2medic-public')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      toast.success('Image uploaded successfully');
      setRefreshTrigger(prev => prev + 1); // Reload list
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const copyUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('path2medic-public')
      .getPublicUrl(fileName);
    
    navigator.clipboard.writeText(data.publicUrl);
    toast.success('URL copied to clipboard!');
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this asset? This might break pages using it.')) return;

    try {
      const { error } = await supabase.storage
        .from('path2medic-public')
        .remove([fileName]);

      if (error) throw error;
      
      toast.success('Asset deleted');
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error('Error deleting asset');
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('path2medic-public')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asset Manager</h1>
            <p className="text-gray-500">Upload and manage public images for your website</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>
                Supported formats: PNG, JPG, SVG, WebP (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleUpload}
                  disabled={uploading}
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </div>
                  <p className="text-xs text-gray-500">
                    Images will be stored in the public bucket
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Section */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Image Library</CardTitle>
                <CardDescription>{assets.length} assets found</CardDescription>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setRefreshTrigger(prev => prev + 1)}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p>No images uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {assets.map((file) => {
                    const url = getPublicUrl(file.name);
                    return (
                      <div key={file.id} className="group relative border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img 
                            src={url} 
                            alt={file.name} 
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="p-2 border-t bg-white">
                          <p className="text-xs font-medium truncate text-gray-700 mb-2" title={file.name}>
                            {file.name}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 h-8 text-xs"
                              onClick={() => copyUrl(file.name)}
                            >
                              <Copy className="h-3 w-3 mr-1" /> Copy URL
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(file.name)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}