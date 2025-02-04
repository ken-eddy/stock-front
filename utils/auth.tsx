// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import Loading from "@/components/ui/loading"

// interface AuthGuardProps {
//   children: React.ReactNode
// }

// export default function AuthGuard({ children }: AuthGuardProps) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // Fix: Allow initial state to be null
//   const router = useRouter()

//   useEffect(() => {
//     const token = localStorage.getItem("token")
    
//     if (!token) {
//       setIsAuthenticated(false)
//       router.push("/login") // Redirect to login if no token
//     } else {
//       setIsAuthenticated(true)
//     }
//   }, [router]) 
//   if (isAuthenticated === null) {
//     return <p className="text-center mt-10"><Loading/></p>
//   }

//   if (!isAuthenticated) {
//     return <p className="text-center mt-10">Redirecting to login...</p>
//   }

//   return <>{children}</>
// }
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "@/components/ui/loading"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
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