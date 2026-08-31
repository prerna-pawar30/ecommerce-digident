/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useEffect, useRef, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/slices/AuthSlice.js";
import ScrollToTop from "./components/ui/ScrollToTop.jsx";
import { Toaster } from 'react-hot-toast'; // Correctly imported
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoute.jsx";

function App() {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.auth);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // 1. AOS init
    Promise.all([import("aos"), import("aos/dist/aos.css")])
      .then(([AOS]) => {
        AOS.default.init({
          duration: 700,
          once: true,
          offset: 100,
        });
      })
      .catch((err) => {
        console.error("AOS (Animations) failed to load:", err);
      });

    // 2. Data Fetching Logic
    const loadUser = async () => {
      if (token && !user && !fetchedRef.current) {
        try {
          fetchedRef.current = true;
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to authenticate user session:", error);
        }
      }
    };

    loadUser();
  }, [token, user, dispatch]);

  return (
    <div className="app-shell">
      {/* ADDED THIS LINE: This allows toasts to show up across the whole app */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <ScrollToTop />
      <Header />

      <main className="container content pt-[85px]">
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center py-40 gap-4">
              <div className="w-10 h-10 border-4 border-[#E68736] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-semibold text-gray-600">Preparing your experience...</p>
            </div>
          }
        >
          <AppRoutes token={token} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;