"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "@/components/ui/loading"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // Fix: Allow initial state to be null
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      setIsAuthenticated(false)
      router.push("/login") // Redirect to login if no token
    } else {
      setIsAuthenticated(true)
    }
  }, [router]) 
  if (isAuthenticated === null) {
    return <p className="text-center mt-10"><Loading/></p>
  }

  if (!isAuthenticated) {
    return <p className="text-center mt-10">Redirecting to login...</p>
  }

  return <>{children}</>
}
