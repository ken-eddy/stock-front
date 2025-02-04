import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Loading from "@/components/ui/loading"


export function BusinessLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleBusinessLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    const formData = new FormData(e.currentTarget)
    const businessName = formData.get("businessName") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("http://localhost:8080/api/business/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: businessName,
          password,
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.status === 401) {
        setError("Session expired. Please log in again.")
      } else if (response.ok) {
        setSuccess("Success! Redirecting to dashboard...")
        setTimeout(() => router.push("/dashboard"), 2000)
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleBusinessLogin} className="space-y-4">
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
      <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
        Password
      </Label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        className="bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
      />
    </div>
    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition" type="submit" disabled={isLoading}>
      {isLoading ? <Loading /> : "Log In"}
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
  
  )
}

