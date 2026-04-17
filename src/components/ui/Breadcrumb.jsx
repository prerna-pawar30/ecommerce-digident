/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// ✅ 1. Updated Name Map to match your App.jsx routes
const nameMap = {
  shop: "Home",
  "all-products": "All Products",
  
  "hot-selling": "Hot Selling",
  hotselling: "Hot Selling",
  productpage: "Product Details",
  cart: "Shopping Cart",
  checkout: "Checkout",
  address: "Address Book",
  order: "Order Details",
  "order-history": "Order History",
  profile: "My Profile",
  login: "Login",
  register: "Register",
  "forget-password": "Forgot Password",
};

const Breadcrumb = ({ productName = null }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Hide on Home/Shop base pages
  if (pathnames.length === 0 || location.pathname === "/shop" || location.pathname === "/") {
    return null;
  }

  const breadcrumbItems = [{ name: "Home", path: "/shop" }];

  pathnames.forEach((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    const isLast = index === pathnames.length - 1;

    // ✅ 2. Handle Dynamic IDs (order/123 or productpage/456)
    // If the value is a MongoDB ID or a UUID/Number, we skip adding it as a separate link
    const isId = !isNaN(Number(value)) || value.length > 20; 
    
    if (isId) return;

    // ✅ 3. Determine Display Name
    let displayName = nameMap[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

    // If we are on a product page and have a name, use it
    if (value === 'productpage' && productName) {
        displayName = productName;
    }
    if (pathnames.includes("order")) {
  breadcrumbItems.push({ name: "All Products", path: "/all-products" });
}

    breadcrumbItems.push({ name: displayName, path: to, isLast: isLast });
  });

  return (
    <nav aria-label="Breadcrumb" className="py-2 pt-4 text-[14px] sm:text-[16px] text-gray-500 flex items-center flex-wrap">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {item.isLast ? (
            <span className="font-medium text-[#E68736] ml-1">
              {item.name}
            </span>
          ) : (
            <div className="flex items-center">
              <Link to={item.path} className="hover:text-orange-600 transition duration-150 flex items-center">
                {item.name}
              </Link>
              <ChevronRight size={14} className="mx-1 mt-0.5 text-gray-400" />
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;