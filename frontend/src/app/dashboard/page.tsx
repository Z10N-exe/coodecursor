"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../../lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const authService = AuthService.getInstance();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace("/login");
      return;
    }

    fetchUserData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchUserData = async () => {
    try {
      const response = await authService.makeAuthenticatedRequest(`${API_BASE}/users/me`);
      const data = await response.json();
      setUser(data.profile);
      setBalances(data.balances);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      authService.logout();
      router.replace("/login");
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;

    try {
      const response = await authService.makeAuthenticatedRequest(`${API_BASE}/deposits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositAmount,
          currency: 'USD',
          method: 'bank_transfer'
        }),
      });

      if (response.ok) {
        alert('Deposit request created successfully');
        setDepositAmount("");
        fetchUserData(); // Refresh data
      } else {
        const error = await response.json();
        alert('Deposit failed: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Deposit failed: ' + (error as Error).message);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalAmount) return;

    try {
      const response = await authService.makeAuthenticatedRequest(`${API_BASE}/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawalAmount,
          currency: 'USD',
          method: 'bank_transfer',
          details: { accountNumber: '1234567890' }
        }),
      });

      if (response.ok) {
        alert('Withdrawal request submitted for approval');
        setWithdrawalAmount("");
        fetchUserData(); // Refresh data
      } else {
        const error = await response.json();
        alert('Withdrawal failed: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Withdrawal failed: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Aspire Secure Trade</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-80">Welcome, {user?.firstName}</span>
            <button
              onClick={() => {
                authService.logout();
                router.replace("/login");
              }}
              className="text-sm opacity-80 hover:opacity-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="text-sm opacity-80 mb-2">Available Balance</div>
            <div className="text-2xl font-bold">
              {balances.find(b => b.currency === "USD")?.available || "0.00"} USD
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-sm opacity-80 mb-2">Trading Balance</div>
            <div className="text-2xl font-bold">
              {balances.find(b => b.currency === "USD")?.trading || "0.00"} USD
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-sm opacity-80 mb-2">Pending Withdrawals</div>
            <div className="text-2xl font-bold">0.00 USD</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-sm opacity-80 mb-2">Total Profits (24h)</div>
            <div className="text-2xl font-bold text-[var(--accent)]">+0.00 USD</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Deposit Funds</h3>
            <form onSubmit={handleDeposit} className="space-y-3">
              <select className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2">
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>Crypto</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2"
                required
              />
              <button type="submit" className="btn-primary w-full rounded-md px-4 py-2 font-semibold">
                Create Deposit
              </button>
            </form>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
            <form onSubmit={handleWithdrawal} className="space-y-3">
              <select className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2">
                <option>Bank Transfer</option>
                <option>Wire Transfer</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2"
                required
              />
              <button type="submit" className="btn-secondary w-full rounded-md px-4 py-2 font-semibold">
                Request Withdrawal
              </button>
            </form>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Reference</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-3 opacity-80">No transactions yet</td>
                  <td className="py-3">-</td>
                  <td className="py-3">-</td>
                  <td className="py-3">-</td>
                  <td className="py-3">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
