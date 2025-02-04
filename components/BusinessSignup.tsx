// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"

// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import Loading from "@/components/ui/loading"

// export function BusinessSignup() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/session", {
//           method: "GET",
//           credentials: 'include'
//         })

//         setIsUserLoggedIn(response.ok)
//         if (!response.ok) {
//           setError("please log in first")
//           setTimeout(() => router.push('/login'), 2000)
//         }
//       } catch (error) {
//         setError("Failed to check aunthetication status")
//         setIsUserLoggedIn(false)
//       }
//     }

//     checkAuth()
//   }, [router])

//   const handleBusinessSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")
//     setSuccess("")
//     const formData = new FormData(e.currentTarget)
//     const businessName = formData.get("businessName") as string
//     const password = formData.get("password") as string

//     // try {
//     //   const response = await fetch("http://localhost:8080/api/business", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({ business_name: businessName, password }),
//     //     credentials: "include",
//     //   })

//     //   const data = await response.json()

//     //   if (response.status === 401) {
//     //     setError("Session expired. Please log in again.")
//     //     setTimeout(() => router.push("/login"), 2000)
//     //   } else if (response.status === 404) {
//     //     setError("User not found. Please log in first.")
//     //   } else if (response.status === 409) {
//     //     setError("A business with this name already exists.")
//     //   } else if (response.ok) {
//     //     setSuccess("Success! Redirecting to dashboard...")
//     //     setTimeout(() => router.push("/dashboard"), 2000)
//     //   } else {
//     //     setError(data.error || "Signup failed.")
//     //   }
//     // } catch (err) {
//     //   setError("An error occurred. Please try again.")
//     // }
//     try {
//       const response = await fetch("http://localhost:8080/api/business", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ business_name: businessName, password }),
//         credentials: "include",
//       });

//       if (response.status === 401) {
//         setError("Session expired. Redirecting to login...");
//         setTimeout(() => router.push("/login"), 2000);
//         return;
//       }

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess("Success! Redirecting to dashboard...");
//         setTimeout(() => router.push("/dashboard"), 2000);
//       } else {
//         setError(data.error || "Business creation failed");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     }

//     setIsLoading(false)
//   }

//   return (
//     <form onSubmit={handleBusinessSignup} className="space-y-4">
//       <div>
//         <Label htmlFor="businessName" className="text-gray-800 dark:text-gray-200">
//           Business Name
//         </Label>
//         <Input id="businessName" name="businessName" required className="bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
//         />
//       </div>
//       <div>
//         <Label htmlFor="signupPassword" className="text-gray-800 dark:text-gray-200">
//           Password
//         </Label>
//         <Input
//           id="signupPassword"
//           name="password"
//           type="password"
//           required
//           className="bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
//         />
//       </div>
//       {/* <Button
//         className="w-full bg-green-600 hover:bg-green-700 text-white transition"
//         type="submit"
//         disabled={isLoading}  // ← Changed this line
//       >
//         {isLoading ? <Loading /> : "Create Business Account"}
//       </Button> */}
//       <Button
//         className="w-full bg-green-600 hover:bg-green-700 text-white transition"
//         type="submit"
//         disabled={!isUserLoggedIn || isLoading}
//       >
//         {isLoading ? <Loading /> : isUserLoggedIn ? "Create Account" : "Log in first"}
//       </Button>
//       {error && (
//         <Alert variant="destructive">
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       {success && (
//         <Alert variant="success">
//           <AlertTitle>Success</AlertTitle>
//           <AlertDescription>{success}</AlertDescription>
//         </Alert>
//       )}
//     </form>
//   )
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Loading from "@/components/ui/loading";

export function BusinessSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Added for initial auth check
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setError("Please log in first");
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (error) {
        setError("Failed to check authentication status");
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleBusinessSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const businessName = formData.get("businessName") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("http://localhost:8080/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ business_name: businessName, password }),
        credentials: "include",
      });

      if (response.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess("Success! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(data.error || "Business creation failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBusinessSignup} className="space-y-4">
      <div>
        <Label htmlFor="businessName" className="text-gray-800 dark:text-gray-200">
          Business Name
        </Label>
        <Input
          id="businessName"
          name="businessName"
          required
          className="bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <div>
        <Label htmlFor="signupPassword" className="text-gray-800 dark:text-gray-200">
          Password
        </Label>
        <Input
          id="signupPassword"
          name="password"
          type="password"
          required
          className="bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white transition"
        type="submit"
        disabled={isAuthChecking || isLoading} // Disable button during auth check or submission
      >
        {isAuthChecking
          ? "Checking authentication..."
          : isLoading
          ? <Loading />
          : "Create Business Account"}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}

