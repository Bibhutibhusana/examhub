import React, { useState } from 'react';
import { BookOpen, Users, CreditCard, BarChart3, Settings, Award, FileText, CheckCircle, Lock, Unlock } from 'lucide-react';

export default function ExamPortalWorkflow() {
  const [activeTab, setActiveTab] = useState('flow');

  const tabs = [
    { id: 'flow', name: 'User Flow', icon: Users },
    { id: 'features', name: 'Features & Tiers', icon: Award },
    { id: 'architecture', name: 'System Architecture', icon: Settings },
    { id: 'monetization', name: 'Monetization', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Educational Assessment Portal</h1>
          </div>
          <p className="text-gray-600">Complete Workflow & Strategy for Class 3-10, NMMS & OAV</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'flow' && <UserFlow />}
          {activeTab === 'features' && <FeaturesTiers />}
          {activeTab === 'architecture' && <SystemArchitecture />}
          {activeTab === 'monetization' && <MonetizationStrategy />}
        </div>
      </div>
    </div>
  );
}

function UserFlow() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete User Journey</h2>
      
      {/* Flow Steps */}
      <div className="space-y-4">
        {/* Step 1 */}
        <FlowStep
          number="1"
          title="Landing Page"
          description="Student visits the portal"
          details={[
            "Welcome message & hero section",
            "Sign Up / Login buttons prominent",
            "Show: 'Start with 10 FREE exams!'",
            "Display testimonials & success stories"
          ]}
        />

        {/* Step 2 */}
        <FlowStep
          number="2"
          title="Registration / Login"
          description="User creates account or logs in"
          details={[
            "Quick registration: Name, Email, Phone, Password",
            "OTP verification for phone/email",
            "Social login options (Google, Facebook)",
            "Profile setup: Class, Medium (Odia/English), Subjects of interest"
          ]}
        />

        {/* Step 3 */}
        <FlowStep
          number="3"
          title="Dashboard"
          description="Main hub after login"
          details={[
            "Welcome message with student name",
            "Display: 'Free exams remaining: 7/10'",
            "Quick access cards: Take Exam | My Results | Performance Analytics",
            "Upgrade to Premium banner (if free user)"
          ]}
        />

        {/* Step 4 */}
        <FlowStep
          number="4"
          title="Exam Selection Flow"
          description="Multi-level selection process"
          details={[
            "Level 1: Select Medium → Odia | English",
            "Level 2: Select Category → Class 3-10 | NMMS | OAV",
            "Level 3: Select Subject → Math, Science, English, Odia, Sanskrit, Social Science",
            "Level 4: View available exams with difficulty levels"
          ]}
        />

        {/* Step 5 */}
        <FlowStep
          number="5"
          title="Pre-Exam Screen"
          description="Before starting the exam"
          details={[
            "Exam details: Duration, Total questions, Marks, Difficulty",
            "Instructions & rules",
            "For FREE users: Show 'X free exams remaining'",
            "For PREMIUM users: Show 'Unlimited access' badge",
            "Start Exam button"
          ]}
        />

        {/* Step 6 */}
        <FlowStep
          number="6"
          title="Exam Interface"
          description="Taking the exam"
          details={[
            "Timer countdown",
            "Question number navigation (1-15)",
            "Mark for review option",
            "Previous/Next buttons",
            "Submit exam button",
            "Auto-submit when time ends"
          ]}
        />

        {/* Step 7 */}
        <FlowStep
          number="7"
          title="Results & Analytics"
          description="Post-exam experience"
          details={[
            "Immediate results display",
            "Score breakdown by topic",
            "Correct/Incorrect answers review",
            "Time spent per question",
            "Percentile ranking (Premium feature)",
            "Download certificate (Premium feature)"
          ]}
        />

        {/* Step 8 */}
        <FlowStep
          number="8"
          title="Paywall Trigger"
          description="When free limit is reached"
          details={[
            "After 10 free exams: 'You've used all free exams!'",
            "Show comparison: Free vs Premium features",
            "Pricing plans with discount offers",
            "Limited-time offers: '50% off for first month'",
            "Payment gateway integration"
          ]}
        />
      </div>
    </div>
  );
}

