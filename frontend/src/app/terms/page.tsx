"use client";

import { useState, useEffect } from "react";

export default function TermsPage() {
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Terms of Service</h1>
            <p className="text-gray-300 mb-8">Last updated: December 2024</p>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-6">
                By accessing and using Aspire Secure Trade's services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, you may not use our services.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">Aspire Secure Trade provides:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Online forex trading platform and services</li>
                <li>Account management and trading tools</li>
                <li>Deposit and withdrawal processing</li>
                <li>Customer support and educational resources</li>
                <li>Real-time market data and analysis tools</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">3. Account Registration</h2>
              <p className="text-gray-300 mb-4">To use our services, you must:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">4. Trading Risks</h2>
              <p className="text-gray-300 mb-4">You acknowledge that:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Forex trading involves substantial risk of loss</li>
                <li>Past performance does not guarantee future results</li>
                <li>You may lose more than your initial investment</li>
                <li>You should only trade with money you can afford to lose</li>
                <li>You are responsible for your trading decisions</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">5. Prohibited Activities</h2>
              <p className="text-gray-300 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Use our services for illegal activities</li>
                <li>Attempt to manipulate market prices</li>
                <li>Share your account credentials with others</li>
                <li>Use automated trading systems without authorization</li>
                <li>Engage in money laundering or terrorist financing</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">6. Deposits and Withdrawals</h2>
              <p className="text-gray-300 mb-4">Terms for deposits and withdrawals:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>All deposits must be from accounts in your name</li>
                <li>Withdrawals are processed within 1-3 business days</li>
                <li>We may request additional verification for large transactions</li>
                <li>Fees may apply for certain withdrawal methods</li>
                <li>We reserve the right to refuse transactions for compliance reasons</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">7. Fees and Charges</h2>
              <p className="text-gray-300 mb-6">
                Our fee structure is transparent and disclosed before you complete any transaction. 
                Fees may include spreads, commissions, and overnight financing charges. 
                All fees are clearly displayed in your account dashboard.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">8. Intellectual Property</h2>
              <p className="text-gray-300 mb-6">
                All content, trademarks, and intellectual property on our platform are owned by Aspire Secure Trade 
                or our licensors. You may not copy, modify, or distribute our content without written permission.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">9. Limitation of Liability</h2>
              <p className="text-gray-300 mb-6">
                To the maximum extent permitted by law, Aspire Secure Trade shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of our services.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">10. Account Suspension</h2>
              <p className="text-gray-300 mb-4">We may suspend or terminate your account if:</p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>You violate these terms</li>
                <li>We suspect fraudulent activity</li>
                <li>Required verification documents are not provided</li>
                <li>You engage in prohibited activities</li>
                <li>We are required to do so by law</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">11. Dispute Resolution</h2>
              <p className="text-gray-300 mb-6">
                Any disputes arising from these terms or our services shall be resolved through binding arbitration 
                in accordance with the rules of the American Arbitration Association.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">12. Regulatory Compliance</h2>
              <p className="text-gray-300 mb-6">
                Our services are subject to applicable financial regulations. We maintain appropriate licenses 
                and registrations as required by law in the jurisdictions where we operate.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">13. Changes to Terms</h2>
              <p className="text-gray-300 mb-6">
                We may modify these terms at any time. We will notify you of material changes via email or 
                through our platform. Continued use of our services constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">14. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                For questions about these terms, please contact us:
              </p>
              <div className="bg-[var(--primary)] rounded-lg p-6">
                <p className="text-gray-300 mb-2"><strong>Email:</strong> legal@aspiresecuretrade.com</p>
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
