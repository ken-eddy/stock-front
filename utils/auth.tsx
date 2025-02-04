"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "@/components/ui/loading"
import { API_BASE_URL } from "./config"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/session`, {
          method: "GET",
          credentials: "include"
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push("/login")
        }
      } catch (error) {
        setIsAuthenticated(false)
        router.push("/login")
      }
    }

    verifyAuth()
  }, [router])

  if (isAuthenticated === null) {
    return <div className="text-center mt-10"><Loading /></div>
  }

  return <>{children}</>
}