import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Heart, Calendar as CalendarIcon, Image, User, Lock, Globe, Upload, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Friend {
  id: string;
  username: string;
  full_name: string;
}

const CreateCapsuleModal = ({ isOpen, onClose }: CreateCapsuleModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date>();
  const [unlockTime, setUnlockTime] = useState('12:00');
  const [mode, setMode] = useState<'solo' | 'friend'>('solo');
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [theme, setTheme] = useState('gradient');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      fetchFriends();
    }
  }, [isOpen, user]);

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          user1:profiles!friendships_user1_id_fkey(id, username, full_name),
          user2:profiles!friendships_user2_id_fkey(id, username, full_name)
        `)
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`);

      if (error) throw error;

      const friendsList = (data || []).map(friendship => {
        return friendship.user1.id === user?.id ? friendship.user2 : friendship.user1;
      });

      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !unlockDate || !message.trim()) return;

    setLoading(true);
    
    try {
      // Combine date and time
      const [hours, minutes] = unlockTime.split(':').map(Number);
      const combinedDateTime = new Date(unlockDate);
      combinedDateTime.setHours(hours, minutes, 0, 0);

      const capsuleData = {
        title: title.trim() || 'Untitled Capsule',
        message: message.trim(),
        unlock_date: combinedDateTime.toISOString(),
        mode,
        theme,
        sender_id: user.id,
        recipient_id: mode === 'friend' ? selectedFriend : null,
        is_opened: false
      };

      const { error } = await supabase
        .from('capsules')
        .insert(capsuleData);

      if (error) throw error;

      toast({
        title: "Capsule created successfully!",
        description: `Your ${mode} capsule has been locked away safely and will unlock on ${format(combinedDateTime, 'PPP')} at ${unlockTime}.`
      });

      onClose();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error creating capsule",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setUnlockDate(undefined);
    setUnlockTime('12:00');
    setMode('solo');
    setSelectedFriend('');
    setTheme('gradient');
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border-purple-400/30 border rounded-xl backdrop-blur-md bg-black/80 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center pulse-glow">
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
            <CardTitle className="text-2xl gradient-text text-glow">
              Create Your Dream Capsule
            </CardTitle>
            <p className="text-gray-300">
              Craft a magical message that will be delivered to the future
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mode Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300 font-medium">Capsule Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={mode === 'solo' ? 'default' : 'outline'}
                    onClick={() => setMode('solo')}
                    className={mode === 'solo' ? 'glow-button text-white' : 'border-purple-400 text-purple-300 hover:bg-purple-400/10'}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Solo
                  </Button>
                  <Button
                    type="button"
                    variant={mode === 'friend' ? 'default' : 'outline'}
                    onClick={() => setMode('friend')}
                    className={mode === 'friend' ? 'glow-button text-white' : 'border-purple-400 text-purple-300 hover:bg-purple-400/10'}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Friend
                  </Button>
                </div>
              </div>

              {/* Friend Selection */}
              {mode === 'friend' && (
                <div className="space-y-2">
                  <Label className="text-gray-300 font-medium">
                    Send to Friend <span className="text-red-400">*</span>
                  </Label>
                  <Select value={selectedFriend} onValueChange={setSelectedFriend}>
                    <SelectTrigger className="bg-black/20 border-purple-400/30 text-white focus:border-purple-400">
                      <SelectValue placeholder="Choose a friend" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-400/30">
                      {friends.map((friend) => (
                        <SelectItem key={friend.id} value={friend.id} className="text-white hover:bg-purple-400/20">
                          {friend.full_name} (@{friend.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {friends.length === 0 && (
                    <p className="text-sm text-gray-400">
                      No friends found. Add friends first to send them capsules!
                    </p>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300 font-medium">
                  Title <span className="text-gray-400">(Optional)</span>
                </Label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="title"
                    type="text"
                    placeholder="Give your capsule a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="pl-10 bg-black/20 border-purple-400/30 text-white focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-300 font-medium">
                  Your Message <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Write your heartfelt message here... What do you want to say to the future?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-32 bg-black/20 border-purple-400/30 text-white focus:border-purple-400 resize-none"
                  required
                />
                <div className="text-sm text-gray-400">
                  {message.length}/1000 characters
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-gray-300 font-medium">
                  Add a Photo or Video <span className="text-gray-400">(Optional)</span>
                </Label>
                <div className="border-2 border-dashed border-purple-400/30 rounded-lg p-6 text-center hover:border-purple-400 transition-colors glow-card">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-300">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </div>
                    <div className="text-xs text-gray-400">
                      PNG, JPG, MP4 up to 10MB
                    </div>
                  </label>
                </div>
              </div>

              {/* Unlock Date and Time */}
              <div className="space-y-4">
                <Label className="text-gray-300 font-medium">
                  When should this unlock? <span className="text-red-400">*</span>
                </Label>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-black/20 border-purple-400/30 text-white hover:bg-purple-400/10",
                            !unlockDate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {unlockDate ? format(unlockDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black border-purple-400/30">
                        <Calendar
                          mode="single"
                          selected={unlockDate}
                          onSelect={setUnlockDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="text-white pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="time"
                        value={unlockTime}
                        onChange={(e) => setUnlockTime(e.target.value)}
                        className="pl-10 bg-black/20 border-purple-400/30 text-white focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300 font-medium">Choose a Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="bg-black/20 border-purple-400/30 text-white focus:border-purple-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-purple-400/30">
                    <SelectItem value="gradient" className="text-white hover:bg-purple-400/20">Purple Dreams</SelectItem>
                    <SelectItem value="sunset" className="text-white hover:bg-purple-400/20">Golden Sunset</SelectItem>
                    <SelectItem value="ocean" className="text-white hover:bg-purple-400/20">Ocean Breeze</SelectItem>
                    <SelectItem value="forest" className="text-white hover:bg-purple-400/20">Enchanted Forest</SelectItem>
                    <SelectItem value="cosmic" className="text-white hover:bg-purple-400/20">Cosmic Journey</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full glow-button text-white py-6 text-lg"
                disabled={loading || !message.trim() || !unlockDate || (mode === 'friend' && !selectedFriend)}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Your Capsule...</span>
                  </div>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Lock Away This Memory
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCapsuleModal;