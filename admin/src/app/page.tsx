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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAdjustBalanceModal, setShowAdjustBalanceModal] = useState(false);
  const [showImpersonateModal, setShowImpersonateModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    setIsAuthenticated(true);
    
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'withdrawals') {
      fetchWithdrawals();
    }
  }, [activeTab, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.replace("/login");
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sortBy,
        sortOrder,
        ...(statusFilter && { status: statusFilter }),
      });
      
      const res = await fetch(`${API_BASE}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
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
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
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
      const res = await fetch(`${API_BASE}/admin/users/${userId}/adjust-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          type,
          reason,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to adjust balance');
      }
      
      alert('Balance adjusted successfully');
      if (selectedUser?.id === userId) {
        // Refresh user data
        const userRes = await fetch(`${API_BASE}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setSelectedUser(await userRes.json());
      }
      fetchUsers(); // Refresh users list
    } catch (error) {
      alert('Failed to adjust balance: ' + (error as Error).message);
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject', note: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/withdrawals/${withdrawalId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          adminId: 'current-admin', // In real app, get from auth context
          note,
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to ${action} withdrawal`);
      }
      
      alert(`Withdrawal ${action}d successfully`);
      fetchWithdrawals();
    } catch (error) {
      alert(`Failed to ${action} withdrawal: ` + (error as Error).message);
    }
  };

  const handleFreezeAccount = async (userId: string, reason: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/freeze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!res.ok) throw new Error('Failed to freeze account');
      alert('Account frozen successfully');
      fetchUsers();
    } catch (error) {
      alert('Failed to freeze account: ' + (error as Error).message);
    }
  };

  const handleUnfreezeAccount = async (userId: string, reason: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/unfreeze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!res.ok) throw new Error('Failed to unfreeze account');
      alert('Account unfrozen successfully');
      fetchUsers();
    } catch (error) {
      alert('Failed to unfreeze account: ' + (error as Error).message);
    }
  };

  const handleImpersonateUser = async (userId: string, reason: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/impersonate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!res.ok) throw new Error('Failed to generate impersonation token');
      
      const data = await res.json();
      
      // Store impersonation token and redirect to frontend with special token
      localStorage.setItem('impersonationToken', data.impersonationToken);
      localStorage.setItem('impersonatedUserId', userId);
      
      // Open user dashboard in new tab
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
      window.open(`${frontendUrl}/dashboard?impersonate=${data.impersonationToken}`, '_blank');
      
      alert('Impersonation session started. User dashboard opened in new tab.');
    } catch (error) {
      alert('Failed to start impersonation: ' + (error as Error).message);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      localStorage.setItem("adminToken", data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      alert('Login failed: ' + (error as Error).message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2"
              />
            </div>
            <button type="submit" className="btn-primary w-full rounded-md px-4 py-2 font-semibold">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="glass-strong border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">Aspire Secure Trade - Admin Panel</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm opacity-80 hidden sm:block">Admin Dashboard</span>
            <button
              onClick={handleLogout}
              className="btn-secondary rounded-lg px-3 py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'users' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'withdrawals' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Audit Log
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">Users</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-md bg-black/20 border border-white/20 px-3 py-2 text-sm"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md bg-black/20 border border-white/20 px-3 py-2 text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="frozen">Frozen</option>
                    <option value="kyc_pending">KYC Pending</option>
                    <option value="kyc_approved">KYC Approved</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-md bg-black/20 border border-white/20 px-3 py-2 text-sm"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="email">Email</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="rounded-md bg-black/20 border border-white/20 px-3 py-2 text-sm"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                  <button
                    onClick={fetchUsers}
                    className="btn-primary rounded-md px-4 py-2 font-semibold text-sm"
                  >
                    Search
                  </button>
                </div>
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 sm:py-3 px-2">Name</th>
                        <th className="text-left py-2 sm:py-3 px-2 hidden sm:table-cell">Email</th>
                        <th className="text-left py-2 sm:py-3 px-2 hidden md:table-cell">Phone</th>
                        <th className="text-left py-2 sm:py-3 px-2">Country</th>
                        <th className="text-left py-2 sm:py-3 px-2">KYC</th>
                        <th className="text-left py-2 sm:py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-white/5">
                          <td className="py-2 sm:py-3 px-2">
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-gray-400 sm:hidden">{user.email || '-'}</div>
                          </td>
                          <td className="py-2 sm:py-3 px-2 hidden sm:table-cell">{user.email || '-'}</td>
                          <td className="py-2 sm:py-3 px-2 hidden md:table-cell">{user.phoneE164 || '-'}</td>
                          <td className="py-2 sm:py-3 px-2">{user.countryCode}</td>
                          <td className="py-2 sm:py-3 px-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.kycStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                              user.kycStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {user.kycStatus}
                            </span>
                          </td>
                          <td className="py-2 sm:py-3 px-2">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-[var(--accent)] hover:underline text-xs"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Reason for freezing account:');
                                  if (reason) handleFreezeAccount(user.id, reason);
                                }}
                                className="text-red-400 hover:underline text-xs"
                                disabled={user.isFrozen}
                              >
                                {user.isFrozen ? 'Frozen' : 'Freeze'}
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Reason for unfreezing account:');
                                  if (reason) handleUnfreezeAccount(user.id, reason);
                                }}
                                className="text-green-400 hover:underline text-xs"
                                disabled={!user.isFrozen}
                              >
                                Unfreeze
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Reason for impersonation:');
                                  if (reason) handleImpersonateUser(user.id, reason);
                                }}
                                className="text-blue-400 hover:underline text-xs"
                              >
                                Login As
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="glass rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">User Details: {selectedUser.firstName} {selectedUser.lastName}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Profile Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span>{selectedUser.email || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span>{selectedUser.phoneE164 || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Country:</span>
                        <span>{selectedUser.countryCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">KYC Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedUser.kycStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                          selectedUser.kycStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {selectedUser.kycStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Status:</span>
                        <span className={selectedUser.isFrozen ? 'text-red-400' : 'text-green-400'}>
                          {selectedUser.isFrozen ? 'Frozen' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Balance Adjustment</h4>
                    <div className="space-y-3">
                      <input
                        type="number"
                        placeholder="Amount (USD)"
                        id="adjustAmount"
                        className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2 text-sm"
                      />
                      <select id="adjustType" className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2 text-sm">
                        <option value="credit">Credit (Add Funds)</option>
                        <option value="debit">Debit (Remove Funds)</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Reason for adjustment"
                        id="adjustReason"
                        className="w-full rounded-md bg-black/20 border border-white/20 px-3 py-2 text-sm"
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
                        className="btn-primary w-full rounded-md px-4 py-2 font-semibold text-sm"
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
          <div className="glass rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">Withdrawal Requests</h2>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 sm:py-3 px-2">User</th>
                      <th className="text-left py-2 sm:py-3 px-2">Amount</th>
                      <th className="text-left py-2 sm:py-3 px-2 hidden sm:table-cell">Method</th>
                      <th className="text-left py-2 sm:py-3 px-2">Status</th>
                      <th className="text-left py-2 sm:py-3 px-2 hidden md:table-cell">Date</th>
                      <th className="text-left py-2 sm:py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-white/5">
                        <td className="py-2 sm:py-3 px-2">
                          <div className="font-medium">{withdrawal.user.firstName} {withdrawal.user.lastName}</div>
                          <div className="text-xs text-gray-400 sm:hidden">{withdrawal.method}</div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 font-medium">{withdrawal.amount} {withdrawal.currency}</td>
                        <td className="py-2 sm:py-3 px-2 hidden sm:table-cell">{withdrawal.method}</td>
                        <td className="py-2 sm:py-3 px-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            withdrawal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            withdrawal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {withdrawal.status}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 hidden md:table-cell text-xs text-gray-400">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 sm:py-3 px-2">
                          {withdrawal.status === 'requested' && (
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <button
                                onClick={() => {
                                  const note = prompt('Approval note:');
                                  if (note) handleWithdrawalAction(withdrawal.id, 'approve', note);
                                }}
                                className="text-green-400 hover:underline text-xs bg-green-500/10 px-2 py-1 rounded"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  const note = prompt('Rejection reason:');
                                  if (note) handleWithdrawalAction(withdrawal.id, 'reject', note);
                                }}
                                className="text-red-400 hover:underline text-xs bg-red-500/10 px-2 py-1 rounded"
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