function FlowStep({ number, title, description, details }) {
  return (
    <div className="border-l-4 border-indigo-500 pl-6 pb-4 relative">
      <div className="absolute -left-4 top-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 mb-3">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturesTiers() {
  const tiers = [
    {
      name: "Free Tier",
      icon: Unlock,
      color: "gray",
      price: "₹0",
      features: [
        { text: "10 practice exams (total)", included: true },
        { text: "Basic score display", included: true },
        { text: "Subject-wise exam access", included: true },
        { text: "Odia & English medium", included: true },
        { text: "Detailed analytics", included: false },
        { text: "Performance comparison", included: false },
        { text: "Mock tests unlimited", included: false },
        { text: "Download certificates", included: false },
        { text: "Previous year questions", included: false },
        { text: "Priority support", included: false }
      ]
    },
    {
      name: "Premium Tier",
      icon: Award,
      color: "indigo",
      price: "₹199/month",
      features: [
        { text: "Unlimited exams", included: true },
        { text: "Detailed analytics & insights", included: true },
        { text: "Performance comparison with peers", included: true },
        { text: "Subject-wise weak area analysis", included: true },
        { text: "Mock tests with timer", included: true },
        { text: "Previous year question papers", included: true },
        { text: "Download performance certificates", included: true },
        { text: "Percentile ranking", included: true },
        { text: "Priority customer support", included: true },
        { text: "Early access to new content", included: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Feature Comparison</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div key={tier.name} className={`border-2 rounded-xl p-6 ${tier.color === 'indigo' ? 'border-indigo-500 shadow-lg' : 'border-gray-300'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className={`w-8 h-8 ${tier.color === 'indigo' ? 'text-indigo-600' : 'text-gray-600'}`} />
                  <h3 className="text-2xl font-bold text-gray-800">{tier.name}</h3>
                </div>
                {tier.color === 'indigo' && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
              </div>

              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {tier.color === 'indigo' && (
                <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Upgrade Now
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional Pricing Options */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Flexible Pricing Plans</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-lg font-semibold text-gray-800">Monthly</div>
            <div className="text-2xl font-bold text-indigo-600 my-2">₹199</div>
            <div className="text-sm text-gray-600">Billed monthly</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border-2 border-indigo-500">
            <div className="flex items-center justify-between mb-1">
              <div className="text-lg font-semibold text-gray-800">Quarterly</div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Save 20%</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600 my-2">₹499</div>
            <div className="text-sm text-gray-600">₹166/month</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-1">
              <div className="text-lg font-semibold text-gray-800">Yearly</div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Save 35%</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600 my-2">₹1,599</div>
            <div className="text-sm text-gray-600">₹133/month</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemArchitecture() {
  const components = [
    {
      layer: "Frontend",
      items: [
        { name: "Web App", tech: "React.js / Next.js", desc: "Responsive web application" },
        { name: "Mobile App", tech: "React Native / Flutter", desc: "iOS & Android apps" },
        { name: "Admin Panel", tech: "React.js", desc: "Content & user management" }
      ]
    },
    {
      layer: "Backend",
      items: [
        { name: "API Server", tech: "Node.js / Python (Django/FastAPI)", desc: "RESTful APIs" },
        { name: "Authentication", tech: "JWT + OAuth2", desc: "Secure login system" },
        { name: "Payment Gateway", tech: "Razorpay / PhonePe", desc: "Subscription management" }
      ]
    },
    {
      layer: "Database",
      items: [
        { name: "User Data", tech: "PostgreSQL", desc: "User profiles, subscriptions" },
        { name: "Question Bank", tech: "MongoDB", desc: "Flexible question storage" },
        { name: "Cache", tech: "Redis", desc: "Performance optimization" }
      ]
    },
    {
      layer: "Infrastructure",
      items: [
        { name: "Hosting", tech: "AWS / Google Cloud", desc: "Scalable cloud hosting" },
        { name: "CDN", tech: "CloudFlare", desc: "Fast content delivery" },
        { name: "Storage", tech: "S3 / Cloud Storage", desc: "Images, PDFs storage" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">System Architecture & Tech Stack</h2>
      
      {components.map((component, idx) => (
        <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">{component.layer} Layer</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {component.items.map((item, itemIdx) => (
              <div key={itemIdx} className="bg-white rounded-lg p-4 shadow">
                <div className="font-semibold text-gray-800 mb-1">{item.name}</div>
                <div className="text-sm text-indigo-600 font-medium mb-2">{item.tech}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Key Features Implementation */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Critical Features to Implement</h3>
        <div className="space-y-3">
          {[
            { feature: "Subscription Management", detail: "Track free exam count, subscription status, renewal dates" },
            { feature: "Exam Engine", detail: "Timer, question randomization, auto-submit, progress saving" },
            { feature: "Analytics Dashboard", detail: "Performance tracking, subject-wise analysis, historical data" },
            { feature: "Payment Integration", detail: "Multiple payment methods, automatic renewal, invoice generation" },
            { feature: "Notification System", detail: "Email/SMS for exam reminders, subscription expiry, new content" },
            { feature: "Content Management", detail: "Easy question upload, bulk import, categorization" },
            { feature: "Security", detail: "Secure exam environment, prevent cheating, data encryption" },
            { feature: "Performance Optimization", detail: "Fast loading, handle concurrent users, caching strategy" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
              <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{item.feature}</div>
                <div className="text-sm text-gray-600">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonetizationStrategy() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Monetization & Growth Strategy</h2>
      
      {/* Conversion Strategy */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-emerald-700 mb-4">Free to Paid Conversion Tactics</h3>
        <div className="space-y-3">
          {[
            "Show value immediately: Display detailed analytics even for free users, but lock advanced features",
            "Strategic limitations: Allow 10 FREE exams across ALL subjects (not per subject) to create urgency",
            "Social proof: Show 'X students upgraded today' or 'Join 10,000+ premium members'",
            "Limited-time offers: '50% off if you upgrade within 24 hours'",
            "Comparison at paywall: Show side-by-side what they're missing",
            "Trial period: Offer 7-14 days full premium access, then auto-downgrade (not charge)",
            "Email nurturing: Send automated emails showing their progress and encouraging upgrade"
          ].map((tactic, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{tactic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Primary Revenue</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">Student subscriptions (Monthly/Yearly)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">Class-specific packages</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">Subject-wise bundles</span>
            </li>
          </ul>
        </div>

        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-3">Secondary Revenue</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-gray-700">School/Institution bulk licenses</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-gray-700">Coaching center partnerships</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-gray-700">White-label solutions</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Growth Phases */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-orange-700 mb-4">3-Phase Growth Plan</h3>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <h4 className="font-bold text-gray-800">Phase 1: Launch & Validate (Month 1-3)</h4>
            </div>
            <ul className="ml-11 space-y-1 text-gray-700">
              <li>• Launch with freemium model</li>
              <li>• Focus on user acquisition (target: 1,000+ users)</li>
              <li>• Gather feedback and iterate</li>
              <li>• Test conversion rates (aim for 5-10%)</li>
              <li>• Build question bank to 500+ questions</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <h4 className="font-bold text-gray-800">Phase 2: Scale & Optimize (Month 4-9)</h4>
            </div>
            <ul className="ml-11 space-y-1 text-gray-700">
              <li>• Aggressive marketing campaigns</li>
              <li>• Partner with schools and coaching centers</li>
              <li>• Launch referral program (earn free months)</li>
              <li>• Add mobile apps</li>
              <li>• Target: 10,000+ users, 500+ paid subscribers</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <h4 className="font-bold text-gray-800">Phase 3: Expansion (Month 10+)</h4>
            </div>
            <ul className="ml-11 space-y-1 text-gray-700">
              <li>• Expand to other states/regions</li>
              <li>• Add live classes or doubt-solving</li>
              <li>• Introduce AI-powered personalized learning</li>
              <li>• B2B sales to schools (bulk licensing)</li>
              <li>• Target: 50,000+ users, 5,000+ paid subscribers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-indigo-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-indigo-700 mb-4">Key Metrics to Track</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { metric: "User Acquisition", target: "1000+ users/month" },
            { metric: "Conversion Rate", target: "5-10% free to paid" },
            { metric: "Monthly Churn", target: "< 5%" },
            { metric: "Average Revenue Per User", target: "₹150-200/month" },
            { metric: "Customer Lifetime Value", target: "₹1,500-2,000" },
            { metric: "User Engagement", target: "3+ exams/user/month" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600 mb-1">{item.metric}</div>
              <div className="text-lg font-bold text-indigo-600">{item.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}