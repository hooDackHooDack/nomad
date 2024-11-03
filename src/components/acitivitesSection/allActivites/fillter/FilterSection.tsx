import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const FilterSection = ({
  category,
  setCategory,
  sort,
  setSort,
  keyword,
  setKeyword,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const categories = [
    '문화 · 예술',
    '식음료',
    '스포츠',
    '투어',
    '관광',
    '웰빙',
  ];

  return (
    <div className="w-full px-4">
      <div
        className={`
        flex items-center gap-2 transition-all duration-300 justify-center
        ${isSearchFocused ? 'flex-col' : 'flex-row'}
      `}
      >
        {/* Search Input */}
        <div
          className={`
          relative transition-all duration-300
          ${isSearchFocused ? 'w-full' : 'w-24 md:w-48 lg:flex-1'}
        `}
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={(e) => {
              // Only unfocus if the input is empty
              if (!e.target.value) {
                setIsSearchFocused(false);
              }
            }}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full
              focus:outline-none focus:ring-2 focus:ring-green-dark focus:border-transparent
              text-gray-800 placeholder-gray-400"
            placeholder="체험을 검색해보세요!"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Category Select */}
        <div
          className={`
          relative transition-all duration-300
          ${isSearchFocused ? 'hidden' : 'w-24 md:w-48'}
        `}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none bg-white pl-4 pr-8 py-3 border-2 
              border-gray-200 rounded-full text-gray-700 text-sm
              focus:outline-none focus:ring-2 focus:ring-green-dark focus:border-transparent
              truncate"
          >
            <option value="">카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <SlidersHorizontal
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>

        {/* Sort Select */}
        <div
          className={`
          relative transition-all duration-300
          ${isSearchFocused ? 'hidden' : 'w-24 md:w-48'}
        `}
        >
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none bg-white pl-4 pr-8 py-3 border-2 
              border-gray-200 rounded-full text-gray-700 text-sm
              focus:outline-none focus:ring-2 focus:ring-green-dark focus:border-transparent
              truncate"
          >
            <option value="">정렬</option>
            <option value="price_asc">가격 낮은 순</option>
            <option value="price_desc">가격 높은 순</option>
          </select>
          <SlidersHorizontal
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
