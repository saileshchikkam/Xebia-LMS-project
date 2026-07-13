import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Network, Flame, Sparkles, Calculator, HelpCircle, ShieldCheck, CheckCircle2, RefreshCw, Layers, Calendar, ChevronRight, Info } from 'lucide-react';

export default function SubnetCalculator() {
  // Subnet Calculator States
  const [baseIp, setBaseIp] = useState<string>('10.0.0.0');
  const [cidrBits, setCidrBits] = useState<number>(16);
  const [subnetCount, setSubnetCount] = useState<number>(4);
  const [showReservesInfo, setShowReservesInfo] = useState<boolean>(true);

  // Learning Streak Calculator States
  const [currentStreak, setCurrentStreak] = useState<number>(5);
  const [dailyHours, setDailyHours] = useState<number>(1.5);
  const [targetCert, setTargetCert] = useState<string>('aws-arch');

  // Subnet Calculation Logic
  const calculateSubnets = () => {
    // Validate IP format
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = baseIp.match(ipPattern);
    if (!match) return [];

    const octets = match.slice(1, 5).map(Number);
    const isValidIp = octets.every(o => o >= 0 && o <= 255);
    if (!isValidIp) return [];

    // Simple subnet splitting calculations for common AWS block scopes
    // We split the base block into subnets
    const list = [];
    const splits = Math.ceil(Math.log2(subnetCount));
    const targetCidr = cidrBits + splits;
    const totalIps = Math.pow(2, 32 - targetCidr);
    const usableIps = Math.max(0, totalIps - 5); // AWS reserves 5 IPs: Network, Router, DNS, Reserve, Broadcast

    // Create netmask string
    let maskBinary = ''.padStart(targetCidr, '1').padEnd(32, '0');
    const maskOctets = [];
    for (let i = 0; i < 4; i++) {
      maskOctets.push(parseInt(maskBinary.substring(i * 8, i * 8 + 8), 2));
    }
    const netmaskStr = maskOctets.join('.');

    // Calculate start ranges
    for (let i = 0; i < subnetCount; i++) {
      const startIpOffset = i * totalIps;
      
      // Calculate octets
      let tempOctets = [...octets];
      let carry = startIpOffset;
      
      for (let j = 3; j >= 0; j--) {
        const val = tempOctets[j] + carry;
        tempOctets[j] = val % 256;
        carry = Math.floor(val / 256);
      }

      // End range calculations
      let endOctets = [...tempOctets];
      let endOffset = totalIps - 1;
      let endCarry = endOffset;
      for (let j = 3; j >= 0; j--) {
        const val = endOctets[j] + endCarry;
        endOctets[j] = val % 256;
        endCarry = Math.floor(val / 256);
      }

      const subnetName = i === 0 ? 'Public Subnet (ALB-Primary)' : i === 1 ? 'Private App Subnet A' : i === 2 ? 'Private DB Subnet A' : `Spare Private Subnet ${i - 2}`;

      list.push({
        name: subnetName,
        cidr: `${tempOctets.join('.')}/${targetCidr}`,
        range: `${tempOctets.join('.')} - ${endOctets.join('.')}`,
        totalIps,
        usableIps,
        reservedIps: 5,
        netmask: netmaskStr,
        awsReserves: [
          { ip: `${tempOctets[0]}.${tempOctets[1]}.${tempOctets[2]}.${tempOctets[3]}`, use: 'Network Address' },
          { ip: `${tempOctets[0]}.${tempOctets[1]}.${tempOctets[2]}.${tempOctets[3] + 1}`, use: 'VPC Router Gateway' },
          { ip: `${tempOctets[0]}.${tempOctets[1]}.${tempOctets[2]}.${tempOctets[3] + 2}`, use: 'Amazon Provided DNS' },
          { ip: `${tempOctets[0]}.${tempOctets[1]}.${tempOctets[2]}.${tempOctets[3] + 3}`, use: 'Future Reservation' },
          { ip: `${tempOctets[0]}.${tempOctets[1]}.${tempOctets[2]}.${tempOctets[3] + totalIps - 1}`, use: 'Broadcast Address' }
        ]
      });
    }

    return list;
  };

  // Streak Milestones Calculation
  const certsInfo: Record<string, { title: string; hours: number; rewardPoints: number }> = {
    'aws-arch': { title: 'AWS Enterprise Architect Pathway', hours: 24, rewardPoints: 1200 },
    'k8s-prod': { title: 'Kubernetes Production Orchestration (CKA)', hours: 32, rewardPoints: 1600 },
    'genai-dev': { title: 'Generative AI for Devs Pathway', hours: 6, rewardPoints: 500 },
    'scrum-master': { title: 'Professional Scrum Master (PSM I)', hours: 16, rewardPoints: 800 },
    'react-19': { title: 'Advanced React 19 & Architecture', hours: 20, rewardPoints: 1000 }
  };

  const calculateStreakTarget = () => {
    const selected = certsInfo[targetCert] || certsInfo['aws-arch'];
    const totalHours = selected.hours;
    const daysRequired = Math.ceil(totalHours / dailyHours);
    const finalStreak = currentStreak + daysRequired;
    const estimatedPoints = selected.rewardPoints + (daysRequired * 15); // 15 streak-bonus points per day

    return {
      title: selected.title,
      hours: totalHours,
      daysNeeded: daysRequired,
      projectedStreak: finalStreak,
      pointsEarned: estimatedPoints
    };
  };

  const subnetsList = calculateSubnets();
  const streakDetails = calculateStreakTarget();

  return (
    <div className="mx-auto max-w-7xl px-8 py-12 space-y-12 text-left" id="subnet-calculator-tab-view">
      
      {/* Dynamic Slogan banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B090F] text-white p-8 md:p-12 shadow-2xl border border-[#831B84]/20" id="subnet-calculator-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(131,27,132,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-[#831B84]/20 border border-[#831B84]/40 px-3.5 py-1 text-xs font-semibold text-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36] animate-pulse" />
            <span>Interactive Utilities Module</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#FF5A36] block font-semibold">
              Calculations Hub
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-white via-purple-100 to-[#FF5A36] bg-clip-text text-transparent">
              Street / Subnet & Streak Calculator
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 font-serif italic leading-relaxed max-w-2xl">
            Configure enterprise VPC subnets with AWS-specific IP reserves, and schedule your consecutive learning milestones to maximize your Xebia Points!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Subnet Calculator */}
        <section className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-50">
              <div className="p-2.5 bg-purple-50 text-xebia-purple rounded-xl">
                <Network className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black font-sans">VPC Subnet Architecture Calculator</h3>
                <p className="text-xs text-gray-400">Specify network CIDR blocks to compute target routing layouts instantly.</p>
              </div>
            </div>

            {/* Input Config Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                  Base IP Address
                </label>
                <input
                  type="text"
                  value={baseIp}
                  onChange={(e) => setBaseIp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-xebia-purple/50 focus:border-xebia-purple/50 focus:bg-white"
                  placeholder="e.g., 10.0.0.0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                  CIDR Mask bits
                </label>
                <select
                  value={cidrBits}
                  onChange={(e) => setCidrBits(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-xebia-purple/50 focus:bg-white"
                >
                  <option value={16}>/16 (Large VPC - 65,536 IPs)</option>
                  <option value={20}>/20 (Medium VPC - 4,096 IPs)</option>
                  <option value={24}>/24 (Standard Subnet - 256 IPs)</option>
                  <option value={28}>/28 (Small Subnet - 16 IPs)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                  Desired Subnets Splitting
                </label>
                <select
                  value={subnetCount}
                  onChange={(e) => setSubnetCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-xebia-purple/50 focus:bg-white"
                >
                  <option value={2}>2 Subnets (Double Split)</option>
                  <option value={4}>4 Subnets (Standard Squad Split)</option>
                  <option value={8}>8 Subnets (High Density Split)</option>
                </select>
              </div>
            </div>

            {/* AWS Specific Warning Alert Box */}
            <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex items-start space-x-3">
              <Info className="h-4.5 w-4.5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-900 leading-normal">
                <span className="font-bold">AWS VPC Reservation Standard:</span> AWS reserves <span className="font-bold text-amber-700">5 IP addresses</span> in each subnet. These consist of the first four IPs (.0, .1, .2, .3) and the last IP (broadcast address) for routing, DNS, and future extensions.
              </div>
            </div>

            {/* Subnets Generated Grid List */}
            {subnetsList.length > 0 ? (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">Calculated Subnets Allocation</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">✓ Generation Complete</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subnetsList.map((sub, idx) => (
                    <div key={idx} className="border border-slate-100 bg-slate-50/40 rounded-2xl p-5 hover:border-purple-200 transition-colors space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-purple-600 font-mono tracking-wider uppercase">SUBNET #{idx + 1}</span>
                          <h5 className="text-sm font-bold text-slate-900 mt-0.5">{sub.name}</h5>
                        </div>
                        <span className="px-2.5 py-1 bg-white border border-slate-200 font-mono text-xs font-bold rounded-lg text-slate-800 shadow-3xs">
                          {sub.cidr}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-100/70">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Netmask</span>
                          <span className="font-mono text-slate-700 font-medium">{sub.netmask}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Total IPs</span>
                          <span className="font-mono text-slate-700 font-bold">{sub.totalIps} IPs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Usable AWS IPs</span>
                          <span className="font-mono text-emerald-600 font-bold">{sub.usableIps} Usable</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">IP Range Scope</span>
                          <span className="font-mono text-slate-500 text-[10px] line-clamp-1">{sub.range}</span>
                        </div>
                      </div>

                      {/* AWS Reserves Expandable Details */}
                      <div className="mt-3 bg-white border border-slate-100 rounded-xl p-3 space-y-1.5">
                        <span className="text-[9px] font-bold text-amber-600 font-mono tracking-wider uppercase block">AWS Reserved Host Addresses</span>
                        <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-slate-500">
                          {sub.awsReserves.slice(0, 3).map((res, rIdx) => (
                            <div key={rIdx} className="flex justify-between">
                              <span>{res.ip}</span>
                              <span className="text-slate-400 text-[9px] italic">{res.use}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-red-500 font-mono">
                ⚠ Invalid Base IP Address specified. Please use clean octet numbering (e.g., 10.0.0.0).
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Interactive Streak & Career Milestones Calculator */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Streak Calculator Card */}
          <div className="bg-gradient-to-br from-[#1A1A1B] to-black text-white p-6 rounded-3xl relative overflow-hidden space-y-6 shadow-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF5A36] rounded-full blur-[80px] opacity-25 pointer-events-none" />
            
            <div className="relative z-10 flex items-center space-x-3">
              <div className="p-2 bg-white/10 text-[#FF5A36] rounded-xl border border-white/10">
                <Flame className="h-5.5 w-5.5 fill-[#FF5A36]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Study Streak Milestone Goal</h4>
                <p className="text-[10px] text-slate-400">Calculate target streaks & reward bonuses.</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="relative z-10 space-y-4 text-xs">
              
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Active Streak</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={currentStreak}
                    onChange={(e) => setCurrentStreak(Number(e.target.value))}
                    className="flex-1 accent-[#FF5A36] bg-white/10 h-1.5 rounded-full"
                  />
                  <span className="font-mono text-sm font-bold text-white bg-white/10 px-2.5 py-1 rounded-md shrink-0 border border-white/5">
                    {currentStreak} Days
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daily Study Hours Goal</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="flex-1 accent-[#FF5A36] bg-white/10 h-1.5 rounded-full"
                  />
                  <span className="font-mono text-sm font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-md shrink-0 border border-[#FF5A36]/20">
                    {dailyHours}h/day
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Course Certifications</label>
                <select
                  value={targetCert}
                  onChange={(e) => setTargetCert(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A36]/50"
                >
                  <option value="aws-arch" className="bg-slate-900">AWS Enterprise Architecture (24h)</option>
                  <option value="k8s-prod" className="bg-slate-900">Kubernetes Operations (32h)</option>
                  <option value="genai-dev" className="bg-slate-900">Generative AI for Devs (6h)</option>
                  <option value="scrum-master" className="bg-slate-900">Professional Scrum Master (16h)</option>
                  <option value="react-19" className="bg-slate-900">Advanced React 19 (20h)</option>
                </select>
              </div>

            </div>

            {/* Calculation Outputs */}
            <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 text-xs text-left">
              <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-purple-300">Milestone Calculations Output</span>
              
              <div className="space-y-2.5 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total hours needed:</span>
                  <span className="font-mono text-white font-bold">{streakDetails.hours} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consecutive days:</span>
                  <span className="font-mono text-amber-300 font-bold">{streakDetails.daysNeeded} consecutive days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected streak size:</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">{streakDetails.projectedStreak}d Streak 🔥</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2.5">
                  <span className="text-slate-400">Projected points bonus:</span>
                  <span className="font-mono text-[#FF5A36] font-bold">+{streakDetails.pointsEarned} Xebia Points</span>
                </div>
              </div>

              <div className="bg-[#FF5A36]/10 border border-[#FF5A36]/30 p-3 rounded-xl flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FF5A36] shrink-0" />
                <p className="text-[10px] text-slate-300 leading-tight">
                  Maintaining this streak guarantees unlocking the <span className="text-[#FF5A36] font-bold">Xebia Enterprise Architect Badge</span> in {streakDetails.daysNeeded} days!
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Auth & Database Architectures Information panel */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs text-left space-y-4">
            <h4 className="text-sm font-bold text-black flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-xebia-purple" />
              <span>Firebase Auth & DB Alternatives</span>
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-serif italic">
              Our LMS implements an offline-resilient local cache synced instantly to Cloud Firestore. For large scale production pipelines, explore these professional alternatives:
            </p>

            <div className="space-y-3 pt-1">
              
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800">Supabase Auth & Database</span>
                  <span className="text-[8.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">Highly Recommended</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Combines high-performance Row Level Security with enterprise PostgreSQL. Ideal for schema-heavy data relations and instant login.
                </p>
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[9px] font-bold text-xebia-purple hover:underline inline-flex items-center gap-0.5"
                >
                  Explore Supabase Hub →
                </a>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800">Clerk Authentication</span>
                  <span className="text-[8.5px] font-bold bg-purple-50 text-[#831B84] border border-[#831B84]/20 px-1.5 py-0.5 rounded">User-Friendly</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  The ultimate drop-in modern authentication service with robust security filters, multi-factor codes, and custom enterprise single sign-on flows.
                </p>
                <a 
                  href="https://clerk.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[9px] font-bold text-xebia-purple hover:underline inline-flex items-center gap-0.5"
                >
                  Explore Clerk Hub →
                </a>
              </div>

            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
