import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Star, Zap, Trophy, Target, BookOpen, Award, Users, HelpCircle, Sparkles, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadRazorpayScript, initializeRazorpayPayment, subscriptionPlans } from '../utils/razorpay';
import '../css/paywall.css';

const Paywall = () => {
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [loading, setLoading] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(1); // Start with quarterly (index 1)
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    // Load Razorpay script when component mounts
    loadRazorpayScript();
  }, []);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 199,
      originalPrice: 299,
      period: 'month',
      savings: '',
      popular: false,
      features: [
        'Unlimited practice exams',
        'Basic performance analytics',
        'Subject-wise breakdown',
        'Exam history',
        'Email support'
      ]
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: 499,
      originalPrice: 897,
      period: '3 months',
      savings: 'Save 20%',
      popular: true,
      features: [
        'Everything in Monthly',
        'Advanced analytics dashboard',
        'Performance comparison',
        'Download certificates',
        'Priority support',
        'Mock test series'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 1599,
      originalPrice: 3588,
      period: 'year',
      savings: 'Save 35%',
      popular: false,
      features: [
        'Everything in Quarterly',
        'AI-powered recommendations',
        'Custom study plans',
        'Offline exam downloads',
        '24/7 premium support',
        'Early access to new features'
      ]
    }
  ];

  const handlePayment = async (planId) => {
    if (!currentUser || !userData) {
      alert('Please log in to continue with payment.');
      navigate('/student-login');
      return;
    }

    setLoading(true);

    try {
      const planDetails = subscriptionPlans[planId];
      if (!planDetails) {
        throw new Error('Invalid plan selected');
      }

      const userDetails = {
        name: userData.name || currentUser.displayName || 'Student',
        email: currentUser.email,
        phone: userData.phone || '',
      };

      // Initialize Razorpay payment
      await initializeRazorpayPayment(planDetails, userDetails);

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextPlan = () => {
    setCurrentPlanIndex((prev) => (prev + 1) % plans.length);
  };

  const prevPlan = () => {
    setCurrentPlanIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  return (
    <div className="paywall-container">
      <div className="paywall-content">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-orange-300 rounded-full animate-bounce delay-1000"></div>
            <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-amber-300 rounded-full animate-bounce delay-500"></div>
          </div>

          <div className="flex justify-center mb-6 relative">
            <div className="relative animate-fade-in-up">
              <Crown className="w-16 h-16 md:w-20 md:h-20 text-yellow-500 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl animate-pulse delay-300"></div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in-up delay-200">
            You've Used All Free Exams!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400">
            Unlock unlimited access to all features and take your learning to the next level
          </p>
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200 rounded-2xl p-4 md:p-6 inline-block shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 to-orange-200/50 animate-pulse"></div>
            <p className="text-yellow-800 font-bold text-base md:text-lg flex items-center gap-2 relative z-10">
              <Sparkles className="w-5 h-5 animate-spin text-yellow-600" />
              Limited time: Get 50% off your first month!
            </p>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 md:p-8 mb-8 border border-blue-100 animate-fade-in-up delay-800">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">
            Free vs Premium Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4 bg-gray-50 rounded-lg p-4 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                  <span className="text-sm font-bold text-gray-600">F</span>
                </div>
                Free Plan
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors border border-gray-100">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">10 practice exams</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors border border-gray-100">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Basic score display</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors opacity-60 border border-gray-200">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-400 line-through">Detailed analytics</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors opacity-60 border border-gray-200">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-400 line-through">Unlimited exams</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors opacity-60 border border-gray-200">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-400 line-through">Download certificates</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border-2 border-yellow-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-amber-600 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-amber-300">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                Premium Plan
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors border border-amber-100">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 font-medium">Unlimited exams</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors border border-amber-100">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 font-medium">Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors border border-amber-100">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 font-medium">Performance insights</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors border border-amber-100">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 font-medium">Download certificates</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors border border-amber-100">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700 font-medium">Priority support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans Grid */}
        <div className="mb-8 animate-fade-in-up delay-1000">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 md:p-8 relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 ${
                  plan.popular ? 'ring-4 ring-purple-400 transform scale-105 border-purple-200' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-pulse border-2 border-purple-300">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {plan.id === 'monthly' && <BookOpen className="w-12 h-12 text-blue-500" />}
                    {plan.id === 'quarterly' && <Target className="w-12 h-12 text-purple-500" />}
                    {plan.id === 'yearly' && <Trophy className="w-12 h-12 text-gold-500" />}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{plan.price}</span>
                    <span className="text-gray-500 text-lg">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full inline-block border border-green-200">
                      {plan.savings} (₹{plan.originalPrice} original)
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="bg-green-100 rounded-full p-1 mt-0.5 border border-green-200">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePayment(plan.id)}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 border-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl border-purple-300'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 border-gray-300'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">
            What Our Premium Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">R</span>
              </div>
              <p className="text-gray-600 mb-4">
                "The detailed analytics helped me identify my weak areas. My scores improved by 30%!"
              </p>
              <div className="font-semibold text-gray-900">Rahul S.</div>
              <div className="text-sm text-gray-500">Class 10 Student</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">P</span>
              </div>
              <p className="text-gray-600 mb-4">
                "Unlimited practice exams gave me the confidence I needed for my board exams."
              </p>
              <div className="font-semibold text-gray-900">Priya M.</div>
              <div className="text-sm text-gray-500">Class 12 Student</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">A</span>
              </div>
              <p className="text-gray-600 mb-4">
                "The certificates and performance tracking features are amazing for college applications."
              </p>
              <div className="font-semibold text-gray-900">Arun K.</div>
              <div className="text-sm text-gray-500">NMMS Aspirant</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 7-day money-back guarantee if you're not satisfied with the premium features.</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Can I switch between plans?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">You get 10 free exams to try our platform. After that, you can purchase a subscription for full access.</p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
