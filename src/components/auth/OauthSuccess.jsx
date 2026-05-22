import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthToken, fetchCurrentUser } from "../../store/slices/AuthSlice";
import Swal from "sweetalert2";

export default function OauthSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const processed = useRef(false);

  useEffect(() => {
      console.log("🔥 OauthSuccess mounted");
    if (processed.current){
       console.log("⚠️ Already processed, skipping..."); return;
    }
    processed.current = true;
  console.log("📍 Current URL:", location.search);
    const params = new URLSearchParams(location.search);
    const token = params.get("accessToken");
     console.log("Received token:...........", token);
    if (!token) {
       console.log("❌ No token found → redirecting to login");
      navigate("/login?error=no_token", { replace: true });
      return;
    }

    // clean URL
    window.history.replaceState({}, document.title, "/oauth-success");
  console.log("🧹 URL cleaned");
   console.log("📦 Dispatching setAuthToken...");
    dispatch(setAuthToken(token));

        localStorage.setItem("token", token);
    console.log("💾 Token saved in localStorage");

    console.log("📡 Calling fetchCurrentUser API...");

    dispatch(fetchCurrentUser()).then((result) => {
       console.log("📥 fetchCurrentUser result:", result);
      if (result.meta.requestStatus === "fulfilled") {
          console.log("✅ User fetched successfully");

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            timer: 1500,
            showConfirmButton: false,
          });

          console.log("🚀 Navigating to home");
          navigate("/", { replace: true });
        } else {
          console.log("❌ fetchCurrentUser FAILED");

          console.log("Error payload:", result.payload);

          navigate("/login?error=sync_failed", { replace: true });
        }
      })
      .catch((err) => {
        console.log("🔥 Unexpected error in fetchCurrentUser:", err);
        navigate("/login?error=server-error", { replace: true });
      });

  }, [location.search, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-[#E68736] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 italic">Finishing sign-in...</p>
    </div>
  );
}