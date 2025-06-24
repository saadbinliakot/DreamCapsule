// import { supabase } from '@/integrations/supabase/client';
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Heart, Clock, Calendar, Plus, Settings, Star, Lock } from 'lucide-react';

// interface Capsule {
//   id: string;
//   recipientName: string;
//   message: string;
//   unlockDate: Date;
//   isPrivate: boolean;
//   theme: string;
//   createdDate: Date;
//   timeLeft?: string;
//   isReadyToUnlock?: boolean;
//   isOpened?: boolean;
//   is_opened?: boolean; 
// }

// const Dashboard = () => {
//   const [capsules, setCapsules] = useState<Capsule[]>([
//     {
//       id: '1',
//       recipientName: 'Future Me',
//       message: 'Dear future self, I hope you remember this moment of pure happiness...',
//       unlockDate: new Date('2025-01-01'),
//       isPrivate: true,
//       theme: 'gradient',
//       createdDate: new Date('2024-06-20'),
//     },
//     {
//       id: '2',
//       recipientName: 'Mom',
//       message: 'Happy birthday Mom! I hope this message finds you surrounded by love...',
//       unlockDate: new Date('2024-12-25'),
//       isPrivate: true,
//       theme: 'sunset',
//       createdDate: new Date('2024-06-15'),
//     },
//   ]);

//   // Calculate time remaining for each capsule

// useEffect(() => {
//   const updateTimeLeft = () => {
//     setCapsules(prev => prev.map(capsule => {
//       const now = new Date();
//       const timeDiff = capsule.unlockDate.getTime() - now.getTime();

//       let timeLeft;
//       let isReadyToUnlock = false;

//       if (timeDiff <= 0) {
//         timeLeft = 'Ready to unlock!';
//         isReadyToUnlock = true;
//       } else {
//         const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//         timeLeft = days > 0 ? `${days}d ${hours}h ${minutes}m` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
//       }

//       console.log(`Capsule ${capsule.id}: timeDiff=${timeDiff}, isReadyToUnlock=${isReadyToUnlock}`);

//       return { ...capsule, timeLeft, isReadyToUnlock };
//     }));
//   };

//   updateTimeLeft();
//   const interval = setInterval(updateTimeLeft, 60000);
//   return () => clearInterval(interval);
// }, []);

//   const readyCount = capsules.filter(c => c.isReadyToUnlock && !c.is_opened).length;

//   // useEffect(() => {
//   //   const updateTimeLeft = () => {
//   //     setCapsules(prev => prev.map(capsule => {
//   //       const now = new Date();
//   //       const timeDiff = capsule.unlockDate.getTime() - now.getTime();
        
//   //       if (timeDiff <= 0) {
//   //         return { ...capsule, timeLeft: 'Ready to unlock!' };
//   //       }
        
//   //       const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//   //       const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   //       const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
//   //       if (days > 0) {
//   //         return { ...capsule, timeLeft: `${days}d ${hours}h ${minutes}m` };
//   //       } else if (hours > 0) {
//   //         return { ...capsule, timeLeft: `${hours}h ${minutes}m` };
//   //       } else {
//   //         return { ...capsule, timeLeft: `${minutes}m` };
//   //       }
//   //     }));
//   //   };

//   //   updateTimeLeft();
//   //   const interval = setInterval(updateTimeLeft, 60000); // Update every minute

//   //   return () => clearInterval(interval);
//   // }, []);
  
//   const handleUnlock = async (capsuleId: string) => {
//     const { error } = await supabase
//       .from('capsules')
//       .update({ is_opened: true })
//       .eq('id', capsuleId);
    

//     if (error) {
//       console.error("Unlock error:", error.message);
//       return;
//     }

//     // Update local state to reflect unlock
//     setCapsules(prevCapsules => prevCapsules.map(capsule => {
//       if (capsule.id === capsuleId) {
//         return { ...capsule, is_opened: true }; // or isOpened if you renamed it
//       }
//       return capsule;
//     }));

//     alert("Capsule unlocked! 🎉");
//   };

