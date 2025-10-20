"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'audit'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'withdrawals') {
      fetchWithdrawals();
    }
  }, [activeTab, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/withdrawals`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const data = await res.json();
      setWithdrawals(data.withdrawals);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async (userId: string, amount: string, type: 'credit' | 'debit', reason: string) => {
    try {
      await fetch(`${API_BASE}/admin/users/${userId}/adjust-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          type,
          reason,
        }),
      });
      alert('Balance adjusted successfully');
      if (selectedUser?.id === userId) {
        // Refresh user data
        const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setSelectedUser(await res.json());
      }
    } catch (error) {
      alert('Failed to adjust balance');
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject', note: string) => {
    try {
      await fetch(`${API_BASE}/admin/withdrawals/${withdrawalId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          adminId: 'current-admin', // In real app, get from auth context
          note,
        }),
      });
      alert(`Withdrawal ${action}d successfully`);
      fetchWithdrawals();
    } catch (error) {
      alert(`Failed to ${action} withdrawal`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              router.replace("/login");
            }}
            className="text-sm opacity-80 hover:opacity-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'users' ? 'bg-[var(--accent)] text-black' : 'bg-white/10'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'withdrawals' ? 'bg-[var(--accent)] text-black' : 'bg-white/10'
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'audit' ? 'bg-[var(--accent)] text-black' : 'bg-white/10'
            }`}
          >
            Audit Log
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Users</h2>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3">Name</th>
                        <th className="text-left py-3">Email</th>
                        <th className="text-left py-3">Phone</th>
                        <th className="text-left py-3">Country</th>
                        <th className="text-left py-3">KYC Status</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-white/5">
                          <td className="py-3">{user.firstName} {user.lastName}</td>
                          <td className="py-3">{user.email || '-'}</td>
                          <td className="py-3">{user.phoneE164 || '-'}</td>
                          <td className="py-3">{user.countryCode}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.kycStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                              user.kycStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {user.kycStatus}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-[var(--accent)] hover:underline"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">User Details: {selectedUser.firstName} {selectedUser.lastName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Profile</h4>
                    <div className="space-y-2 text-sm">
                      <div>Email: {selectedUser.email || '-'}</div>
                      <div>Phone: {selectedUser.phoneE164 || '-'}</div>
                      <div>Country: {selectedUser.countryCode}</div>
                      <div>KYC: {selectedUser.kycStatus}</div>
                      <div>Frozen: {selectedUser.isFrozen ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Balance Adjustment</h4>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        id="adjustAmount"
                        className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2"
                      />
                      <select id="adjustType" className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2">
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Reason"
                        id="adjustReason"
                        className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2"
                      />
                      <button
                        onClick={() => {
                          const amount = (document.getElementById('adjustAmount') as HTMLInputElement)?.value;
                          const type = (document.getElementById('adjustType') as HTMLSelectElement)?.value as 'credit' | 'debit';
                          const reason = (document.getElementById('adjustReason') as HTMLInputElement)?.value;
                          if (amount && reason) {
                            handleAdjustBalance(selectedUser.id, amount, type, reason);
                          }
                        }}
                        className="btn-primary w-full rounded-md px-4 py-2 font-semibold"
                      >
                        Adjust Balance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Withdrawal Requests</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3">User</th>
                      <th className="text-left py-3">Amount</th>
                      <th className="text-left py-3">Method</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-white/5">
                        <td className="py-3">{withdrawal.user.firstName} {withdrawal.user.lastName}</td>
                        <td className="py-3">{withdrawal.amount} {withdrawal.currency}</td>
                        <td className="py-3">{withdrawal.method}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            withdrawal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            withdrawal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {withdrawal.status}
                          </span>
                        </td>
                        <td className="py-3">{new Date(withdrawal.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          {withdrawal.status === 'requested' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const note = prompt('Approval note:');
                                  if (note) handleWithdrawalAction(withdrawal.id, 'approve', note);
                                }}
                                className="text-green-400 hover:underline text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  const note = prompt('Rejection reason:');
                                  if (note) handleWithdrawalAction(withdrawal.id, 'reject', note);
                                }}
                                className="text-red-400 hover:underline text-xs"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Audit Log</h2>
            <div className="text-sm opacity-80">Audit log functionality would be implemented here</div>
          </div>
        )}
      </main>
    </div>
  );
}
