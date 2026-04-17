import React from "react";

const TabContainer = ({ children }) => (
  <div className="border border-orange-200 rounded-[20px] md:rounded-[30px] p-5 md:p-12 min-h-[300px] md:min-h-[350px] bg-white ">
    {children}
  </div>
);

const SpecificationsTab = ({ product }) => (
  <TabContainer>
    <div className="max-w-4xl">
      <div className="overflow-hidden border border-orange-100 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <tbody>
            {product.specification?.map((s, i) => (
              <tr key={s.specId || i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-orange-100 last:border-0`}>
                <td className="py-3 md:py-4 px-4 md:px-6 text-[#1A202C] font-bold text-[13px] md:text-[15px] w-1/3 border-r border-orange-100">{s.key}</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-[#5E6D77] font-medium text-[13px] md:text-[15px]">{s.value}</td>
              </tr>
            ))}
            <tr className={`${product.specification?.length % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="py-3 md:py-4 px-4 md:px-6 text-[#1A202C] font-bold text-[13px] md:text-[15px] w-1/3 border-r border-gray-100">Category</td>
              <td className="py-3 md:py-4 px-4 md:px-6 text-[#5E6D77] font-medium text-[13px] md:text-[15px]">{product.category?.name || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </TabContainer>
);

export default SpecificationsTab;