//   const getThemeGradient = (theme: string) => {
//     const themes = {
//       gradient: 'from-purple-500 to-pink-500',
//       sunset: 'from-orange-500 to-red-500',
//       ocean: 'from-blue-500 to-teal-500',
//       forest: 'from-green-500 to-emerald-500',
//       cosmic: 'from-indigo-500 to-purple-500',
//     };
//     return themes[theme as keyof typeof themes] || themes.gradient;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Your Dream Capsules
//             </h1>
//             {/* <p className="text-gray-600 mt-2">
//               {capsules.length} capsule{capsules.length !== 1 ? 's' : ''} waiting to be unlocked
//             </p> */}
//             <p className="text-3xl font-bold text-gray-900">{readyCount}</p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <Button variant="outline" className="border-purple-200">
//               <Settings className="w-4 h-4 mr-2" />
//               Settings
//             </Button>
//             <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
//               <Plus className="w-4 h-4 mr-2" />
//               New Capsule
//             </Button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Capsules</p>
//                   <p className="text-3xl font-bold text-gray-900">{capsules.length}</p>
//                 </div>
//                 <Heart className="h-12 w-12 text-purple-500" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-100 to-blue-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Ready to Unlock</p>
//                   <p className="text-3xl font-bold text-gray-900">0</p>
//                 </div>
//                 <Clock className="h-12 w-12 text-pink-500" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-purple-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">This Month</p>
//                   <p className="text-3xl font-bold text-gray-900">2</p>
//                 </div>
//                 <Calendar className="h-12 w-12 text-blue-500" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Capsules Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {capsules.map((capsule) => (
//             <Card key={capsule.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
//               <CardHeader className="pb-3">
//                 <div className={`h-2 w-full bg-gradient-to-r ${getThemeGradient(capsule.theme)} rounded-full mb-4`} />                
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-lg text-white font-semibold drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
//                     To: {capsule.recipientName || 'Someone Special'}
//                   </CardTitle>
//                   <Badge variant={capsule.isPrivate ? 'secondary' : 'outline'} className="text-xs">
//                     <Lock className="w-3 h-3 mr-1" />
//                     {capsule.isPrivate ? 'Private' : 'Public'}
//                   </Badge>
//                 </div>
//               </CardHeader>
              
//               <CardContent className="space-y-4">
//                 <p className="text-white text-sm line-clamp-3">
//                   {capsule.message}
//                 </p>
                
//                 <div className="space-y-2">
//                   <div className="flex items-center text-sm text-gray-500">
//                     <Clock className="w-4 h-4 mr-2" />
//                     <span className="font-medium text-purple-600">
//                       {capsule.timeLeft}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center text-sm text-gray-500">
//                     <Calendar className="w-4 h-4 mr-2" />
//                     Unlocks: {capsule.unlockDate.toLocaleDateString()}
//                   </div>
//                 </div>
                
//                 <div className="pt-2 border-t border-gray-100">
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-400">
//                       Created {capsule.createdDate.toLocaleDateString()}
//                     </span>

//                     {capsule.isReadyToUnlock && !capsule.is_opened ? (
//                       <Button
//                         size="sm"
//                         className="bg-purple-600 hover:bg-purple-700 text-white"
//                         onClick={() => handleUnlock(capsule.id)}
//                       >
//                         Unlock Now
//                       </Button>
//                     ) : capsule.is_opened ? (
//                       <span className="text-xs text-green-500">Unlocked ✅</span>
//                     ) : (
//                       <span className="text-xs text-gray-400">{capsule.timeLeft}</span>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
          
//           {/* Add New Capsule Card */}
//           <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors cursor-pointer group">
//             <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-48">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
//                 <Plus className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-800 mb-2">Create New Capsule</h3>
//                 <p className="text-sm text-gray-500">
//                   Start crafting your next magical message to the future
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Calendar, Plus, Settings, Lock } from 'lucide-react';

interface Capsule {
  id: string;
  message: string;
  theme: string;
  unlockDate: Date; // UTC date with time
  createdDate: Date; // UTC date with time
  is_opened: boolean;
  recipientName: string;
  isPrivate: boolean;
  timeLeft?: string;
  isReadyToUnlock?: boolean;
}

