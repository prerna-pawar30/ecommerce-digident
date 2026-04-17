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
    if (processed.current) return;

    processed.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get("accessToken");

    if (!token) {
      navigate("/login?error=no_token", { replace: true });
      return;
    }

    // clean URL
    window.history.replaceState({}, document.title, "/oauth-success");

    dispatch(setAuthToken(token));

    dispatch(fetchCurrentUser()).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/", { replace: true });
      } else {
        navigate("/login?error=sync_failed", { replace: true });
      }
    });
  }, [location.search, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-[#E68736] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 italic">Finishing sign-in...</p>
    </div>
  );
}