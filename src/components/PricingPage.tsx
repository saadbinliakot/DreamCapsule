
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Heart, Sparkles, Crown, Infinity } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Heart,
      color: 'from-gray-400 to-gray-500',
      popular: false,
      features: [
        '1 capsule per month',
        'Text messages only',
        'Basic themes (3 options)',
        'Standard unlock notifications',
        'Mobile app access',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        'Unlimited capsules',
        'Photos, videos & audio',
        'Premium themes (15+ options)',
        'Custom unlock animations',
        'Priority email notifications',
        'Advanced scheduling options',
        'Batch capsule creation',
        'AI-generated letter suggestions',
        'DALL·E capsule artwork',
        'Priority customer support',
        'Export your capsules'
      ]
    },
    {
      name: 'Eternal',
      price: '$49.99',
      period: 'one-time',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      popular: false,
      features: [
        'One permanent capsule',
        'Guaranteed storage forever',
        'Premium unlock experience',
        'Legacy protection',
        'Beneficiary management',
        'Legal document storage',
        'Custom memorial themes',
        'Multi-generational sharing',
        'White-glove setup service',
        'Lifetime customer support'
      ]
    }
  ];

  const addOns = [
    {
      name: 'AI Letter Writer',
      price: '$2.99',
      description: 'Let GPT craft beautiful, personalized letters based on your memories and feelings',
      icon: Sparkles
    },
    {
      name: 'Custom Artwork',
      price: '$4.99',
      description: 'DALL·E generated unique artwork for your capsules based on your message',
      icon: Star
    },
    {
      name: 'Extra Storage',
      price: '$1.99',
      description: '10GB additional storage for high-quality videos and photos',
      icon: Infinity
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start for free and upgrade when you're ready to unlock the full magic of Dream Capsule. 
            Every plan includes our commitment to keeping your memories safe forever.
          </p>
        </div>

        {/* Main Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative ${
                plan.popular ? 'scale-105 ring-2 ring-purple-200' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4 pb-8">
                <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                
                <CardTitle className="text-2xl text-gray-800">
                  {plan.name}
                </CardTitle>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {plan.period}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-6 text-lg ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                      : 'border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.name === 'Free' ? 'Get Started' : plan.name === 'Eternal' ? 'Create Legacy' : 'Start Free Trial'}
                </Button>
                
                {plan.name === 'Pro' && (
                  <p className="text-center text-xs text-gray-500">
                    14-day free trial • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Add-ons Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered Add-ons
            </h2>
            <p className="text-gray-600">
              Enhance your capsules with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <Card key={addon.name} className="border border-purple-100 hover:border-purple-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <addon.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{addon.name}</h3>
                  <p className="text-2xl font-bold text-purple-600 mb-3">{addon.price}</p>
                  <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                  
                  <Button size="sm" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What happens to my capsules if I cancel?</h3>
              <p className="text-gray-600">
                Your capsules remain safe and will still unlock on their scheduled dates. You'll just lose access to Pro features like unlimited creation and premium themes.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">How secure are my memories?</h3>
              <p className="text-gray-600">
                We use enterprise-grade encryption and multiple backup systems. Your memories are stored with the same security standards as major financial institutions.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Can I change my unlock date?</h3>
              <p className="text-gray-600">
                Once a capsule is locked, the date cannot be changed. This ensures the integrity and magic of your time capsule experience.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What's included in the free trial?</h3>
              <p className="text-gray-600">
                Full access to all Pro features for 14 days, including unlimited capsules, media uploads, and AI add-ons. No credit card required.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Free Trial Today
            <Sparkles className="w-6 h-6 ml-2" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
