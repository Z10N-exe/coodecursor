"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-strong' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center">
              <div className="text-2xl lg:text-3xl font-bold gradient-text">
                Aspire Secure Trade
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Testimonials
              </a>
              <a href="#faq" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                FAQ
              </a>
              <a href="/login" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Login
              </a>
              <a href="/signup" className="btn-primary rounded-full px-6 py-2 text-sm font-semibold">
                Get Started
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Trade Forex with{" "}
                  <span className="gradient-text">Confidence</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed">
                  Experience lightning-fast execution, transparent fees, and bank-grade security. 
                  Join thousands of traders who trust Aspire Secure Trade for their forex needs.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="/signup" className="btn-primary rounded-xl px-8 py-4 text-lg font-semibold">
                    Start Trading Now
                  </a>
                  <a href="#demo" className="btn-secondary rounded-xl px-8 py-4 text-lg font-semibold">
                    Watch Demo
                  </a>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  ✨ No setup fees • 24/7 support • Regulated & secure
                </p>
              </div>
              
              <div className="relative">
                <div className="glass-strong rounded-3xl p-8 animate-float">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Live Trading Dashboard</div>
                    <div className="text-3xl font-bold mb-6">$2,847,392</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="stats-card rounded-2xl p-4">
                        <div className="text-xs text-gray-400">24h Volume</div>
                        <div className="text-xl font-bold text-[var(--accent)]">$1.2M</div>
                      </div>
                      <div className="stats-card rounded-2xl p-4">
                        <div className="text-xs text-gray-400">Active Trades</div>
                        <div className="text-xl font-bold">1,247</div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <div className="flex items-center space-x-2 text-sm text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                        <span>Live Market Data</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--accent)] rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[var(--info)] rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-900)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Active Traders", value: "50,000+", icon: "👥" },
                { label: "Trading Volume", value: "$2.5B+", icon: "📈" },
                { label: "Countries", value: "180+", icon: "🌍" },
                { label: "Uptime", value: "99.99%", icon: "⚡" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl lg:text-4xl font-bold text-[var(--accent)]">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Why Choose <span className="gradient-text">Aspire Secure Trade</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We provide everything you need to succeed in forex trading with cutting-edge technology and unmatched security.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast Execution",
                  description: "Execute trades in under 35ms with our advanced trading infrastructure and global server network.",
                  features: ["< 35ms execution", "Global servers", "Real-time data"]
                },
                {
                  icon: "🔒",
                  title: "Bank-Grade Security",
                  description: "Your funds are protected with military-grade encryption and insured up to $250,000 per account.",
                  features: ["256-bit encryption", "Cold storage", "FDIC insured"]
                },
                {
                  icon: "📊",
                  title: "Advanced Analytics",
                  description: "Make informed decisions with our comprehensive charting tools and market analysis features.",
                  features: ["Real-time charts", "Technical indicators", "Market insights"]
                },
                {
                  icon: "💰",
                  title: "Transparent Pricing",
                  description: "No hidden fees, no surprises. See exactly what you pay with our transparent fee structure.",
                  features: ["No hidden fees", "Low spreads", "Clear pricing"]
                },
                {
                  icon: "🌍",
                  title: "Global Access",
                  description: "Trade 24/7 with access to major forex markets worldwide from anywhere in the world.",
                  features: ["24/7 trading", "180+ countries", "Multiple currencies"]
                },
                {
                  icon: "🎯",
                  title: "Expert Support",
                  description: "Get help when you need it with our dedicated support team of trading professionals.",
                  features: ["24/7 support", "Expert advisors", "Educational resources"]
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card glass rounded-2xl p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-900)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get started in minutes with our simple 3-step process
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  description: "Sign up in under 60 seconds with just your email and basic information. No lengthy verification process.",
                  icon: "👤"
                },
                {
                  step: "02", 
                  title: "Fund Your Account",
                  description: "Deposit funds securely using bank transfer, credit card, or cryptocurrency. Funds are available instantly.",
                  icon: "💳"
                },
                {
                  step: "03",
                  title: "Start Trading",
                  description: "Access our trading platform and start trading forex with real-time data and professional tools.",
                  icon: "📈"
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto glass-strong rounded-full flex items-center justify-center text-2xl">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-sm font-bold text-black">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                What Our <span className="gradient-text">Traders Say</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join thousands of successful traders who trust Aspire Secure Trade
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "Professional Trader",
                  location: "Singapore",
                  content: "The execution speed is incredible. I've been trading for 5 years and never experienced such fast fills. The support team is also top-notch.",
                  rating: 5,
                  avatar: "👩‍💼"
                },
                {
                  name: "Marcus Johnson",
                  role: "Day Trader",
                  location: "New York",
                  content: "The platform is intuitive and the fees are transparent. I've saved thousands compared to my previous broker. Highly recommended!",
                  rating: 5,
                  avatar: "👨‍💻"
                },
                {
                  name: "Elena Rodriguez",
                  role: "Swing Trader",
                  location: "Madrid",
                  content: "Security was my main concern, but Aspire Secure Trade has exceeded my expectations. I feel confident trading large amounts here.",
                  rating: 5,
                  avatar: "👩‍🎓"
                },
                {
                  name: "David Kim",
                  role: "Algorithmic Trader",
                  location: "Seoul",
                  content: "The API integration is seamless and the data quality is excellent. Perfect for my automated trading strategies.",
                  rating: 5,
                  avatar: "👨‍🔬"
                },
                {
                  name: "Anna Petrov",
                  role: "Retail Trader",
                  location: "Moscow",
                  content: "The educational resources helped me improve my trading significantly. The community is also very supportive.",
                  rating: 5,
                  avatar: "👩‍🏫"
                },
                {
                  name: "James Wilson",
                  role: "Institutional Trader",
                  location: "London",
                  content: "We've been using Aspire Secure Trade for our institutional clients. The reliability and performance are outstanding.",
                  rating: 5,
                  avatar: "👨‍💼"
                }
              ].map((testimonial, index) => (
                <div key={index} className="testimonial-card rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-900)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Simple, <span className="gradient-text">Transparent</span> Pricing
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Choose the plan that fits your trading style. No hidden fees, no surprises.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "0.8",
                  description: "Perfect for new traders",
                  features: [
                    "0.8 pips spread",
                    "Up to $10,000 leverage",
                    "Basic charting tools",
                    "Email support",
                    "Mobile app access"
                  ],
                  popular: false
                },
                {
                  name: "Professional",
                  price: "0.5",
                  description: "For serious traders",
                  features: [
                    "0.5 pips spread",
                    "Up to $100,000 leverage",
                    "Advanced charting tools",
                    "Priority support",
                    "API access",
                    "Custom indicators"
                  ],
                  popular: true
                },
                {
                  name: "Institutional",
                  price: "0.2",
                  description: "For large volume traders",
                  features: [
                    "0.2 pips spread",
                    "Unlimited leverage",
                    "All trading tools",
                    "Dedicated account manager",
                    "White-label solutions",
                    "Custom integrations"
                  ],
                  popular: false
                }
              ].map((plan, index) => (
                <div key={index} className={`glass-strong rounded-2xl p-8 relative ${
                  plan.popular ? 'ring-2 ring-[var(--accent)]' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-[var(--accent)] text-black px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold">
                      {plan.price} <span className="text-lg text-gray-400">pips</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center mr-3">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-semibold ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-xl text-gray-300">
                Everything you need to know about Aspire Secure Trade
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How secure is my money with Aspire Secure Trade?",
                  answer: "Your funds are protected with bank-grade security including 256-bit SSL encryption, segregated accounts, and FDIC insurance up to $250,000 per account. We also use cold storage for the majority of client funds."
                },
                {
                  question: "What are the minimum deposit requirements?",
                  answer: "You can start trading with as little as $100. There are no minimum deposit requirements for our Starter plan, making it accessible for new traders."
                },
                {
                  question: "How fast are withdrawals processed?",
                  answer: "Most withdrawals are processed within 24-48 hours. Bank transfers typically take 1-3 business days, while cryptocurrency withdrawals are usually processed within a few hours."
                },
                {
                  question: "Do you offer demo accounts?",
                  answer: "Yes! We provide free demo accounts with $10,000 virtual money so you can practice trading without any risk. Demo accounts have access to all our trading tools and real-time market data."
                },
                {
                  question: "What trading platforms do you support?",
                  answer: "We support multiple platforms including our web-based platform, mobile apps for iOS and Android, and MetaTrader 4/5. We also offer API access for algorithmic trading."
                },
                {
                  question: "Is there a mobile app available?",
                  answer: "Yes, we have native mobile apps for both iOS and Android. The apps include all the features of our web platform and are optimized for mobile trading."
                },
                {
                  question: "What educational resources do you provide?",
                  answer: "We offer comprehensive educational resources including video tutorials, webinars, trading guides, market analysis, and a dedicated learning center. Our support team also provides personalized guidance."
                },
                {
                  question: "How do I contact customer support?",
                  answer: "You can reach our support team 24/7 through live chat, email, or phone. Professional plan users get priority support, while Institutional clients have dedicated account managers."
                }
              ].map((faq, index) => (
                <div key={index} className="glass rounded-2xl p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
                      <span>{faq.question}</span>
                      <div className="text-[var(--accent)] group-open:rotate-180 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="mt-4 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[var(--accent)] to-[var(--info)]">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              Join thousands of successful traders and experience the difference with Aspire Secure Trade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="bg-black text-white rounded-xl px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors">
                Create Free Account
              </a>
              <a href="#demo" className="bg-white/20 text-black rounded-xl px-8 py-4 text-lg font-semibold hover:bg-white/30 transition-colors">
                Watch Demo
              </a>
            </div>
            <p className="mt-6 text-sm text-black/60">
              No credit card required • Start trading in minutes
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--primary-900)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold gradient-text mb-4">Aspire Secure Trade</div>
              <p className="text-gray-400 mb-6 max-w-md">
                The most trusted forex trading platform for traders worldwide. 
                Experience the future of trading with cutting-edge technology and unmatched security.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Trading</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Forex Trading</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">CFDs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Indices</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Commodities</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Crypto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Live Chat</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">API Docs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--accent)] transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 Aspire Secure Trade. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-gray-400 hover:text-[var(--accent)] transition-colors text-sm">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-[var(--accent)] transition-colors text-sm">Terms of Service</a>
                <a href="/about" className="text-gray-400 hover:text-[var(--accent)] transition-colors text-sm">About</a>
                <a href="/contact" className="text-gray-400 hover:text-[var(--accent)] transition-colors text-sm">Contact</a>
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
}