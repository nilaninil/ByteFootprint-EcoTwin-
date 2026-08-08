import React, { useState } from 'react';
import { LogEntry } from '../types';
import { TWIN_STAGES } from '../data/staticData';
import { deriveTwinStage } from '../services/storage';
import { TreeTimelineGallery } from './TreeTimelineGallery';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, Film, Monitor, ShieldCheck, Flame, Info } from 'lucide-react';

interface TrendsViewProps {
  history: LogEntry[];
}

export const TrendsView: React.FC<TrendsViewProps> = ({ history }) => {
  const [selectedDayLog, setSelectedDayLog] = useState<LogEntry | null>(
    history.length > 0 ? history[history.length - 1] : null
  );

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-emerald-100 max-w-xl mx-auto my-8">
        <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1B2B1E]">No Trend Data Yet</h3>
        <p className="text-xs text-gray-500 mt-1">Log your first daily habits to unlock carbon footprint trends and the EcoTwin progression filmstrip!</p>
      </div>
    );
  }

  // Prepare Recharts data format
  const chartData = history.slice(-14).map(item => ({
    date: item.date.slice(5), // MM-DD
    fullDate: item.date,
    Transport: item.footprintByCategory.transport,
    Food: item.footprintByCategory.food,
    Energy: item.footprintByCategory.energy,
    Digital: item.footprintByCategory.digital,
    Total: item.totalFootprint
  }));

  // Calculate Summary Metrics
  const totalTracked = history.reduce((sum, h) => sum + h.totalFootprint, 0);
  const avgDaily = Number((totalTracked / history.length).toFixed(1));
  
  const totalDigital = history.reduce((sum, h) => sum + h.footprintByCategory.digital, 0);
  const digitalShare = Math.round((totalDigital / totalTracked) * 100) || 0;

  const bestDay = [...history].sort((a, b) => a.totalFootprint - b.totalFootprint)[0];

  // Pie chart data for category breakdown
  const totalTransport = history.reduce((sum, h) => sum + h.footprintByCategory.transport, 0);
  const totalFood = history.reduce((sum, h) => sum + h.footprintByCategory.food, 0);
  const totalEnergy = history.reduce((sum, h) => sum + h.footprintByCategory.energy, 0);

  const pieData = [
    { name: 'Transport', value: Number(totalTransport.toFixed(1)), color: '#3B82F6' },
    { name: 'Food', value: Number(totalFood.toFixed(1)), color: '#10B981' },
    { name: 'Energy', value: Number(totalEnergy.toFixed(1)), color: '#8B5CF6' },
    { name: 'Digital (Hidden)', value: Number(totalDigital.toFixed(1)), color: '#D97706' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Stats Grid */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B1E] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2F8F5B]" />
              <span>Footprint Trends & Filmstrip</span>
            </h2>
            <p className="text-xs text-gray-500">
              Track carbon footprint by category over the past {chartData.length} days.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Digital Share: <strong>{digitalShare}%</strong>
            </span>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="block text-[10px] uppercase font-semibold text-gray-500">Avg Daily Footprint</span>
            <span className="text-lg font-extrabold text-[#2F8F5B]">{avgDaily} kg</span>
            <span className="block text-[10px] text-gray-500 mt-0.5">CO2e per day</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="block text-[10px] uppercase font-bold text-amber-800">Digital Carbon Share</span>
            <span className="text-lg font-extrabold text-amber-900">{digitalShare}%</span>
            <span className="block text-[10px] text-amber-700 mt-0.5">{totalDigital.toFixed(1)} kg digital total</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="block text-[10px] uppercase font-semibold text-emerald-800">Best Low-Carbon Day</span>
            <span className="text-lg font-extrabold text-emerald-900">{bestDay ? `${bestDay.totalFootprint} kg` : 'N/A'}</span>
            <span className="block text-[10px] text-emerald-700 mt-0.5">{bestDay?.date}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="block text-[10px] uppercase font-semibold text-gray-500">Total Tracked Logs</span>
            <span className="text-lg font-extrabold text-gray-800">{history.length} Days</span>
            <span className="block text-[10px] text-gray-500 mt-0.5">{totalTracked.toFixed(1)} kg cumulative</span>
          </div>
        </div>
      </div>

      {/* HISTORICAL ECOTWIN TREE TIMELINE GALLERY */}
      <TreeTimelineGallery history={history} />

      {/* STACKED BAR CHART */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-900/10">
        <h3 className="text-base font-bold text-[#1B2B1E] mb-4 flex items-center justify-between">
          <span>Daily CO2 Breakdown (Past 14 Days)</span>
          <span className="text-xs text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md font-semibold">
            Amber = Digital Footprint
          </span>
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} unit=" kg" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1B2B1E',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                  padding: '12px'
                }}
                formatter={(val: any, name: any) => [`${val} kg CO2e`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Transport" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Food" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Energy" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Digital" stackId="a" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TWIN STATE FILMSTRIP */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-900/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#1B2B1E] flex items-center gap-2">
            <Film className="w-5 h-5 text-emerald-600" />
            <span>EcoTwin Progression Filmstrip</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">Scroll horizontally →</span>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Click any day card in the filmstrip to view its complete habit breakdown.
        </p>

        {/* Horizontal Filmstrip Slider */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 pt-1">
          {history.map((log, idx) => {
            const subHistory = history.slice(0, idx + 1);
            const stage = deriveTwinStage(subHistory);
            const stageInfo = TWIN_STAGES[stage];
            const isSelected = selectedDayLog?.id === log.id;

            return (
              <div
                key={log.id}
                onClick={() => setSelectedDayLog(log)}
                className={`shrink-0 w-36 p-3 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#F6FAF4] border-[#2F8F5B] ring-2 ring-[#2F8F5B]/30 shadow-md scale-102'
                    : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-[10px] font-bold text-gray-500 mb-1 flex justify-between items-center">
                  <span>Day {idx + 1}</span>
                  <span>{log.date.slice(5)}</span>
                </div>

                {/* Mini Stage Badge */}
                <div 
                  className="py-1 px-2 rounded-lg text-[10px] font-extrabold text-white text-center mb-2"
                  style={{ backgroundColor: stageInfo.color }}
                >
                  Stage {stage}: {stageInfo.name}
                </div>

                <div className="text-center my-1">
                  <span className="text-sm font-extrabold text-[#1B2B1E]">{log.totalFootprint} kg</span>
                </div>

                <div className="mt-2 text-[10px] font-semibold text-gray-500 border-t pt-1.5 flex items-center justify-between">
                  <span>Worst:</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                    log.worstCategory === 'digital' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {log.worstCategory}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Details Panel */}
        {selectedDayLog && (
          <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <h4 className="font-bold text-sm text-[#1B2B1E] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Details for {selectedDayLog.date}</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Transport:</span>
                <span className="font-bold">{selectedDayLog.footprintByCategory.transport} kg CO2e</span>
                <span className="block text-[10px] text-gray-600">{selectedDayLog.transportKm}km ({selectedDayLog.transportMode})</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Meals:</span>
                <span className="font-bold">{selectedDayLog.footprintByCategory.food} kg CO2e</span>
                <span className="block text-[10px] text-gray-600">{selectedDayLog.meals} meals ({selectedDayLog.meatMeals} meat)</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Energy:</span>
                <span className="font-bold">{selectedDayLog.footprintByCategory.energy} kg CO2e</span>
                <span className="block text-[10px] text-gray-600">Level {selectedDayLog.energyLevel} usage</span>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950">
                <span className="text-amber-800 block text-[10px] font-bold">Digital (Hidden):</span>
                <span className="font-bold text-amber-900">{selectedDayLog.footprintByCategory.digital} kg CO2e</span>
                <span className="block text-[10px] text-amber-800">{selectedDayLog.streamingHours}h {selectedDayLog.streamingQuality} stream</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Pie Chart & Educational Note */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-900/10 flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#1B2B1E] mb-2">Category Distribution</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1B2B1E] text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-3">
              <Monitor className="w-3.5 h-3.5" />
              <span>Digital Carbon Insight</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-emerald-100">Why Digital Footprint Matters</h3>
            <p className="text-xs text-gray-300 leading-relaxed space-y-2">
              Streaming 4K video for 2 hours consumes ~700g CO2 equivalent. In comparison, taking a 10km electric train ride emits under 350g CO2!
              <br /><br />
              By making small tweaks like dropping video stream quality to 720p or cleaning cloud backups, you can drastically boost your EcoTwin Green Score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
