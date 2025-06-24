import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Star, Eye, MessageSquare, Home, UserCheck, Settings, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PublicCapsule {
  id: string;
  authorName: string;
  recipientName: string;
  message: string;
  unlockDate: Date;
  theme: string;
  likes: number;
  views: number;
  isLiked: boolean;
}

const MemoryWall = () => {
  const { user, signOut } = useAuth();
  const [capsules, setCapsules] = useState<PublicCapsule[]>([
    {
      id: '1',
      authorName: 'Sarah M.',
      recipientName: 'My Daughter',
      message: 'On your 18th birthday, I want you to know how proud I am of the amazing person you\'ve become. Remember that day we spent at the beach collecting shells? You said you wanted to keep them forever. That\'s how I feel about every moment with you - precious and eternal. Chase your dreams, my love.',
      unlockDate: new Date('2024-03-15'),
      theme: 'sunset',
      likes: 247,
      views: 1834,
      isLiked: false,
    },
    {
      id: '2',
      authorName: 'Michael R.',
      recipientName: 'Future Me',
      message: 'Hey buddy, remember this moment. You just finished your first marathon! Your legs are killing you but your heart is full. Don\'t forget this feeling of accomplishment. When life gets tough (and it will), remember you can do hard things. The best is yet to come.',
      unlockDate: new Date('2024-06-10'),
      theme: 'gradient',
      likes: 156,
      views: 892,
      isLiked: true,
    },
    {
      id: '3',
      authorName: 'Elena V.',
      recipientName: 'My Best Friend',
      message: 'Happy 30th birthday, bestie! Do you remember when we promised we\'d still be friends when we were old and gray? Well, we\'re not old yet, but I found a few gray hairs! 😂 Thank you for being my constant through every season of life. Here\'s to 30 more years of adventures.',
      unlockDate: new Date('2024-08-22'),
      theme: 'ocean',
      likes: 89,
      views: 456,
      isLiked: false,
    },
    {
      id: '4',
      authorName: 'David L.',
      recipientName: 'My Son',
      message: 'Today you took your first steps! Mom and I were so excited we both cried happy tears. By the time you read this, you\'ll be graduating high school. I hope you remember to take life one step at a time, just like you did today. We love you more than all the stars.',
      unlockDate: new Date('2024-05-03'),
      theme: 'cosmic',
      likes: 312,
      views: 2156,
      isLiked: false,
    },
  ]);

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

  const handleLike = (capsuleId: string) => {
    setCapsules(prev => prev.map(capsule => 
      capsule.id === capsuleId 
        ? { 
            ...capsule, 
            isLiked: !capsule.isLiked,
            likes: capsule.isLiked ? capsule.likes - 1 : capsule.likes + 1
          }
        : capsule
    ));
  };

  const handleLoadMore = () => {
    // Simulate loading more memories
    console.log('Loading more memories...');
  };

  const handleCreateOwn = () => {
    // Navigate to dashboard or open create modal
    window.location.href = '/dashboard';
  };

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
              <span className="text-xl font-bold gradient-text">Dream Capsules</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              {/* {user && (
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Dashboard
                  </Button>
                </Link>
              )} */}
              {user && (
                <Link to="/friends">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Friends
                  </Button>
                </Link>
              )}
              <Link to="/memory-wall">
                <Button variant="ghost" className="text-purple-400 hover:bg-white/10">
                  <Star className="w-4 h-4 mr-2" />
                  Memories
                </Button>
              </Link>
              {user ? (
                <Button variant="outline" onClick={signOut} className="border-purple-400 text-purple-300 hover:bg-purple-400/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth">
                  <Button className="glow-button text-white">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text text-glow mb-4">
              Memory Wall
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover beautiful memories and heartfelt messages that people have chosen to share with the world. 
              Each capsule represents a moment of love, hope, and human connection.
            </p>
          </div>

          {/* Filter/Sort Options */}
          <div className="flex justify-center mb-8">
            <div className="glow-card rounded-full p-1">
              <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10">
                Most Recent
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10">
                Most Liked
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10">
                Most Viewed
              </Button>
            </div>
          </div>

          {/* Capsules */}
          <div className="space-y-8">
            {capsules.map((capsule) => (
              <Card key={capsule.id} className="glow-card hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className={`h-2 w-full bg-gradient-to-r ${getThemeGradient(capsule.theme)} rounded-full mb-4 pulse-glow`} />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-white text-glow font-bold">
                        From {capsule.authorName} to {capsule.recipientName}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Unlocked {capsule.unlockDate.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400">
                      Public Memory
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="glow-card rounded-lg p-6 border-l-4 border-purple-400">
                    <p className="text-gray-300 leading-relaxed italic">
                      "{capsule.message}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {capsule.views.toLocaleString()} views
                        </span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(capsule.id)}
                        className={`flex items-center space-x-2 hover:bg-pink-500/10 ${
                          capsule.isLiked ? 'text-pink-400' : 'text-gray-400'
                        }`}
                      >
                        <Heart 
                          className={`w-4 h-4 ${capsule.isLiked ? 'fill-current' : ''}`} 
                        />
                        <span className="text-sm">
                          {capsule.likes} {capsule.likes === 1 ? 'like' : 'likes'}
                        </span>
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
              className="border-purple-400 text-purple-300 hover:bg-purple-400/10"
            >
              Load More Memories
            </Button>
          </div>

          {/* Floating Create Button */}
          <div className="fixed bottom-8 right-8">
            <Button 
              size="lg"
              onClick={handleCreateOwn}
              className="glow-button text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Heart className="w-5 h-5 mr-2" />
              Create Your Own
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryWall;
