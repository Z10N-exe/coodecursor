"use client";

import { useState, useEffect } from "react";

export default function PrivacyPage() {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass rounded-2xl p-8 lg:p-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-gray-300 mb-8">Last updated: December 2024</p>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">1. Information We Collect</h2>
              <p className="text-gray-300 mb-6">
                We collect information you provide directly to us, such as when you create an account, 
                make a deposit, or contact us for support. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Personal information (name, email, phone number, date of birth)</li>
                <li>Financial information (bank account details, trading history)</li>
                <li>Identity verification documents (passport, driver's license)</li>
                <li>Communication records (support tickets, emails)</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Provide and maintain our trading services</li>
                <li>Process transactions and manage your account</li>
                <li>Verify your identity and comply with regulatory requirements</li>
                <li>Communicate with you about your account and our services</li>
                <li>Improve our platform and develop new features</li>
                <li>Detect and prevent fraud and other illegal activities</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">3. Information Sharing</h2>
              <p className="text-gray-300 mb-4">We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or regulatory requirements</li>
                <li>To protect our rights, property, or safety, or that of our users</li>
                <li>With service providers who assist us in operating our platform (under strict confidentiality agreements)</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">4. Data Security</h2>
              <p className="text-gray-300 mb-6">
                We implement industry-standard security measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Multi-factor authentication for account access</li>
                <li>Regular security audits and penetration testing</li>
                <li>Segregated client funds in regulated banks</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">5. Your Rights</h2>
              <p className="text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information (subject to regulatory requirements)</li>
                <li>Object to processing of your personal information</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">6. Cookies and Tracking</h2>
              <p className="text-gray-300 mb-6">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and provide personalized content. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">7. Data Retention</h2>
              <p className="text-gray-300 mb-6">
                We retain your personal information for as long as necessary to provide our services, 
                comply with legal obligations, resolve disputes, and enforce our agreements. 
                Financial records are typically retained for 7 years as required by law.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">8. International Transfers</h2>
              <p className="text-gray-300 mb-6">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">9. Children's Privacy</h2>
              <p className="text-gray-300 mb-6">
                Our services are not intended for individuals under 18 years of age. 
                We do not knowingly collect personal information from children under 18.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">10. Changes to This Policy</h2>
              <p className="text-gray-300 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">11. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[var(--primary)] rounded-lg p-6">
                <p className="text-gray-300 mb-2"><strong>Email:</strong> privacy@aspiresecuretrade.com</p>
                <p className="text-gray-300 mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="text-gray-300"><strong>Address:</strong> 123 Financial District, New York, NY 10004</p>
              </div>
            </div>
          </div>
        </div>
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
