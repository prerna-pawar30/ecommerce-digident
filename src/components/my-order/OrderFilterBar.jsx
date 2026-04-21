import { Search, Calendar } from "lucide-react";

const OrderFilterBar = ({ 
  searchTerm, setSearchTerm, 
  selectedMonth, setSelectedMonth, 
  selectedYear, setSelectedYear 
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-orange-200 flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search by Order ID or Product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5  border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E68736]/20 focus:border-[#E68736] outline-none transition-all text-sm"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      </div>

      <div className="flex gap-3">
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={16} />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-[#E68736]/20"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2.5  border border-gray-200 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-[#E68736]/20"
        >
          <option value="">Year</option>
          {["2026", "2025", "2024"].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderFilterBar;