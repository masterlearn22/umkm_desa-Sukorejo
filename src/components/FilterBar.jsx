import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FilterBar = ({ categories, activeCategory, onCategoryChange, searchQuery, onSearchChange }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-8 sticky top-20 z-40">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Categories */}
        <div className="flex overflow-x-auto w-full md:w-auto space-x-2 pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors text-sm
                ${activeCategory === cat.id 
                  ? 'bg-stone-900 text-white' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }
              `}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-full leading-5 bg-stone-50 placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-stone-900 focus:border-stone-900 sm:text-sm transition-colors"
          />
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
