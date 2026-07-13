import React, { useState, useMemo } from 'react';
import { MOCK_EMPLOYEES } from '../data';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Users, Clock, Award, ShieldAlert, Search, RefreshCw, Send, CheckCircle, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

// Sample time-series study hours
const WEEKLY_STUDY_DATA = [
  { day: 'Mon', hours: 24, activeStudents: 5 },
  { day: 'Tue', hours: 38, activeStudents: 8 },
  { day: 'Wed', hours: 45, activeStudents: 10 },
  { day: 'Thu', hours: 32, activeStudents: 6 },
  { day: 'Fri', hours: 52, activeStudents: 12 },
  { day: 'Sat', hours: 18, activeStudents: 4 },
  { day: 'Sun', hours: 15, activeStudents: 3 }
];

// Topic enrollment breakdown
const TOPIC_BREAKDOWN_DATA = [
  { category: 'Cloud', students: 4, labsCompleted: 12 },
  { category: 'DevOps', students: 6, labsCompleted: 18 },
  { category: 'Agile', students: 5, labsCompleted: 15 },
  { category: 'AI & Data', students: 3, labsCompleted: 9 },
  { category: 'Frontend', students: 4, labsCompleted: 10 },
  { category: 'Product', students: 2, labsCompleted: 5 }
];

export default function AdminAnalytics() {
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.department.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.email.toLowerCase().includes(employeeSearch.toLowerCase());
      return matchSearch;
    });
  }, [employeeSearch]);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Successfully synchronized all learning records with company AD registry.');
    }, 1000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleInvite = (empName: string) => {
    showToast(`Squad invite dispatched to ${empName} for the upcoming Kubernetes CKA Live workshop!`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10" id="admin-analytics-dashboard">
      
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Sync Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="text-left">
          <h2 className="font-display text-2xl font-light tracking-tight text-[#1A1A1B] flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-xebia-purple animate-pulse" />
            <span>Corporate <span className="font-bold">Academy Dashboard</span></span>
          </h2>
          <p className="mt-1 text-sm text-gray-500 font-serif italic">
            Monitor learning velocity, certification target tracking, and employee growth logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={triggerRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-gray-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            id="admin-sync-btn"
          >
            <RefreshCw className={`h-4 w-4 text-xebia-purple ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Resyncing...' : 'Sync Enterprise Registry'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="admin-kpi-grid">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 xebia-card-shadow text-left">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Squad Members</span>
            <Users className="h-5 w-5 text-xebia-purple" />
          </div>
          <span className="text-3xl font-black text-[#1A1A1B]">{MOCK_EMPLOYEES.length} Active</span>
          <span className="text-[10.5px] text-emerald-600 font-semibold block mt-1.5">100% Onboarded</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 xebia-card-shadow text-left">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Avg Completion Rate</span>
            <Award className="h-5 w-5 text-xebia-orange" />
          </div>
          <span className="text-3xl font-black text-[#1A1A1B]">73.3%</span>
          <span className="text-[10.5px] text-emerald-600 font-semibold block mt-1.5">+4.2% This Quarter</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 xebia-card-shadow text-left">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Study Hours Logged</span>
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <span className="text-3xl font-black text-[#1A1A1B]">268.5 Hrs</span>
          <span className="text-[10.5px] text-emerald-600 font-semibold block mt-1.5">+24 hrs this week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 xebia-card-shadow text-left">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Certifications Earned</span>
            <Award className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-[#1A1A1B]">11 Badges</span>
          <span className="text-[10.5px] text-amber-600 font-semibold block mt-1.5">3 Pending Audit</span>
        </div>

      </div>

      {/* charts visualizations section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="admin-charts-grid">
        
        {/* Learning velocity chart (AreaChart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 xebia-card-shadow text-left space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Weekly Learning Velocity</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Aggregate study hours logged across squads by day.</p>
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_STUDY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#831B84" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#831B84" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelClassName="text-slate-400 font-semibold text-xs"
                />
                <Area type="monotone" dataKey="hours" stroke="#831B84" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGradient)" name="Study Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic popularity chart (BarChart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 xebia-card-shadow text-left space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Department Stream Enrollment</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Total active employees mapped per practice category.</p>
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOPIC_BREAKDOWN_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelClassName="text-slate-400 font-semibold text-xs"
                />
                <Bar dataKey="students" fill="#FF5A36" radius={[4, 4, 0, 0]} name="Active Enrolled Students" maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Employee progress table container */}
      <div className="bg-white rounded-2xl border border-slate-100 xebia-card-shadow text-left overflow-hidden" id="admin-employee-table-card">
        
        {/* Table filtering toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Employee Progression Log</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Detailed records of active learners, credentials, and last log activity.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute top-2.5 left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, role, or team..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="w-full bg-slate-50/50 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-xebia-purple/40"
            />
          </div>
        </div>

        {/* Responsive Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-4 px-6">Squad Member</th>
                <th className="py-4 px-4">Topic / Team</th>
                <th className="py-4 px-4">Completion Progress</th>
                <th className="py-4 px-4">Study Logs</th>
                <th className="py-4 px-4">Credentials</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No matching squad members found in database.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* User profile identifier */}
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-50 text-xebia-purple flex items-center justify-center font-bold text-[11px] shrink-0 border border-purple-100">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="block font-bold text-slate-800 text-sm">{emp.name}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{emp.email}</span>
                      </div>
                    </td>

                    {/* Team & role */}
                    <td className="py-4 px-4">
                      <span className="block text-slate-700 font-semibold">{emp.role}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{emp.department}</span>
                    </td>

                    {/* Progress tracking */}
                    <td className="py-4 px-4 w-48">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-bold text-slate-600">{emp.completionRate}%</span>
                          <span className="text-slate-400">Completed: {emp.completedCount}/{emp.enrolledCount}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${
                            emp.completionRate === 100 ? 'bg-emerald-500' :
                            emp.completionRate > 60 ? 'bg-xebia-purple' :
                            'bg-amber-500'
                          }`} style={{ width: `${emp.completionRate}%` }} />
                        </div>
                      </div>
                    </td>

                    {/* Logs Hours */}
                    <td className="py-4 px-4">
                      <span className="block text-slate-800 font-bold">{emp.learningHours} Hours</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">Last active: {emp.lastActive}</span>
                    </td>

                    {/* Status cert count */}
                    <td className="py-4 px-4">
                      {emp.completionRate === 100 ? (
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider">
                          All Certified
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider">
                          In Progress
                        </span>
                      )}
                    </td>

                    {/* Actions dropdown triggers */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleInvite(emp.name)}
                        className="inline-flex items-center space-x-1 text-xebia-purple hover:text-purple-800 font-bold hover:underline cursor-pointer"
                      >
                        <Send className="h-3 w-3" />
                        <span>Invite to Live Session</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
