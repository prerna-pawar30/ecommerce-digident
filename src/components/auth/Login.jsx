/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { loginWithGoogle, loginWithMicrosoft } from "../../utils/oauth";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginEmployee } from "../../store/slices/AuthSlice"; 
import confetti from "canvas-confetti"; 
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import loginBg from "../../assets/home/login.webp";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading: isSubmitting } = useSelector(state => state.auth); 
  
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
// Inside your component:
const [showPassword, setShowPassword] = useState(false);

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

  // Celebration Function
  const fireCelebration = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }, 
        colors: ["#E68736", "#ffffff", "#000000"] 
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }, 
        colors: ["#E68736", "#ffffff", "#000000"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleChange = (e) => {
    const value = e.target.value.trim(); 
    setForm({ ...form, [e.target.name]: value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) { toastError("Email is required"); return false; }
    if (!emailRegex.test(form.email)) { toastError("Please enter a valid email address"); return false; }
    if (!form.password) { toastError("Password is required"); return false; }
    return true;
  };

  const toastError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(loginEmployee(form)).unwrap();
      // Extract the first name if it exists in your response (e.g., resultAction.user.name)
      const userName = resultAction?.user?.name;
      // SUCCESS BLOCK
      fireCelebration();

     // 3. New Enhanced SweetAlert
      Swal.fire({
        icon: "success",
        title: `Welcome back!`, // Personalized greeting
        text: "Accessing your Digident dashboard...",
        confirmButtonColor: "#E68736",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true, // Shows a loading bar at the bottom
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster' // Requires animate.css or standard CSS transitions
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000); // Wait for the alert timer to finish
    } catch (err) {
      // ERROR BLOCK
      const errorMessage = typeof err === 'string' ? err : "Invalid email or password.";
      
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#E68736",
        footer: errorMessage.includes("verify") ? '<a href="/resend-verification">Need to verify your email?</a>' : ''
      });
    }
  };

return (
    <div className="min-h-screen  flex items-center justify-center p-4 md:p-12">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-orange-900/10 overflow-hidden border border-orange-200">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          
          {/* LEFT SIDE: IMAGE SECTION */}
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src={loginBg} 
              alt="Login Background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Soft Brand Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E68736]/60 to-[#000]/30 mix-blend-multiply"></div>
            
            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
              <h2 className="text-4xl font-bold mb-2">Digident</h2>
              <p className="text-lg text-white/90 font-medium">Precision Dentistry, Digital Clarity.</p>
              <div className="mt-6 w-12 h-1.5 bg-[#E68736] rounded-full"></div>
            </div>
          </div>

          {/* RIGHT SIDE: LOGIN FORM */}
         <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center  bg-white ">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Welcome <span className="text-[#E68736]">Back 👋</span>
              </h2>
              <p className="text-gray-500 mt-2">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-[#E68736] transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E68736]/10 focus:border-[#E68736] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                  <Link to="/forget-password" strokeWidth={3} className="text-xs font-bold text-[#E68736] hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-[#E68736] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E68736]/10 focus:border-[#E68736] focus:bg-white outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#E68736]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E68736] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-600/20 hover:bg-[#d4762d] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <span className="bg-white px-4">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={loginWithGoogle} className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                <FcGoogle size={20} /> <span className="text-sm font-semibold text-gray-700">Google</span>
              </button>
              <button onClick={loginWithMicrosoft} className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                <FaMicrosoft size={18} className="text-[#00a1f1]" /> <span className="text-sm font-semibold text-gray-700">Microsoft</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-10">
              New here? <Link to="/register" className="text-[#E68736] font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}