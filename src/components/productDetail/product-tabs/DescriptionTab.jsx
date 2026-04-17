import React from "react";

const TabContainer = ({ children }) => (
  <div className="border border-orange-200 rounded-[20px] md:rounded-[30px] p-5 md:p-12 min-h-[300px] md:min-h-[350px] bg-white ">
    {children}
  </div>
);

const DescriptionTab = ({ product }) => (
  <TabContainer>
    <div className="space-y-6">
      {product.description?.map((item, index) => (
        <div key={item.paragraphId || index} className="space-y-4">
          <p className="text-[#5E6D77] text-[14px] md:text-[15px] leading-relaxed font-medium">
            {item.text}
          </p>
          {item.image && (
            <div className="w-full md:w-fit border border-gray-100 rounded-xl overflow-hidden mt-4">
              <img src={item.image} alt="Product detail" className="w-full md:max-h-60 object-contain" />
            </div>
          )}
        </div>
      ))}
    </div>
  </TabContainer>
);

export default DescriptionTab;