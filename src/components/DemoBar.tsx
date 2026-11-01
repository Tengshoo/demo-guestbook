'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Smartphone,
  Camera,
  Tv,
  ShieldCheck,
  RotateCcw,
  Plus,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { addQuickDemoEntry, resetDemoEntries } from '@/lib/supabase';

export default function DemoBar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 2500);
  };

  const handleAddTest = () => {
    try {
      const added = addQuickDemoEntry();
      showFeedback(`🎉 Toast added from "${added.name.replace(' (Live Test)', '')}"!`);
    } catch {
      showFeedback('Added test toast!');
    }
  };

  const handleReset = () => {
    if (confirm('Reset demo wishes and moderation statuses back to default?')) {
      resetDemoEntries();
      showFeedback('🔄 Demo data reset!');
    }
  };

  const navItems = [
    { href: '/', label: 'Guestbook', icon: Smartphone },
    { href: '/photobooth', label: 'Photobooth', icon: Camera },
    { href: '/wall', label: 'Live Wall', icon: Tv },
    { href: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  if (isCollapsed) {
    return (
      <div className="fixed top-3 right-3 z-50 animate-fade-in">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/85 hover:bg-stone-900 text-champagne-200 border border-champagne-500/30 shadow-xl backdrop-blur-md text-xs font-medium tracking-wide transition-all transform hover:scale-105 active:scale-95"
          title="Expand Demo Controls"
        >
          <Sparkles className="w-3 h-3 text-champagne-400" />
          <span>Demo</span>
          <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Demo Navigation"
      className="fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] transition-all duration-200"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-full bg-stone-950/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-stone-100">
        {/* Subtle Demo Indicator */}
        <div className="flex items-center gap-1.5 pl-1.5 pr-1 text-[11px] font-semibold text-champagne-300 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-champagne-400 animate-pulse" />
          <span className="hidden sm:inline">DEMO</span>
        </div>

        <div className="w-[1px] h-3.5 bg-white/15" />

        {/* Clean Segmented Navigation (No tags, no scrollbars) */}
        <nav className="flex items-center gap-0.5 sm:gap-1 p-0.5 rounded-full bg-white/5 no-scrollbar">
          {navItems.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs transition-all ${
                  isActive
                    ? 'bg-champagne-500/25 text-champagne-100 font-medium border border-champagne-400/35 shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-champagne-300' : 'text-stone-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="w-[1px] h-3.5 bg-white/15" />

        {/* Actions: Add Toast + Reset + Minimize */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleAddTest}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-champagne-500/20 hover:bg-champagne-500/30 text-champagne-200 border border-champagne-400/30 text-xs font-medium transition active:scale-95 whitespace-nowrap"
            title="Simulate a new guest wish"
          >
            <Plus className="w-3.5 h-3.5 text-champagne-300" />
            <span className="hidden sm:inline">Toast</span>
          </button>

          <button
            onClick={handleReset}
            type="button"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-200 hover:bg-white/10 transition active:scale-95"
            title="Reset demo entries back to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            type="button"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-200 hover:bg-white/10 transition"
            title="Minimize bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transient Notification Feedback */}
      {feedbackMsg && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-full bg-stone-900/95 border border-champagne-400/30 text-champagne-300 text-xs flex items-center gap-1.5 shadow-xl whitespace-nowrap animate-fade-in pointer-events-none">
          <Check className="w-3 h-3 text-champagne-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}
    </aside>
  );
}
