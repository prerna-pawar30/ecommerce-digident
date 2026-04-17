/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginWithGoogle, loginWithMicrosoft } from "../../utils/oauth";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { Eye, EyeOff, Check, X, Mail, Lock, User, Building2 } from 'lucide-react';

// IMPORT YOUR IMAGE HERE
import registerBg from "../../assets/home/login.webp"; // Adjust filename as needed

const BackendUrl = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    instituteName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validations = useMemo(() => [
    { label: "8+ characters", test: (pw) => pw.length >= 8 },
    { label: "One uppercase", test: (pw) => /[A-Z]/.test(pw) },
    { label: "One number", test: (pw) => /[0-9]/.test(pw) },
    { label: "Special character", test: (pw) => /[@$!%*?&]/.test(pw) },
  ], []);

  const allValid = useMemo(() => 
    validations.every(v => v.test(form.password)), 
    [validations, form.password]
  );

  const handleChange = (e) => {
    const value = e.target.name === "password" ? e.target.value : e.target.value.trimStart();
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) {
      return Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Please meet all password requirements before registering.",
        confirmButtonColor: "#E68736",
      });
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${BackendUrl}/api/v1/user/register`, form);
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: res.data.message || "Verification email sent!",
        confirmButtonColor: "#E68736",
      });
      setForm({ firstName: "", lastName: "", email: "", password: "", instituteName: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#E68736",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 md:p-12">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-orange-900/10 overflow-hidden border border-orange-200">
        <div className="flex flex-col md:flex-row min-h-[650px]">
          
          {/* LEFT SIDE: FORM SECTION */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Create <span className="text-[#E68736]">Account</span>
              </h2>
              <p className="text-gray-500 mt-2 text-sm">Join Digident to start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">First Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400 group-focus-within:text-[#E68736] transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E68736]/10 focus:border-[#E68736] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E68736]/10 focus:border-[#E68736] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400 group-focus-within:text-[#E68736] transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E68736]/10 focus:border-[#E68736] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400 group-focus-within:text-[#E68736] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E68736]/10 focus:border-[#E68736] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#E68736]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {isPasswordFocused && form.password.length > 0 && !allValid && (
                  <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 grid grid-cols-2 gap-x-2 gap-y-1 mt-2 animate-in fade-in zoom-in-95 duration-200">
                    {validations.map((v, i) => {
                      const isPassed = v.test(form.password);
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className={`rounded-full p-0.5 ${isPassed ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {isPassed ? <Check size={10} className="text-green-600" /> : <X size={10} className="text-gray-400" />}
                          </div>
                          <span className={`text-[10px] leading-tight ${isPassed ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                            {v.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Institute Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Institute Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-gray-400 group-focus-within:text-[#E68736] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="instituteName"
                    placeholder="University of Science"
                    value={form.instituteName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E68736]/10 focus:border-[#E68736] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#E68736] text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98] mt-2
                  ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-[#d4762d] hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <span className="bg-white px-4">OR REGISTER WITH</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={loginWithGoogle} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95 font-medium text-gray-700 text-sm">
                <FcGoogle size={20} /> Google
              </button>
              <button onClick={loginWithMicrosoft} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95 font-medium text-gray-700 text-sm">
                <FaMicrosoft size={18} className="text-[#00a1f1]" /> Microsoft
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account? <Link to="/login" className="text-[#E68736] font-bold hover:underline transition-colors">Login here</Link>
            </p>
          </div>

          {/* RIGHT SIDE: IMAGE SECTION */}
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src={registerBg} 
              alt="Register Background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Brand Overlay */}
            <div className="absolute inset-0 bg-gradient-to-bl from-[#E68736]/60 to-[#000]/40 mix-blend-multiply"></div>
            
            {/* Content on top of image */}
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
              <h2 className="text-4xl font-bold mb-2">Digident</h2>
              <p className="text-lg text-white/90 font-medium">Step into the future of Dentistry.</p>
              <div className="mt-6 w-12 h-1.5 bg-[#E68736] rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}