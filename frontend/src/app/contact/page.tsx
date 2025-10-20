"use client";

import { useState, useEffect } from "react";

export default function ContactPage() {
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
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/login" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">
                Login
              </a>
              <a href="/signup" className="btn-primary rounded-full px-6 py-2 text-sm font-semibold">
                Get Started
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass rounded-2xl p-8 lg:p-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Contact Us</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">Email</h3>
                <p className="text-gray-300">support@aspiresecuretrade.com</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">Phone</h3>
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">Address</h3>
                <p className="text-gray-300">123 Financial District<br />New York, NY 10004</p>
              </div>
            </div>

            <div className="text-center">
              <a href="/signup" className="btn-primary rounded-full px-8 py-4 text-lg font-semibold">
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--primary-900)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text mb-4">Aspire Secure Trade</div>
            <div className="text-gray-400 text-sm">
              © 2024 Aspire Secure Trade. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
