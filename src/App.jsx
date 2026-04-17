/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useEffect, useRef, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/slices/AuthSlice.js";
import ScrollToTop from "./components/ui/ScrollToTop.jsx";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoute.jsx";

function App() {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.auth);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // 1. AOS init with Production-Ready Catch Block
    import("aos")
      .then((AOS) => {
        AOS.default.init({
          duration: 1000,
          once: false,
          offset: 100,
        });
      })
      .catch((err) => {
        // Silently fail or log to an external service; don't crash the UI
        console.error("AOS (Animations) failed to load:", err);
      });

    // 2. Data Fetching with Logic Guard
    const loadUser = async () => {
      if (token && !user && !fetchedRef.current) {
        try {
          fetchedRef.current = true;
          // unwrapping the dispatch allows us to catch errors here locally if needed
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to authenticate user session:", error);
          // Optional: handle session expiry or redirect to login here
        }
      }
    };

    loadUser();
  }, [token, user, dispatch]);

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />

      <main className="container content pt-[85px]">
        {/* 3. Suspense for Lazy Loaded Routes */}
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center py-40 gap-4">
              <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-semibold text-gray-600">Preparing your experience...</p>
            </div>
          }
        >
          {/* All routes are handled here */}
          <AppRoutes token={token} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;