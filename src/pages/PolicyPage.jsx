import React, { useEffect } from "react";

const LegalLayout = ({ title, children }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen pt-[100px] pb-24 font-sans antialiased text-slate-800">
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <h1 className="text-4xl md:text-3xl font-black text-center text-slate-900 uppercase tracking-tighter mb-4">
          {title}
        </h1>
      </div>
      <article className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-[2rem] p-8 md:p-20">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Last Updated: January 2026
            </div>
            <div className="text-[10px] text-slate-300 font-black uppercase tracking-tighter italic text-center">
              Digident India Professional Standards & Compliance
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

/* --- Reusable UI Elements --- */
export const SectionTitle = ({ children }) => (
  <h2 className="text-[15px] font-black text-[#E68736] mt-12 mb-6 uppercase tracking-[0.25em] flex items-center gap-3">
    <span className="w-1 h-5 bg-[#E68736] rounded-full"></span>
    {children}
  </h2>
);

export const PolicyText = ({ children }) => (
  <p className="text-slate-600 leading-[1.8] text-lg mb-6 font-normal">{children}</p>
);

export const BulletList = ({ items }) => (
  <div className="grid grid-cols-1 gap-4 my-8">
    {items.map((item, i) => (
      <div key={i} className="flex items-start gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 group transition-all hover:border-[#E68736]/30">
        <div className="mt-2 w-2 h-2 rounded-full bg-[#E68736] shrink-0 shadow-sm shadow-orange-200" />
        <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
      </div>
    ))}
  </div>
);

export default LegalLayout;