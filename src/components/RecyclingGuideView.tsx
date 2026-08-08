import React, { useState } from 'react';
import { RECYCLING_GUIDE } from '../data/staticData';
import { RecyclingItem } from '../types';
import { Search, Recycle, Monitor, Info, CheckCircle2 } from 'lucide-react';

export const RecyclingGuideView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<RecyclingItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'electronics', label: '⚡ Electronics & Tech E-Waste' },
    { id: 'plastics', label: '🍾 Plastics' },
    { id: 'paper', label: '📦 Paper & Cardboard' },
    { id: 'metal', label: '🥫 Metals & Cans' },
    { id: 'glass', label: '🫙 Glass' },
    { id: 'compost', label: '🍎 Food & Compost' },
    { id: 'hazardous', label: '⚠️ Hazardous & Batteries' }
  ];

  const filteredItems = RECYCLING_GUIDE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.binName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B1E] flex items-center gap-2">
              <Recycle className="w-5 h-5 text-[#2F8F5B]" />
              <span>Recycling & E-Waste Bin Guide</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Quickly check "What bin does this go in?" — featuring dedicated electronics & digital hardware disposal tips.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300">
            <Monitor className="w-4 h-4 text-amber-700" />
            <span>Includes Tech E-Waste Guide</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items e.g., 'old laptop', 'pizza box', 'plastic bottle', 'batteries'..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#2F8F5B] focus:ring-2 focus:ring-[#2F8F5B]/20 text-xs font-medium outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-4 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2F8F5B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Recycling Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`bg-white rounded-3xl p-5 border shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
              item.digitalRelated ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm text-[#1B2B1E] flex items-center gap-1.5">
                  {item.digitalRelated && <Monitor className="w-4 h-4 text-amber-600 shrink-0" />}
                  <span>{item.name}</span>
                </h3>

                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: item.binColor }}
                >
                  {item.binName}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {item.instructions}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Prep Tip: {item.prepTip.slice(0, 45)}...
              </span>
              <span className="text-[#2F8F5B] underline">View Details</span>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-gray-200 text-gray-500">
            <p className="font-bold text-sm">No matching recycling items found for "{searchTerm}"</p>
            <p className="text-xs mt-1">Try searching for electronics, plastic bottles, or cardboard boxes.</p>
          </div>
        )}
      </div>

      {/* ITEM DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100 text-[#1B2B1E] relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: selectedItem.binColor }}
              >
                <Recycle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1B2B1E]">{selectedItem.name}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white inline-block mt-0.5" style={{ backgroundColor: selectedItem.binColor }}>
                  {selectedItem.binName}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="font-bold block text-gray-700 mb-1">Disposal Instructions:</span>
                <p className="text-gray-600">{selectedItem.instructions}</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                <span className="font-bold block text-emerald-800 mb-1">Sorting & Prep Tip:</span>
                <p>{selectedItem.prepTip}</p>
              </div>

              {selectedItem.digitalRelated && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                  <span className="font-bold block text-amber-900 mb-1">Digital Hardware Recycling Fact:</span>
                  <p>Recycling 1 million laptops saves the energy equivalent to the electricity used by over 3,500 US homes in a year!</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#2F8F5B] text-white font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
