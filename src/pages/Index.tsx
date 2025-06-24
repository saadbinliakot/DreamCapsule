
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, Users, Sparkles, ArrowRight, Home, UserCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
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
              <Link to="/">
                <Button variant="ghost" className="text-purple-400 hover:bg-white/10">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Dashboard
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
              <Link to="/auth">
                <Button className="glow-button text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center pulse-glow">
                  <Heart className="w-16 h-16 text-white animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center glow-button">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold mb-8 text-glow">
              <span className="gradient-text">
                Dream Capsules
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Lock away your precious memories and heartfelt messages in time. 
              Share them with friends or keep them for your future self. 
              <span className="text-purple-400 font-semibold text-glow"> Let time reveal your treasures.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button size="lg" className="glow-button text-white px-12 py-6 text-xl">
                  <Heart className="w-6 h-6 mr-3" />
                  Start Your Journey
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              
              <Link to="/memory-wall">
                <Button variant="outline" size="lg" className="border-purple-400 text-purple-300 hover:bg-purple-400/10 px-12 py-6 text-xl glow-card">
                  <Star className="w-6 h-6 mr-3" />
                  Explore Public Memories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 text-glow">
              How It Works
            </h2>
            <p className="text-2xl text-gray-300">
              Three simple steps to create lasting memories
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glow-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 pulse-glow">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 text-glow">Create</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Write heartfelt messages, add photos or videos, and choose a beautiful theme. 
                  Express your feelings and capture the moment.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glow-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 pulse-glow">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 text-glow">Lock</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Set a future date when your capsule will unlock. Whether it's next month or next decade, 
                  time will keep your treasures safe.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glow-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 pulse-glow">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 text-glow">Share</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Send capsules to friends or keep them for yourself. 
                  Create a network of memories and meaningful connections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl font-bold mb-8 text-glow">
            <span className="gradient-text">
              Ready to Create Magic?
            </span>
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Join thousands of dreamers who are already preserving their most precious moments
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="glow-button text-white px-16 py-8 text-2xl">
              <Sparkles className="w-8 h-8 mr-4" />
              Start Creating Dreams
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
