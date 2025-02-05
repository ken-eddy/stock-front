"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/utils/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Loading from "@/components/ui/loading"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import { API_BASE_URL } from "@/utils/config"
// import { Canvas, useFrame } from "@react-three/fiber"
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Mesh } from "three"

// import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"

// // function AnimatedSphere() {
// //   // const meshRef = useRef(null)
// //   const meshRef = useRef(null)
// //   useFrame((state) => {
// //     const time = state.clock.getElapsedTime()
// //     meshRef.current.position.y = Math.sin(time) * 0.1
// //     meshRef.current.rotation.y = time * 0.1
// //   })
// function AnimatedSphere() {
//   const meshRef = useRef<Mesh>(null) // ✅ Use Mesh here

//   useFrame((state) => {
//     const time = state.clock.getElapsedTime()
//     if (meshRef.current) {
//       meshRef.current.position.y = Math.sin(time) * 0.1
//       meshRef.current.rotation.y = time * 0.1
//     }
//   })

//   return (
//     <Sphere visible args={[1, 100, 200]} scale={2} ref={meshRef}>
//       <MeshDistortMaterial color="#8352FD" attach="material" distort={0.3} speed={1.5} roughness={0} />
//     </Sphere>
//   )
// }

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(null)
  const [lowStockItems, setLowStockItems] = useState(null)
  const [totalValue, setTotalValue] = useState(null)
  const [user, setUser] = useState({ first_name: "", last_name: "", email: "", role: "" })
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  const router = useRouter()

  // Fetch user profile
  useEffect(() => {
    fetch(`${API_BASE_URL}api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          router.push("/login")
        } else {
          setUser(data)
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setIsLoadingProfile(false))
  }, [router])

  // Fetch Dashboard Data
  useEffect(() => {
    fetch(`${API_BASE_URL}api/products/total`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setTotalProducts(data.total))
      .catch((error) => console.error("Error fetching total products:", error))

    fetch(`${API_BASE_URL}api/products/low-stock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setLowStockItems(data.lowstock))
      .catch((error) => console.error("Error fetching low stock items:", error))

    fetch(`${API_BASE_URL}api/products/total-value`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setTotalValue(data.totalValue))
      .catch((error) => console.log("Error fetching total value of products:", error))
  }, [])

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}api/users/logout`, {
        method: "POST",
        credentials: "include",
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthGuard>
      <div className="relative min-h-screen">
        {/* <div className="absolute inset-0 z-0">
          <Canvas>
            <OrbitControls enableZoom={false} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[-2, 5, 2]} intensity={1} />
            <AnimatedSphere />
          </Canvas>
        </div> */}
        <div className="relative z-10 space-y-6 p-4 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 min-h-screen">
          {/* Top Bar with Profile Dropdown */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Dashboard</h1>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src="/user-avatar.png" alt="User Avatar" />
                  <AvatarFallback>{user.first_name.charAt(0) + user.last_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-lg bg-white dark:bg-gray-800 p-2 rounded-lg">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  {isLoadingProfile ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                  ) : (
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                  )}
                </div>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                  className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800 p-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Total Products */}
            <Link href="/dashboard/products">
              <Card className="w-full bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold text-center">
                    {totalProducts !== null ? totalProducts : <Loading />}
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Low Stock Items */}
            <Link href="/dashboard/low-stock">
              <Card className="w-full bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm md:text-base font-medium">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold text-center">
                    {lowStockItems !== null ? lowStockItems : <Loading />}
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Total Value */}
            <Card className="w-full bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm md:text-base font-medium">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold text-center">
                  Ksh {totalValue !== null ? totalValue : <Loading />}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
