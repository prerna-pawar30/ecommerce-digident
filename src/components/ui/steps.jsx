import React from "react";
import { useLocation } from "react-router-dom";
import { ShoppingBag, Truck, CreditCard, CheckCircle2 } from "lucide-react";

const DynamicProgressStepper = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const steps = [
    { id: 1, label: "Cart", path: "/cart", icon: <ShoppingBag size={18} /> },
    { id: 2, label: "Details", path: "/address", icon: <Truck size={18} /> },
    { id: 3, label: "Payment", path: "/checkout", icon: <CreditCard size={18} /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.path === currentPath);
  
  // Adjusted progress calculation to stop exactly at the last node
  const progressWidth = currentStepIndex <= 0 ? "0%" : currentStepIndex === 1 ? "50%" : "100%";

  return (
    <div className="max-w-3xl mx-auto px-4 mb-10 w-full">
      <div className="relative flex items-center justify-between">
        
        {/* PROGRESS LINE CONTAINER: Centered and constrained between icons */}
        <div className="absolute top-5 left-5 right-5 h-1 -z-10">
          {/* Background Line (Gray) - Now stops exactly at the last icon */}
          <div className="w-full h-full bg-gray-100 rounded-full"></div>
          
          {/* Animated Progress Line (Orange) */}
          <div 
            className="absolute top-0 left-0 h-full bg-[#E68736] transition-all duration-700 ease-in-out rounded-full shadow-[0_0_8px_rgba(230,135,54,0.3)]"
            style={{ width: progressWidth }}
          ></div>
        </div>

        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isActive = currentStepIndex === index;

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform z-10
                  ${isActive ? "scale-110 shadow-md border-2 border-[#E68736] bg-white text-[#E68736]" : ""}
                  ${isCompleted ? "bg-[#E68736] text-white" : "bg-white border-2 border-gray-200 text-gray-400"}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} className="animate-in zoom-in duration-300" />
                ) : (
                  <span className={isActive ? "animate-pulse" : ""}>{step.icon}</span>
                )}
              </div>
              
              <span className={`
                mt-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300
                ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicProgressStepper;