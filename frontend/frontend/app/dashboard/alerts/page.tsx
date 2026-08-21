'use client';

import { Droplet, RefreshCw, AlertCircle, CloudRain, BarChart3 } from 'lucide-react';

export default function FieldOverviewPage() {
  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-8 text-stone-900">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Field Overview</h1>
        <p className="text-xs text-stone-500 mt-1">Monitor and manage your vital resources.</p>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Main Reservoir (8 cols) */}
        <div className="col-span-8 bg-brand-card p-6 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-emerald-800" />
                <h2 className="font-serif text-xl font-bold text-stone-900">Main Reservoir</h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Central Water Storage</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Filling
            </span>
          </div>

          <div className="mt-8 flex items-end justify-between">
            {/* Reservoir Fill Graphic */}
            <div className="w-1/2 h-24 bg-stone-200/60 rounded-xl relative overflow-hidden">
              <div className="absolute bottom-0 w-full h-[82%] bg-emerald-200 border-t-2 border-emerald-400"></div>
            </div>

            {/* Metrics */}
            <div className="text-right space-y-1">
              <div className="font-serif text-4xl font-bold">82%</div>
              <p className="text-xs text-stone-500 font-mono">41,000 / 50,000 L</p>
              <div className="pt-2 text-xs text-stone-600 space-y-0.5">
                <div className="flex justify-between gap-6"><span>Inflow Rate</span><span className="font-mono font-semibold">120 L/min</span></div>
                <div className="flex justify-between gap-6"><span>Est. Full</span><span className="font-mono font-semibold">1h 15m</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Required Box (4 cols) */}
        <div className="col-span-4 bg-brand-accent p-6 rounded-2xl text-white flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-300" />
              <h2 className="font-serif text-xl font-bold">Action Required</h2>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Soil moisture in Field A has dropped below the critical threshold. Immediate irrigation is recommended to prevent yield loss.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
              <span className="text-[11px] text-emerald-200 uppercase font-mono tracking-wider">Target Volume</span>
              <div className="font-serif text-2xl font-bold">1,200 L</div>
            </div>
            <button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
              <Droplet className="w-4 h-4 fill-current" />
              Irrigate Now
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Cards Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Soil Moisture (5 cols) */}
        <div className="col-span-5 bg-brand-card p-6 rounded-2xl border border-stone-200/60">
          <h3 className="font-serif text-base font-bold text-stone-900 mb-4">Soil Moisture</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-rose-50 border border-rose-200/60 rounded-xl text-center">
              <span className="text-xs text-stone-500">Field A</span>
              <div className="font-serif text-2xl font-bold text-stone-900 my-1">45%</div>
              <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-100 px-2 py-0.5 rounded">Low</span>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200/60 rounded-xl text-center">
              <span className="text-xs text-stone-500">Field B</span>
              <div className="font-serif text-2xl font-bold text-stone-900 my-1">62%</div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">Optimal</span>
            </div>
          </div>
        </div>

        {/* Microclimate (3 cols) */}
        <div className="col-span-3 bg-brand-card p-6 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-stone-700">Microclimate (24h)</span>
            <CloudRain className="w-4 h-4 text-stone-500" />
          </div>
          <div className="space-y-2 text-xs mt-4">
            <div className="flex justify-between text-stone-600"><span>Rain Prob.</span><span className="font-bold text-stone-900">20%</span></div>
            <div className="flex justify-between text-stone-600"><span>Expected</span><span className="font-bold text-stone-900">5mm</span></div>
          </div>
        </div>

        {/* Usage (4 cols) */}
        <div className="col-span-4 bg-brand-card p-6 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-700">Usage (7d)</span>
            <BarChart3 className="w-4 h-4 text-stone-500" />
          </div>
          {/* Mock Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-20 pt-4">
            {[40, 60, 30, 80, 50, 95, 25].map((height, i) => (
              <div key={i} className="flex-1 bg-stone-200/80 rounded-t-sm h-full flex items-end">
                <div
                  className={`w-full rounded-t-sm ${i === 5 ? 'bg-brand-orange' : i === 3 ? 'bg-emerald-950' : 'bg-emerald-300'}`}
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}