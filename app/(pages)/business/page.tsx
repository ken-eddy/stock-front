// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import Loading from "@/components/ui/loading";

// export default function BusinessPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
//   const router = useRouter();

//   // Check if the user is logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsUserLoggedIn(!!token); // Convert token existence to boolean
//   }, []);

//   // ✅ Business Login
//   const handleBusinessLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     // 🔥 Get user token from localStorage
//     const userToken = localStorage.getItem("token");
//     if (!userToken) {
//       setError("User session expired. Please log in again.");
//       setIsLoading(false);
//       router.push("/login");
//       return;
//     }

//     const formData = new FormData(e.currentTarget);
//     const businessName = formData.get("businessName") as string;
//     const password = formData.get("password") as string;

//     try {
//       const response = await fetch("http://localhost:8080/api/business/login", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userToken}` // 🔥 Add user token
//         },
//         body: JSON.stringify({ 
//           business_name: businessName, 
//           password 
//         }),
//       });

//       const data = await response.json();

//       if (response.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         router.push("/login");
//       } else if (response.ok) {
//         localStorage.setItem("businessToken", data.token);
//         setSuccess("Business login successful! Redirecting...");
//         setTimeout(() => router.push("/dashboard"), 2000);
//       } else {
//         setError(data.error || "Login failed");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//     }

//     setIsLoading(false);
//   };

//   const handleBusinessSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     // 🔹 Retrieve the user token from localStorage
//     const token = localStorage.getItem("token");
//     console.log("Stored Token:", token); // ✅ Debugging log
//     if (!token) {
//       setError("Session expired. Please log in again.");
//       setIsLoading(false);
//       router.push("/login"); // Redirect to login page
//       return;
//     }

//     const formData = new FormData(e.currentTarget);
//     const businessName = formData.get("businessName") as string;
//     const password = formData.get("password") as string;

//     try {
//       const response = await fetch("http://localhost:8080/api/business", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // 🔹 Send token in request headers
//         },
//         body: JSON.stringify({ business_name: businessName, password }),
//       });

//       const data = await response.json();

//       if (response.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token"); // 🔹 Clear expired token
//         setTimeout(() => router.push("/login"), 2000); // Redirect to login
//       } else if (response.status === 404) {
//         setError("User not found. Please log in first.");
//       } else if (response.status === 409) {
//         setError("A business with this name already exists.");
//       } else if (response.ok) {
//         localStorage.setItem("businessToken", data.token);
//         setSuccess("Business created successfully! Redirecting...");
//         setTimeout(() => router.push("/dashboard"), 2000);
//       } else {
//         setError(data.error || "Signup failed.");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//     }

//     setIsLoading(false);
//   };


//   return (
//     <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 text-black">
//       <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//         <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//         <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
//           <div className="max-w-md mx-auto">
//             <Card className="w-full max-w-md shadow-lg rounded-lg bg-white dark:bg-gray-800 transition-all">
//               <CardHeader className="text-center">
//                 <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
//                   Business Account
//                 </CardTitle>
//                 <CardDescription className="text-gray-600 dark:text-gray-400">
//                   Log in or create a new business account
//                 </CardDescription>
//               </CardHeader>

//               <CardContent>
//                 <Tabs defaultValue="login">
//                   <TabsList className="grid w-full grid-cols-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
//                     <TabsTrigger value="login" className="text-gray-700 dark:text-gray-300 transition">
//                       Login
//                     </TabsTrigger>
//                     <TabsTrigger value="signup" className="text-gray-700 dark:text-gray-300 transition">
//                       Signup
//                     </TabsTrigger>
//                   </TabsList>

//                   {/* Business Login */}
//                   <TabsContent value="login">
//                     <form onSubmit={handleBusinessLogin} className="space-y-4">
//                       <div>
//                         <Label htmlFor="businessName" className="text-gray-800 dark:text-gray-200">
//                           Business Name
//                         </Label>
//                         <Input id="businessName" name="businessName" required className="dark:bg-gray-800 dark:text-gray-100" />
//                       </div>
//                       <div>
//                         <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
//                           Password
//                         </Label>
//                         <Input id="password" name="password" type="password" required className="dark:bg-gray-800 dark:text-gray-100" />
//                       </div>
//                       <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition" type="submit" disabled={isLoading}>
//                         {isLoading ? <Loading /> : "Log In"}
//                       </Button>
//                     </form>
//                   </TabsContent>

//                   {/* Business Signup */}
//                   <TabsContent value="signup">
//                     <form onSubmit={handleBusinessSignup} className="space-y-4">
//                       <div>
//                         <Label htmlFor="businessName" className="text-gray-800 dark:text-gray-200">
//                           Business Name
//                         </Label>
//                         <Input id="businessName" name="businessName" required className="dark:bg-gray-800 dark:text-gray-100" />
//                       </div>
//                       <div>
//                         <Label htmlFor="signupPassword" className="text-gray-800 dark:text-gray-200">
//                           Password
//                         </Label>
//                         <Input id="signupPassword" name="password" type="password" required className="dark:bg-gray-800 dark:text-gray-100" />
//                       </div>
//                       <Button className="w-full bg-green-600 hover:bg-green-700 text-white transition" type="submit" disabled={!isUserLoggedIn || isLoading}>
//                         {isLoading ? <Loading /> : isUserLoggedIn ? "Create Account" : "Log in first"}
//                       </Button>
//                     </form>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>

//               <CardFooter>{error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}</CardFooter>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessLogin } from "@/components/BusinessLogin"
import { BusinessSignup } from "@/components/BusinessSignup"

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-400 to-slate-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <Card className="w-full max-w-md shadow-lg rounded-lg bg-white dark:bg-gray-800 transition-all">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Business Account</CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Log in or create a new business account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <TabsTrigger
                    value="login"
                    className="rounded-md py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                 data-[state=active]:bg-blue-500 data-[state=active]:text-white
                 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-md py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                 data-[state=active]:bg-green-500 data-[state=active]:text-white
                 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <BusinessLogin />
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <BusinessSignup />
                </TabsContent>
              </Tabs>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

