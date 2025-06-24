

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Check, X, Search, Heart, Home, Settings, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

interface FriendRequest {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender: Profile;
  receiver: Profile;
}

interface Friendship {
  id: string;
  created_at: string;
  user1: Profile;
  user2: Profile;
}

const FriendSystem = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchFriendRequests();
      fetchFriends();
    }
  }, [user]);

  const fetchFriendRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:profiles!friend_requests_sender_id_fkey(id, username, full_name, avatar_url),
          receiver:profiles!friend_requests_receiver_id_fkey(id, username, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure proper typing
      const typedData = (data || []).map(request => ({
        ...request,
        status: request.status as 'pending' | 'accepted' | 'rejected'
      }));
      
      setFriendRequests(typedData);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      // const { data, error } = await supabase
      //   .from('friendships')
      //   .select(`
      //     *,
      //     user1:profiles!friendships_user1_id_fkey(id, username, full_name, avatar_url),
      //     user2:profiles!friendships_user2_id_fkey(id, username, full_name, avatar_url)
      //   `)
      //   .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      // setFriends(data || []);
      const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        user1:profiles!friendships_user1_id_fkey(id, username, full_name, avatar_url),
        user2:profiles!friendships_user2_id_fkey(id, username, full_name, avatar_url)
      `)
      .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
      .order('created_at', { ascending: false });

    // ✅ Optional: filter out any entries where one of the user objects is null (in case of ghost friendships)
    const filtered = (data || []).filter(f => f.user1 && f.user2);
    setFriends(filtered);

    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (receiverId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user?.id,
          receiver_id: receiverId
        });

      if (error) throw error;

      toast({
        title: "Friend request sent!",
        description: "Your friend request has been sent successfully."
      });

      fetchFriendRequests();
      setSearchResults([]);
      setSearchQuery('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send friend request",
        variant: "destructive"
      });
    }
  };

  const respondToFriendRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? "Friend request accepted!" : "Friend request declined",
        description: status === 'accepted' 
          ? "You are now friends!" 
          : "The friend request has been declined."
      });

      fetchFriendRequests();
      if (status === 'accepted') {
        fetchFriends();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to respond to friend request",
        variant: "destructive"
      });
    }
  };

  const getAvatarUrl = (profile: Profile) => {
    return profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`;
  };

  const handleRemoveFriend = (friendshipId: string, friendName: string) => {
    setFriendToRemove({ id: friendshipId, name: friendName });
  };

  const confirmRemoveFriend = async () => {
    if (!friendToRemove) return;

    try {
      const trimmedId = friendToRemove.id.trim();
      console.log('Trying to delete friendship with ID:', trimmedId);

      // Check if friendship exists
      const { data: existingFriendship, error: fetchError } = await supabase
        .from('friendships')
        .select('*')
        .eq('id', trimmedId)
        .single();

      if (fetchError) {
        throw new Error(`Friendship with ID ${trimmedId} not found: ${fetchError.message}`);
      }

      console.log('Friendship found:', existingFriendship);

      // Proceed to delete
      const { data, error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', trimmedId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("No rows deleted");
      }

      toast({
        title: "Friend removed",
        description: `${friendToRemove.name} has been removed from your friends list.`,
      });

      setFriends(prev => prev.filter(friend => friend.id !== trimmedId));
      setFriendToRemove(null);

      await fetchFriends();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove friend",
        variant: "destructive"
      });
    }
  };


  // const confirmRemoveFriend = async () => {
  //   if (!friendToRemove) return;

  //   try {
  //     console.log("Attempting to delete friendship with ID:", friendToRemove.id);

  //     const { data, error } = await supabase
  //       .from('friendships')
  //       .delete()
  //       .eq('id', friendToRemove.id)
  //       .select();

  //     if (error) {
  //       console.error("Error deleting friendship:", error);
  //       throw error;
  //     }

  //     console.log("Delete successful, deleted rows:", data);

  //     toast({
  //       title: "Friend removed",
  //       description: `${friendToRemove.name} has been removed from your friends list.`,
  //     });

  //     setFriends(prev => prev.filter(friend => friend.id !== friendToRemove.id));
  //     setFriendToRemove(null);

  //     // Refresh friends list from DB to sync UI
  //     await fetchFriends();

  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to remove friend",
  //       variant: "destructive",
  //     });
  //   }
  // };


  const pendingRequests = friendRequests.filter(req => req.status === 'pending' && req.receiver.id === user?.id);
  const sentRequests = friendRequests.filter(req => req.status === 'pending' && req.sender.id === user?.id);

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
              {/* <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Dashboard
                </Button>
              </Link> */}
              <Link to="/friends">
                <Button variant="ghost" className="text-purple-400 hover:bg-white/10">
                  <Users className="w-4 h-4 mr-2" />
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold gradient-text text-glow mb-4">
              Friend System
            </h1>
            <p className="text-gray-300 text-lg">
              Connect with friends to share your dream capsules
            </p>
          </div>

          {/* Search Section */}
          <Card className="glow-card">
            <CardHeader>
              <CardTitle className="flex items-center text-bright text-glow text-xl">
                <Search className="w-5 h-5 mr-2" />
                Find Friends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search by username or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                  className="flex-1 bg-black/20 border-purple-400/30 text-white focus:border-purple-400"
                />
                <Button onClick={searchUsers} disabled={loading} className="glow-button">
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-bright-secondary">Search Results</h3>
                  {searchResults.map((profile) => {
                    const hasRequest = friendRequests.some(req => 
                      (req.sender.id === user?.id && req.receiver.id === profile.id) ||
                      (req.receiver.id === user?.id && req.sender.id === profile.id)
                    );
                    const isFriend = friends.some(friendship =>
                      friendship.user1.id === profile.id || friendship.user2.id === profile.id
                    );

                    return (
                      <div key={profile.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg glow-card">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getAvatarUrl(profile)}
                            alt={profile.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-bright">{profile.full_name}</p>
                            <p className="text-sm text-gray-400">@{profile.username}</p>
                          </div>
                        </div>
                        {!hasRequest && !isFriend && (
                          <Button
                            size="sm"
                            onClick={() => sendFriendRequest(profile.id)}
                            className="glow-button"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Add Friend
                          </Button>
                        )}
                        {hasRequest && (
                          <Badge variant="outline" className="border-purple-400 text-purple-300">Request Sent</Badge>
                        )}
                        {isFriend && (
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                            <Heart className="w-3 h-3 mr-1" />
                            Friends
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Friend Requests */}
          {pendingRequests.length > 0 && (
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-bright text-glow text-xl">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Friend Requests ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg glow-card">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getAvatarUrl(request.sender)}
                          alt={request.sender.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-bright">{request.sender.full_name}</p>
                          <p className="text-sm text-gray-400">@{request.sender.username}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => respondToFriendRequest(request.id, 'accepted')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respondToFriendRequest(request.id, 'rejected')}
                          className="border-red-400 text-red-300 hover:bg-red-400/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Friends List */}
          <Card className="glow-card">
            <CardHeader>
              <CardTitle className="flex items-center text-bright text-glow text-xl">
                <Users className="w-5 h-5 mr-2" />
                Your Friends ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {friends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No friends yet. Start by searching for people above!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {friends.map((friendship) => {
                    const friend = friendship.user1.id === user?.id ? friendship.user2 : friendship.user1;
                    return (
                      <div key={friendship.id} className="flex items-center justify-between p-3 glow-card rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getAvatarUrl(friend)}
                            alt={friend.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-bright">{friend.full_name}</p>
                            <p className="text-sm text-gray-400">@{friend.username}</p>
                            <p className="text-xs text-gray-500">
                              Friends since {new Date(friendship.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-5 h-5 text-pink-400 icon-glow" />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFriend(friendship.id, friend.full_name || friend.username)}
                            className="border-red-400 text-red-300 hover:bg-red-400/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sent Requests */}
          {sentRequests.length > 0 && (
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="text-sm text-bright-secondary">
                  Sent Requests ({sentRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <img
                          src={getAvatarUrl(request.receiver)}
                          alt={request.receiver.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-bright">{request.receiver.username}</span>
                      </div>
                      <Badge variant="outline" className="border-purple-400 text-purple-300">Pending</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Remove Friend Confirmation Dialog */}
      <AlertDialog open={!!friendToRemove} onOpenChange={() => setFriendToRemove(null)}>
        <AlertDialogContent className="bg-gray-900 border-purple-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-bright">Remove Friend</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to remove {friendToRemove?.name} from your friends list? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setFriendToRemove(null)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveFriend}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remove Friend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FriendSystem;
