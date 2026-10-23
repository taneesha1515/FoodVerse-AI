import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = "emerald" }) {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "glow-emerald"
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "glow-amber"
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-400",
      glow: ""
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      glow: ""
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`p-4 rounded-2xl glass-card transition-all hover:border-slate-600/60 ${scheme.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl ${scheme.bg} ${scheme.text} ${scheme.border} border`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400">{trend}</span>
        )}
      </div>
      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
