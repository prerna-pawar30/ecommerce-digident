import React from 'react';
import { Package } from 'lucide-react';

const StickyReviewBadge = () => {
  return (
    <div className="fixed bottom-10 right-10 z-50 animate-bounce">
      <div className="bg-black text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-2 border-[#E68736] flex items-center gap-4">
        <div className="bg-[#E68736] p-2 rounded-xl shadow-inner">
          <Package size={20} color="white" strokeWidth={3} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E68736]">
            Activity Status
          </p>
          <p className="text-xs font-black uppercase tracking-tight">
            Review Verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickyReviewBadge;