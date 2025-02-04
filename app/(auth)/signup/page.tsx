"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/config";

interface APIResponse {
  token?: string;
  user?: {
    id: number;
    email: string;
    role: string;
    business_id?: number;
  };
  error?: string;
}

export default function SignUp() {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("admin"); // Default role is 'user'
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);
  };
  const isStrongPassword = (password: string) => {
        return /^.{8,}$/.test(password); // Only checks if password is at least 8 characters long
      };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);


    // 🔴 Validate Password Strength
    if (!isStrongPassword(password)) {
      setMessage({
        text: "Password must be at least 8 characters, include a number, an uppercase letter, and a special character.",
        success: false,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}api/auth/signup`, {
        method: "POST",
        credentials:'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, role }),
      });

      const data: APIResponse = await response.json();
      if (response.status === 409) {
        setMessage({ text: "This email is already registered. Please use a different email.", success: false });
        return;
    }
    
    if (!response.ok) {
        setMessage({ text: data.error || "Signup failed", success: false });
        return;
    }
    
    // Handle successful signup
    if (response.ok && data.user) {
        setMessage({ text: "Signup successful! Redirecting...", success: true });
        setTimeout(() => {
            router.push("/business");  // Redirect after storing the token
        }, 2000);
    } 

    } catch (error) {
      setMessage({ text: "Something went wrong!", success: false });
    } finally {
      setLoading(false);
    }

    
  };

  return (
     <div>
       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
       <form onSubmit={handleSignUp} className="mt-8 space-y-6">
         <div>
           <label htmlFor="firstName" className="sr-only">First Name</label>
           <input
             id="firstName"
             name="firstName"
             type="text"
             required
             value={firstName}
             onChange={(e) => setFirstName(e.target.value)}
             className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             placeholder="First Name"
           />
         </div>
         <div>
           <label htmlFor="lastName" className="sr-only">Last Name</label>
           <input
             id="lastName"
             name="lastName"
             type="text"
             required
             value={lastName}
             onChange={(e) => setLastName(e.target.value)}
             className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             placeholder="Last Name"
           />
         </div>
         <div>
           <label htmlFor="email" className="sr-only">Email address</label>
           <input
             id="email"
             name="email"
             type="email"
             required
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             placeholder="Email address"
           />
         </div>
         <div>
           <label htmlFor="password" className="sr-only">Password</label>
           <input
             id="password"
             name="password"
             type="password"
             required
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             placeholder="Password"
           />
         </div>
         <div>
           <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
           <input
             id="confirmPassword"
             name="confirmPassword"
             type="password"
             required
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             placeholder="Confirm Password"
           />
         </div>
         <div>
           <label htmlFor="role" className="sr-only">Role</label>
           <select
             id="role"
             name="role"
             required
             value={role}
             onChange={(e) => setRole(e.target.value)}
             className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
           >
             <option value="admin">Admin</option>
             <option value="user">User</option>
           </select>
         </div>
         <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >          {loading ? "Signing Up..." : "Sign Up"}        </button>
       </form>
       {message && (
   <div className={`mt-4 text-center text-sm ${message.success ? "text-green-600" : "text-red-600"}`}>
     {message.text}
   </div>
 )}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Login
          </Link>
        </p>
      </div>
     </div>
   );
}
