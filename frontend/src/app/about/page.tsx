"use client";

import { useState, useEffect } from "react";

export default function AboutPage() {
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
              <a href="/" className="text-2xl lg:text-3xl font-bold gradient-text">
                Aspire Secure Trade
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#features" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Features
              </a>
              <a href="/#pricing" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Pricing
              </a>
              <a href="/#testimonials" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Testimonials
              </a>
              <a href="/#faq" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
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
              <button className="text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                About <span className="gradient-text">Aspire Secure Trade</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We're revolutionizing forex trading with cutting-edge technology, 
                transparent pricing, and institutional-grade security.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-300 mb-6">
                  To democratize forex trading by providing retail traders with the same 
                  advanced tools, low costs, and execution quality that institutional 
                  traders have enjoyed for decades.
                </p>
                <p className="text-lg text-gray-300">
                  We believe that everyone deserves access to professional-grade trading 
                  infrastructure, regardless of their account size or experience level.
                </p>
              </div>
              <div className="glass rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--accent)] mb-2">$2.5B+</div>
                    <div className="text-sm text-gray-400">Assets Under Management</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--accent)] mb-2">150K+</div>
                    <div className="text-sm text-gray-400">Active Traders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--accent)] mb-2">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--accent)] mb-2">24/7</div>
                    <div className="text-sm text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-900)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Values</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Security First</h3>
                <p className="text-gray-300">
                  Your funds and data are protected with bank-level encryption, 
                  multi-factor authentication, and segregated accounts.
                </p>
              </div>
              
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
                <p className="text-gray-300">
                  Execute trades in milliseconds with our low-latency infrastructure 
                  and direct market access to major liquidity providers.
                </p>
              </div>
              
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Transparency</h3>
                <p className="text-gray-300">
                  No hidden fees, no markups, no surprises. We show you exactly 
                  what you pay and why, with real-time pricing and execution reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Leadership Team</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Industry veterans with decades of experience in finance, technology, and trading
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--accent)] to-[var(--info)] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JS</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">John Smith</h3>
                <p className="text-[var(--accent)] mb-4">CEO & Founder</p>
                <p className="text-gray-300 text-sm">
                  Former Goldman Sachs VP with 15+ years in institutional trading. 
                  Led the development of high-frequency trading systems at major banks.
                </p>
              </div>
              
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">MJ</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Maria Johnson</h3>
                <p className="text-[var(--accent)] mb-4">CTO</p>
                <p className="text-gray-300 text-sm">
                  Ex-Google engineer specializing in distributed systems and real-time 
                  data processing. Built trading platforms handling millions of transactions daily.
                </p>
              </div>
              
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--accent)] to-[var(--warning)] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">DW</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">David Wilson</h3>
                <p className="text-[var(--accent)] mb-4">Head of Risk</p>
                <p className="text-gray-300 text-sm">
                  Former JP Morgan risk manager with expertise in derivatives and 
                  regulatory compliance. Ensures our platform meets the highest security standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-3xl p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Start Trading?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of traders who trust Aspire Secure Trade for their forex trading needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/signup" className="btn-primary rounded-full px-8 py-4 text-lg font-semibold">
                  Create Account
                </a>
                <a href="/contact" className="btn-secondary rounded-full px-8 py-4 text-lg font-semibold">
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--primary-900)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold gradient-text mb-4">Aspire Secure Trade</div>
              <p className="text-gray-400 text-sm mb-4">
                Professional forex trading platform with institutional-grade security and execution.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Trading</h3>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-gray-400 hover:text-[var(--accent)] text-sm">Features</a></li>
                <li><a href="/#pricing" className="text-gray-400 hover:text-[var(--accent)] text-sm">Pricing</a></li>
                <li><a href="/dashboard" className="text-gray-400 hover:text-[var(--accent)] text-sm">Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-[var(--accent)] text-sm">About</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-[var(--accent)] text-sm">Contact</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-[var(--accent)] text-sm">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-[var(--accent)] text-sm">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-[var(--accent)] text-sm">Terms of Service</a></li>
                <li><a href="/risk-disclosure" className="text-gray-400 hover:text-[var(--accent)] text-sm">Risk Disclosure</a></li>
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
        </div>
      </footer>
    </div>
  );
}
