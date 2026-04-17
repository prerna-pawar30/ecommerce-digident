/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useMemo } from "react"; // Added useMemo
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux"; // Added shallowEqual
import {
  HiX,
  HiShoppingCart,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineClipboard,
  HiOutlineLocationMarker,
  HiOutlineHome,
  HiOutlineUserAdd,
  
} from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import logoDefault from "../../assets/home/digident-logo.webp";
import { logout } from "../../store/slices/AuthSlice";
import useMediaQuery from "../../hooks/useMediaQuery";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const profileRef = useRef(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Update: Use shallowEqual to prevent re-renders from other cart state changes
  const cartItems = useSelector((state) => state.cart.items, shallowEqual);

  // Update: Memoize count so it doesn't recalculate on every scroll/placeholder change
  const cartCount = useMemo(() => {
    return Array.isArray(cartItems) ? cartItems.length : 0;
  }, [cartItems]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const placeholders = [
    "Search categories...",
    "Search brands...",
    "Search products...",
  ];

  const authRoutes = ["/login", "/register", "/forget-password", "/reset-password/:token"];
  const isAuthPage = authRoutes.some((route) => location.pathname.startsWith(route));

  const userDisplayName =
    user?.firstName || user?.name || user?.email?.split("@")[0] || "User";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/all-products?search=${encodeURIComponent(searchQuery)}`);
      setDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    setDrawerOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((p) => (p + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  if (isAuthPage) return null;
  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all shadow-md bg-[#F7E6DC] 
        ${isDesktop ? "h-[85px] flex items-center justify-between px-8" : "pt-3 pb-2 px-4"}`}
      >
        {/* TOP ROW: Logo & Actions */}
        <div className={`flex items-center justify-between w-full ${isDesktop ? "contents" : "mb-3"}`}>
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" className="cursor-pointer">
              <img
                src={logoDefault}
                alt="Logo"
                className={`transition-all ${isDesktop ? "h-14" : "h-10"}`}
              />
            </Link>
          </div>

          {/* DESKTOP SEARCH (Hidden on Mobile row) */}
          {isDesktop && (
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 outline-none focus:border-[#E68736] transition-colors"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl hover:text-[#E68736]">
                  <BiSearch />
                </button>
              </div>
            </form>
          )}

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {isDesktop && isAuthenticated && (
              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-2 bg-[#E68736] text-white px-5 py-2.5 cursor-pointer rounded-xl font-bold hover:brightness-110 transition-all"
              >
                <HiShoppingCart />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#E68736] w-6 h-6 rounded-full text-xs flex items-center justify-center font-black shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {isDesktop ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-white text-[#E68736] px-4 py-2.5 rounded-xl font-bold border border-[#E68736] hover:bg-gray-50 transition-all"
                >
                  <HiOutlineUser />
                  {isAuthenticated ? userDisplayName : "Account"}
                  <HiOutlineChevronDown className={`transition ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-orange-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                      {isAuthenticated ? (
                        <>
                          <div className="px-5 py-4 border-b border-orange-200 bg-orange-50">
                            <p className="text-[15px] font-bold text-[#072434] uppercase tracking-tight">
                              Hello, <span className="text-[#E68736]">{userDisplayName}!</span> 👋
                            </p>
                          </div>
                          
                          {/* Add onClick to your DesktopItem components */}
                          <DesktopItem 
                            to="/profile" 
                            label="My Profile" 
                            Icon={HiOutlineUser} 
                            onClick={() => setProfileOpen(false)} 
                          />
                          <DesktopItem 
                            to="/order-history" 
                            label="My Orders" 
                            Icon={HiOutlineClipboard} 
                            onClick={() => setProfileOpen(false)} 
                          />
                          <DesktopItem 
                            to="/add-address" 
                            label="Address Book" 
                            Icon={HiOutlineLocationMarker} 
                            onClick={() => setProfileOpen(false)} 
                          />
                          
                          <button 
                            onClick={() => {
                              handleLogout();
                              setProfileOpen(false); // Close after logout
                            }} 
                            className="flex items-center gap-3 w-full text-left px-5 py-3 text-red-500 font-bold hover:bg-red-50 transition-colors"
                          >
                            <HiX /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          {/* The Greeting Message (Same as logged-in view) */}
                          <div className="px-5 py-4 border-b border-orange-200 bg-orange-50">
                            <p className="text-[15px] font-bold text-[#072434] uppercase tracking-tight">
                              Welcome, <span className="text-[#E68736]">Guest!</span> 👋
                            </p>
                          </div>

                          {/* Login Button - Styled like DesktopItem */}
                          <button 
                            onClick={() => {
                              navigate("/login");
                              setProfileOpen(false);
                            }} 
                            className="flex items-center gap-3 w-full text-left px-5 py-3.5 text-[#E68736] font-bold hover:bg-orange-50 transition-colors border-b border-gray-50"
                          >
                            <HiOutlineUser className="text-[#E68736] text-xl" /> 
                            Login
                          </button>

                          {/* Register Button - Styled like DesktopItem */}
                          <button 
                            onClick={() => {
                              navigate("/register");
                              setProfileOpen(false);
                            }} 
                            className="flex items-center gap-3 w-full text-left px-5 py-3.5 text-[#E68736] font-bold hover:bg-orange-50 transition-colors"
                          >
                            <HiOutlineUserAdd className="text-[#E68736] text-xl" /> 
                            Create Account
                          </button>
                        </>
                      )}
                    </div>
                  )}
              </div>
            ) : (
              /* Mobile Burger Menu Icon */
              <button onClick={() => setDrawerOpen(true)} className="flex flex-col gap-1.5 p-2">
                <span className="w-6 h-0.5 bg-[#E68736] rounded-full" />
                <span className="w-6 h-0.5 bg-[#E68736] rounded-full" />
                <span className="w-4 h-0.5 bg-[#E68736] rounded-full self-end" />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH ROW (The Flipkart Style) */}
        {!isDesktop && (
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full px-4 py-2 rounded-lg bg-white border border-transparent outline-none shadow-sm text-sm focus:ring-1 focus:ring-brand-primary"
              />
              <BiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            </div>
          </form>
        )}
      </header>

      {/* Spacer to prevent content from being hidden under the fixed header */}
      <div className={isDesktop ? "h-[10px]" : "h-[20px]"} />

      {/* MOBILE DRAWER */}
      {!isDesktop && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
              drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setDrawerOpen(false)}
          />

          <aside
            className={`fixed right-0 top-0 h-full w-[85%] max-w-[320px] bg-white z-[101] transform transition-transform duration-300 ease-in-out
            ${drawerOpen ? "translate-x-0" : "translate-x-full shadow-none"}`}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <img src={logoDefault} className="h-10" />
                <button onClick={() => setDrawerOpen(false)} className="p-2 bg-gray-100 rounded-full">
                  <HiX className="text-xl text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isAuthenticated ? (
                  <nav className="flex flex-col gap-2">
                    <MobileItem to="/profile" label="Profile" Icon={HiOutlineUser} onClick={() => setDrawerOpen(false)} />
                    <MobileItem to="/order-history" label="Orders" Icon={HiOutlineClipboard} onClick={() => setDrawerOpen(false)} />
                    <MobileItem to="/add-address" label="Addresses" Icon={HiOutlineLocationMarker} onClick={() => setDrawerOpen(false)} />
                    <MobileItem to="/cart" label={`Cart (${cartCount})`} Icon={HiShoppingCart} onClick={() => setDrawerOpen(false)} />
                    <button onClick={handleLogout} className="mt-4 flex items-center gap-3 w-full p-3 text-red-500 font-bold rounded-xl hover:bg-red-50">
                      <HiX /> Logout
                    </button>
                  </nav>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate("/login")} className="px-4 py-3 rounded-xl bg-brand-primary text-[#E68736] font-bold">Login</button>
                    <button onClick={() => navigate("/register")} className="px-4 py-3 rounded-xl border border-brand-primary text-[#E68736] font-bold">Register</button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* BOTTOM NAVIGATION (Mobile Only) */}
        {!isDesktop && (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[90] flex justify-around items-center py-2 px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <BottomTab to="/" label="Home" Icon={HiOutlineHome} isActive={location.pathname === "/"} />
          <BottomTab to="/order-history" label="Orders" Icon={HiOutlineClipboard} isActive={location.pathname === "/order-history"} />
          <BottomTab to="/profile" label="Account" Icon={HiOutlineUser} isActive={location.pathname === "/profile"} />
          <BottomTab to="/cart" label="Cart" Icon={HiShoppingCart} isActive={location.pathname === "/cart"} count={cartCount} />
        </nav>
      )}
    </>
  );
}

// Sub-components
function BottomTab({ to, label, Icon, isActive, count }) {
  return (
    <NavLink to={to} className="flex flex-col items-center justify-center gap-1 flex-1 transition-all">
      <div className="relative">
        <Icon className={`text-2xl transition-colors ${isActive ? "text-[#E68736]" : "text-gray-500"}`} />
        {count > 0 && (
          <span className="absolute -top-1 -right-2 bg-brand-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </div>
      <span className={`text-[11px] font-bold transition-colors ${isActive ? "text-brand-primary" : "text-gray-600"}`}>
        {label}
      </span>
    </NavLink>
  );
}

function DesktopItem({ to, label, Icon, onClick }) {
  return (
    <NavLink 
      to={to} 
      onClick={onClick} // This is the key addition
      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 transition-colors"
    >
      <Icon className="text-[#E68736] text-lg" />
      <span className="text-[#E68736] font-medium">{label}</span>
    </NavLink>
  );
}

function MobileItem({ to, label, Icon, onClick }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) onClick();
        navigate(to);
      }}
      className="flex items-center gap-3 p-3 text-gray-700 font-semibold rounded-xl hover:bg-orange-50 transition-colors w-full text-left"
    >
      <Icon className="text-brand-primary text-xl" />
      <span>{label}</span>
    </button>
  );
}