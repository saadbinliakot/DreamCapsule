import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Clock, Calendar, Plus, Settings, Star, Lock, Users, User, Home, UserCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateCapsuleModal from './CreateCapsuleModal';
import CapsuleViewer from './CapsuleViewer';
import { format } from 'date-fns';

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
  timeLeft?: string;
  isUnlocked?: boolean;
}

const EnhancedDashboard = () => {
  const { user, signOut } = useAuth();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [mode, setMode] = useState<'solo' | 'friend'>('solo');

  useEffect(() => {
    if (user) {
      fetchCapsules();
    }
  }, [user, mode]);

  useEffect(() => {
    const updateTimeLeft = () => {
      setCapsules(prev => prev.map(capsule => {
        const now = new Date();
        const unlockDate = new Date(capsule.unlock_date);
        const timeDiff = unlockDate.getTime() - now.getTime();
        const isUnlocked = timeDiff <= 0;
        
        if (isUnlocked) {
          return { ...capsule, timeLeft: 'Ready to unlock!', isUnlocked: true };
        }
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        if (days > 0) {
          return { ...capsule, timeLeft: `${days}d ${hours}h ${minutes}m`, isUnlocked: false };
        } else if (hours > 0) {
          return { ...capsule, timeLeft: `${hours}h ${minutes}m ${seconds}s`, isUnlocked: false };
        } else if (minutes > 0) {
          return { ...capsule, timeLeft: `${minutes}m ${seconds}s`, isUnlocked: false };
        } else {
          return { ...capsule, timeLeft: `${seconds}s`, isUnlocked: false };
        }
      }));
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000); // Update every second for more precision
    return () => clearInterval(interval);
  }, []);

  const fetchCapsules = async () => {
    try {
      const { data, error } = await supabase
        .from('capsules')
        .select(`
          *,
          recipient:profiles!capsules_recipient_id_fkey(username, full_name),
          sender:profiles!capsules_sender_id_fkey(username, full_name)
        `)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .eq('mode', mode)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
        const typedData = (data || []).map(capsule => ({
          ...capsule,
          mode: capsule.mode as 'solo' | 'friend'
        }));
      
      setCapsules(typedData);
    } catch (error) {
      console.error('Error fetching capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCapsuleClick = (capsule: Capsule) => {
    if (capsule.isUnlocked) {
      setSelectedCapsule(capsule);
      setShowViewer(true);
    }
  };

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

  const handleCapsuleDeleted = () => {
    fetchCapsules(); // Refresh the capsules list
  };

  const filteredCapsules = capsules.filter(capsule => capsule.mode === mode);

  if (loading) {
    return (
      <div className="min-h-screen dark-theme flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your capsules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-theme relative overflow-hidden">
      {/* Floating Particles */}
      <div className="floating-particle"></div>
      <div className="floating-particle"></div>
      <div className="floating-particle"></div>
      <div className="floating-particle"></div>
      <div className="floating-particle"></div>
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold gradient-text">Dream Capsule</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>

              <Link to="/friends">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Friends
                </Button>
              </Link>
              <Link to="/memory-wall">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Star className="w-4 h-4 mr-2" />
                  Memories
                </Button>
              </Link>
              <Button variant="outline" onClick={signOut} className="border-purple-400 text-purple-300 hover:bg-purple-400/10">
                <Settings className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 p-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold gradient-text text-glow mb-4">
                Your Dream Capsules
              </h1>
              <p className="text-gray-300 text-lg">
                {filteredCapsules.length} {mode} capsule{filteredCapsules.length !== 1 ? 's' : ''} waiting to be unlocked
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="glow-button text-white px-8 py-4 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Capsule
              </Button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="glow-card rounded-full p-1">
              <Button
                variant={mode === 'solo' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('solo')}
                className={`rounded-full px-6 ${
                  mode === 'solo' 
                    ? 'glow-button text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Solo Mode
              </Button>
              <Button
                variant={mode === 'friend' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('friend')}
                className={`rounded-full px-6 ${
                  mode === 'friend' 
                    ? 'glow-button text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Friend Mode
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glow-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Total Capsules</p>
                    <p className="text-4xl font-bold text-white text-glow">{filteredCapsules.length}</p>
                  </div>
                  <Heart className="h-12 w-12 text-purple-400 icon-glow" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glow-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Ready to Unlock</p>
                    <p className="text-4xl font-bold text-white text-glow">
                      {filteredCapsules.filter(c => new Date(c.unlock_date) <= new Date()).length}
                    </p>
                  </div>
                  <Clock className="h-12 w-12 text-pink-400 icon-glow" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glow-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">This Month</p>
                    <p className="text-4xl font-bold text-white text-glow">
                      {filteredCapsules.filter(c => {
                        const created = new Date(c.created_at);
                        const now = new Date();
                        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <Calendar className="h-12 w-12 text-blue-400 icon-glow" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capsules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapsules.map((capsule) => (
              <Card 
                key={capsule.id} 
                className={`glow-card hover:scale-105 transition-all duration-300 group ${
                  capsule.isUnlocked ? 'cursor-pointer ring-2 ring-green-400/50' : ''
                }`}
                onClick={() => handleCapsuleClick(capsule)}
              >
                <CardHeader className="pb-3">
                  <div className={`h-2 w-full bg-gradient-to-r ${getThemeGradient(capsule.theme)} rounded-full mb-4 pulse-glow`} />
                  
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white text-glow">
                      {capsule.title}
                    </CardTitle>
                    <Badge variant={capsule.mode === 'solo' ? 'secondary' : 'outline'} className={`text-xs ${
                      capsule.isUnlocked 
                        ? 'bg-green-500/20 text-green-300 border-green-400' 
                        : 'bg-purple-500/20 text-purple-300 border-purple-400'
                    }`}>
                      {capsule.isUnlocked ? (
                        <>
                          <Heart className="w-3 h-3 mr-1" />
                          Unlocked
                        </>
                      ) : (
                        <>
                          {capsule.mode === 'solo' ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Solo
                            </>
                          ) : (
                            <>
                              <Users className="w-3 h-3 mr-1" />
                              Friend
                            </>
                          )}
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  {capsule.mode === 'friend' && (
                    <p className="text-sm text-gray-400">
                      {capsule.recipient?.username === user?.user_metadata?.username 
                        ? `From: ${capsule.sender?.username || 'Anonymous'}`
                        : `To: ${capsule.recipient?.username || 'Someone Special'}`
                      }
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {capsule.isUnlocked ? (
                    <div className="text-center py-4">
                      <Heart className="w-12 h-12 text-green-400 mx-auto mb-3 icon-glow animate-pulse" />
                      <p className="text-green-300 font-medium text-lg mb-2">Capsule Unlocked!</p>
                      <p className="text-gray-400 text-sm">Click to view your message</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4 icon-glow" />
                      <p className="text-purple-300 font-medium text-lg mb-2">Capsule Locked</p>
                      <p className="text-gray-400 text-sm">This message is sealed until the unlock time</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className={`font-medium text-glow ${capsule.isUnlocked ? 'text-green-400' : 'text-purple-400'}`}>
                        {capsule.timeLeft}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      Unlocks: {format(new Date(capsule.unlock_date), 'PPP')} at {format(new Date(capsule.unlock_date), 'p')}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Created {new Date(capsule.created_at).toLocaleDateString()}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`${
                          capsule.isUnlocked 
                            ? 'text-green-400 hover:text-green-300 hover:bg-green-400/10' 
                            : 'text-purple-400 hover:text-purple-300 hover:bg-purple-400/10'
                        }`}
                        disabled={!capsule.isUnlocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCapsuleClick(capsule);
                        }}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        {capsule.isUnlocked ? 'Open' : 'Locked'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Capsule Card */}
            <Card 
              className="border-2 border-dashed border-purple-400/30 hover:border-purple-400 transition-colors cursor-pointer group glow-card"
              onClick={() => setShowCreateModal(true)}
            >
              <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-64">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center pulse-glow">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 text-glow">Create New Capsule</h3>
                  <p className="text-sm text-gray-400">
                    Start crafting your next magical message to the future
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateCapsuleModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <CapsuleViewer
        capsule={selectedCapsule}
        isOpen={showViewer}
        onClose={() => {
          setShowViewer(false);
          setSelectedCapsule(null);
        }}
        currentUserId={user?.user_metadata?.username}
        onDelete={handleCapsuleDeleted}
      />
    </div>
  );
};

export default EnhancedDashboard;