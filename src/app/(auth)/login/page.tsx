"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation"; // Redirect karne ke liye
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); // Error state handle karne ke liye



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); 
    if (email && password) {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      console.log(result)
      console.log("Admin logged in successfully!");
      if(result?.error){
        setError(result.error);
        return;
      }

      // router.push("/admin/dashboard");
      window.location.href = "/admin/dashboard";
    } else {
      // Galat details daalne par error message render hoga
      setError("Invalid Admin Email or Password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between font-sans">
      {/* Top Banner Theme Accent */}
      <div className="bg-[#4caf50] h-3 w-full"></div>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-md max-w-md w-full overflow-hidden border-t-4 border-[#4caf50]">
          
          {/* Header Area */}
          <div className="bg-[#232323] text-white p-6 text-center">
            <h2 className="text-xl font-bold tracking-wide uppercase">
              IP Indian Journal of Neurosciences
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Official Publication of KERF
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Admin Control Panel</h3>
              <p className="text-sm text-gray-500">Authorized Personnel Login Only</p>
            </div>

            {/* Error Message Section */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:border-transparent text-sm"
                placeholder="admin@journal.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#4caf50] hover:bg-[#439a47] text-white font-medium py-2 px-4 rounded transition duration-200 text-sm uppercase tracking-wider"
            >
              Verify & Login
            </button>
          </form>

          {/* Optional: Simple Notice block instead of Registration Link */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center text-xs text-gray-500 italic">
            Secure admin portal. All actions are logged.
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <footer className="bg-[#232323] text-gray-400 text-xs py-4 text-center border-t border-gray-800">
        <p>© 2026 Innovative Publication. All Rights Reserved.</p>
      </footer>
    </div>
  );
}