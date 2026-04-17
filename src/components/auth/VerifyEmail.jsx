/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import Swal from "sweetalert2";

const BackendUrl = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("Please click the button below to verify your account.");

  const handleVerify = async () => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    setStatus("loading");
    try {
      const res = await axios.get(`${BackendUrl}/api/v1/user/verify-email/${token}`);
      
      setStatus("success");
      setMessage(res.data.message || "Email verified successfully!");

      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: "Your email has been verified. Redirecting to login...",
        timer: 3000,
        showConfirmButton: false,
      });

      // Redirect to login after successful verification
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Invalid or expired token.");
      
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err.response?.data?.message || "The link may be expired.",
        confirmButtonColor: "#E68736",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-orange-100 text-center">
        
        {/* Dynamic Icon based on status */}
        <div className="flex justify-center mb-6">
          {status === "idle" && <Mail className="text-[#E68736] w-16 h-16" />}
          {status === "loading" && <Loader2 className="text-[#E68736] w-16 h-16 animate-spin" />}
          {status === "success" && <CheckCircle className="text-green-500 w-16 h-16" />}
          {status === "error" && <XCircle className="text-red-500 w-16 h-16" />}
        </div>

        <h2 className="text-2xl font-black text-slate-800 mb-2">
          {status === "success" ? "All Set!" : "Verify Your Email"}
        </h2>
        
        <p className="text-slate-500 mb-8 font-medium">
          {message}
        </p>

        {status !== "success" && (
          <button
            onClick={handleVerify}
            disabled={status === "loading"}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all transform active:scale-95 shadow-lg
              ${status === "loading" 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-[#E68736] hover:bg-white hover:text-[#E68736] shadow-orange-200"
              }`}
          >
            {status === "loading" ? "Verifying..." : "Verify Email Now"}
          </button>
        )}

        {status === "success" && (
          <p className="text-[#E68736] font-bold animate-pulse">
            Redirecting to Login...
          </p>
        )}
      </div>
    </div>
  );
}