// Parse date string **as UTC** — prevents local timezone shifts
function parseDateLocal(dateString: string): Date {
  // dateString like '2025-06-23'
  const [year, month, day] = dateString.split('-').map(Number);
  // month is 0-based in JS Date constructor
  return new Date(year, month - 1, day);
}

// Format date for display (local time)
const formatDate = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

const Dashboard = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  const fetchCapsules = async () => {
    const { data, error } = await supabase
      .from('capsules')
      .select(`
        id, message, theme, unlock_date, created_at, is_opened,
        mode,
        recipient:profiles!capsules_recipient_id_fkey(full_name)
      `);

    if (error) {
      console.error('Fetch error:', error.message);
      return;
    }

    const mappedCapsules: Capsule[] = (data || []).map((item: any) => ({
      id: item.id,
      message: item.message,
      theme: item.theme,
      unlockDate: parseDateLocal(item.unlock_date),
      createdDate: parseDateLocal(item.created_at),
      is_opened: item.is_opened,
      recipientName: item.recipient?.full_name || 'Someone Special',
      isPrivate: item.mode === 'solo',
    }));

    setCapsules(mappedCapsules);
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();

      setCapsules(prev =>
        prev.map(capsule => {
          const timeDiff = capsule.unlockDate.getTime() - now.getTime();

          let isReadyToUnlock = timeDiff <= 0;
          let timeLeft = '';

          if (isReadyToUnlock) {
            timeLeft = 'Ready to unlock!';
          } else {
            // Calculate days, hours, minutes remaining
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
              timeLeft = `${days}d ${hours}h ${minutes}m`;
            } else if (hours > 0) {
              timeLeft = `${hours}h ${minutes}m`;
            } else {
              timeLeft = `${minutes}m`;
            }
          }

          return { ...capsule, isReadyToUnlock, timeLeft };
        })
      );
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60 * 1000); // every minute
    return () => clearInterval(interval);
  }, []);

  const readyCount = capsules.filter(c => c.isReadyToUnlock && !c.is_opened).length;

  const handleUnlock = async (capsuleId: string) => {
    const capsule = capsules.find(c => c.id === capsuleId);
    if (!capsule) return;

    if (!capsule.isReadyToUnlock) {
      alert("Can't unlock before the unlock date/time!");
      return;
    }

    const { error } = await supabase
      .from('capsules')
      .update({ is_opened: true, opened_at: new Date().toISOString() })
      .eq('id', capsuleId);

    if (error) {
      console.error('Unlock failed:', error.message);
      alert('Failed to unlock capsule. Try again later.');
      return;
    }

    setCapsules(prev =>
      prev.map(c => (c.id === capsuleId ? { ...c, is_opened: true } : c))
    );

    alert('Capsule unlocked! 🎉');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Dream Capsules
            </h1>
            <p className="text-gray-600 mt-2">
              {readyCount} capsule{readyCount !== 1 ? 's' : ''} ready to unlock
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-purple-200">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              New Capsule
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule) => (
            <Card
              key={capsule.id}
              className="border-0 shadow-lg group hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div
                  className={`h-2 w-full bg-gradient-to-r ${getThemeGradient(
                    capsule.theme
                  )} rounded-full mb-4`}
                />
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white font-semibold drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
                    To: {capsule.recipientName}
                  </CardTitle>
                  <Badge
                    variant={capsule.isPrivate ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    {capsule.isPrivate ? 'Private' : 'Public'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white text-sm line-clamp-3">{capsule.message}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium text-purple-600">{capsule.timeLeft}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Unlocks: {formatDate(capsule.unlockDate)}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Created {formatDate(capsule.createdDate)}
                  </span>
                  {capsule.isReadyToUnlock && !capsule.is_opened ? (
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleUnlock(capsule.id)}
                    >
                      Unlock Now
                    </Button>
                  ) : capsule.is_opened ? (
                    <span className="text-xs text-green-500">Unlocked ✅</span>
                  ) : (
                    <span className="text-xs text-gray-400">{capsule.timeLeft}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

