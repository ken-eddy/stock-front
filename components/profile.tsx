"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  business_id: number;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:"include",
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          setError(data.error || "Failed to load profile.");
          router.push("/login");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    };

    fetchProfile();
  }, [router]);

 
  // Proper logout handling
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        credentials: "include"
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p className="text-center">Loading profile...</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
      <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Business ID:</strong> {user.business_id || "Not Assigned"}</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg w-full"
      >
        Logout
      </button>
    </div>
  );
}
