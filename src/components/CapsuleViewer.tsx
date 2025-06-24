import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Clock, User, Users, Image, Video, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Capsule {
  id: string;
  title: string;
  message: string;
  unlock_date: string;
  mode: 'solo' | 'friend';
  theme: string;
  is_opened: boolean;
  created_at: string;
  media_url?: string;
  media_type?: string;
  recipient?: {
    username: string;
    full_name: string;
  };
  sender?: {
    username: string;
    full_name: string;
  };
}

interface CapsuleViewerProps {
  capsule: Capsule | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onDelete?: () => void;
}

const CapsuleViewer = ({ capsule, isOpen, onClose, currentUserId, onDelete }: CapsuleViewerProps) => {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mark capsule as opened on open
  useEffect(() => {
    const markCapsuleAsOpened = async () => {
      if (capsule && isOpen && !capsule.is_opened) {
        try {
          const { error } = await supabase
            .from('capsules')
            .update({ is_opened: true, opened_at: new Date().toISOString() })
            .eq('id', capsule.id);

          if (error) {
            console.error('Error updating capsule opened status:', error);
          }
        } catch (error) {
          console.error('Error marking capsule as opened:', error);
        }
      }
    };

    markCapsuleAsOpened();
  }, [capsule, isOpen]);

  if (!capsule) return null;

  const getThemeGradient = (theme: string) => {
    const themes = {
      gradient: 'from-purple-500 to-pink-500',
      sunset: 'from-orange-500 to-red-500',
      ocean: 'from-blue-500 to-teal-500',
      forest: 'from-green-500 to-emerald-500',
      cosmic: 'from-indigo-500 to-purple-500',
    };
    return themes[theme as keyof typeof themes] || themes.gradient;
  };

  const unlockDate = new Date(capsule.unlock_date);
  const isFromCurrentUser = capsule.sender?.username === currentUserId;

  const handleDeleteCapsule = async () => {
    try {
      const { error } = await supabase
        .from('capsules')
        .delete()
        .eq('id', capsule.id);

      if (error) throw error;

      toast({
        title: 'Capsule deleted',
        description: 'Your capsule has been successfully deleted.',
      });

      setShowDeleteConfirm(false);
      onClose();
      if (onDelete) onDelete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete capsule',
        variant: 'destructive',
      });
    }
  };

  const getMediaUrl = (mediaPath: string) => {
    if (mediaPath.startsWith('http')) return mediaPath;
    const { data } = supabase.storage.from('capsule-media').getPublicUrl(mediaPath);
    return data.publicUrl;
  };

  return (
    <>
      {/* Main Capsule Viewer Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border-purple-400/30 border rounded-xl backdrop-blur-md bg-black/80 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            transition: 'all 0.3s ease',
          }}
        >
          <DialogTitle className="sr-only">Capsule Viewer - {capsule.title}</DialogTitle>

          <div className="absolute right-4 top-4 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="text-center space-y-4 pt-8">
              <div className={`h-3 w-full bg-gradient-to-r ${getThemeGradient(capsule.theme)} rounded-full pulse-glow`} />

              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center pulse-glow">
                <Heart className="w-10 h-10 text-white animate-pulse" />
              </div>

              <div className="space-y-2">
                <CardTitle className="text-3xl gradient-text text-glow">{capsule.title}</CardTitle>

                <div className="flex items-center justify-center space-x-4">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400">
                    {capsule.mode === 'solo' ? (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        Solo Capsule
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3 mr-1" />
                        Friend Capsule
                      </>
                    )}
                  </Badge>

                  <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Unlocked!
                  </Badge>
                </div>

                {capsule.mode === 'friend' && (
                  <p className="text-gray-300">
                    {isFromCurrentUser
                      ? `To: ${capsule.recipient?.full_name || 'Someone Special'}`
                      : `From: ${capsule.sender?.full_name || 'Anonymous'}`}
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Unlock Information */}
              <div className="glow-card rounded-lg p-4 border-l-4 border-green-400">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    Unlocked on {format(unlockDate, 'PPP')} at {format(unlockDate, 'p')}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Created on {format(new Date(capsule.created_at), 'PPP')}</p>
              </div>

              {/* Message Content */}
              <div className="glow-card rounded-lg p-6 border-l-4 border-purple-400">
                <h3 className="text-lg font-semibold text-white mb-4 text-glow">Your Message:</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{capsule.message}</p>
              </div>

              {/* Media Content */}
              {capsule.media_url && (
                <div className="glow-card rounded-lg p-6 border-l-4 border-pink-400">
                  <h3 className="text-lg font-semibold text-white mb-4 text-glow flex items-center">
                    {capsule.media_type?.startsWith('image') ? (
                      <>
                        <Image className="w-5 h-5 mr-2" />
                        Attached Photo:
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5 mr-2" />
                        Attached Video:
                      </>
                    )}
                  </h3>

                  {capsule.media_type?.startsWith('image') ? (
                    <div className="flex justify-center">
                      <img
                        src={getMediaUrl(capsule.media_url)}
                        alt="Capsule media"
                        className="max-w-full max-h-96 rounded-lg shadow-lg object-contain"
                        onError={(e) => {
                          console.error('Image failed to load:', capsule.media_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <video
                        src={getMediaUrl(capsule.media_url)}
                        controls
                        className="max-w-full max-h-96 rounded-lg shadow-lg"
                        onError={(e) => {
                          console.error('Video failed to load:', capsule.media_url);
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4">
                <Button onClick={onClose} className="glow-button text-white px-8">
                  <Heart className="w-4 h-4 mr-2" />
                  Close Capsule
                </Button>

                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="border-red-400 text-red-300 hover:bg-red-400/10 px-8"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Capsule
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(false)}>
        <DialogContent className="max-w-md bg-black/90 border border-purple-600 rounded-lg shadow-lg">
            <DialogTitle className="text-white text-xl font-semibold mb-4">Confirm Delete</DialogTitle>
            <p className="mb-6 text-gray-300">
            Are you sure you want to delete this capsule? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
            <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="text-purple-400 border-purple-500 hover:bg-purple-700/20"
            >
                Cancel
            </Button>
            <Button
                variant="destructive"
                onClick={handleDeleteCapsule}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                Delete
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    </>
  );
};

export default CapsuleViewer;
