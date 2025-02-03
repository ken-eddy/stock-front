"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { LogOut, Mail, Briefcase, User } from "lucide-react"
import AuthGuard from "@/utils/auth"

export default function ProfilePage() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    business: null as { business_id: number; business_name: string } | null,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
  const [showCreateEmployeeForm, setShowCreateEmployeeForm] = useState(false)
  const [showBusinessChangePasswordForm, setShowBusinessChangePasswordForm] = useState(false)

  const [businessUsers, setBusinessUsers] = useState<
    { id: number; first_name: string; last_name: string; email: string; role: string }[]
  >([])
  const [message, setMessage] = useState<string | null>(null)
  const [businessMessage, setBusinessMessage] = useState<string | null>(null)
  const [employeeFormData, setEmployeeFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  })

  // Fetch business users if role is admin
  useEffect(() => {
    if (user.role === "admin") {
      fetchBusinessUsers()
    }
  }, [user.role])

  const token = localStorage.getItem("businessToken")

  const fetchBusinessUsers = () => {
    fetch("http://localhost:8080/api/users/business", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setBusinessUsers(data))
      .catch(() => console.error("Error fetching business users"))
  }

  useEffect(() => {
    const token = localStorage.getItem("businessToken")
    if (!token) {
      router.push("/login")
      return
    }

    fetch("http://localhost:8080/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
      .finally(() => setLoading(false))
  }, [router])

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const token = localStorage.getItem("businessToken")

    try {
      const response = await fetch("http://localhost:8080/api/users/createEmployee", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeFormData),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("Employee created successfully!")
        setShowCreateEmployeeForm(false)
        setEmployeeFormData({ first_name: "", last_name: "", email: "", password: "" })
        fetchBusinessUsers()
      } else {
        setMessage(data.error || "Failed to create employee")
      }
    } catch (error) {
      setMessage("Something went wrong")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("businessToken")
    router.push("/login")
  }

  // Handler for changing the user's password (for all users)
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    const token = localStorage.getItem("businessToken")

    const formData = new FormData(e.currentTarget)
    const oldPassword = formData.get("oldPassword") as string
    const newPassword = formData.get("newPassword") as string

    try {
      const response = await fetch("http://localhost:8080/api/users/changePassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("Password updated successfully!")
      } else {
        setMessage(data.error || "Password update failed.")
      }
    } catch {
      setMessage("Something went wrong.")
    }
  }

  // Handler for changing the business password (admin only)
  const handleChangeBusinessPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusinessMessage("")

    const token = localStorage.getItem("businessToken")

    const formData = new FormData(e.currentTarget)
    const oldBusinessPassword = formData.get("oldBusinessPassword") as string
    const newBusinessPassword = formData.get("newBusinessPassword") as string

    try {
      const response = await fetch("http://localhost:8080/api/business/changePassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_business_password: oldBusinessPassword,
          new_business_password: newBusinessPassword,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setBusinessMessage("Business password updated successfully!")
      } else {
        setBusinessMessage(data.error || "Business password update failed.")
      }
    } catch {
      setBusinessMessage("Something went wrong.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.first_name} ${user.last_name}`}
                />
                <AvatarFallback>
                  {user.first_name[0]}
                  {user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-bold">
                {user.first_name} {user.last_name}
              </CardTitle>
              <CardDescription className="text-gray-200 text-lg">{user.role}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span>{user.business ? user.business.business_name : "Not Assigned"}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{user.role}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  {!showChangePasswordForm ? (
                    <Button
                      onClick={() => setShowChangePasswordForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Change Password
                    </Button>
                  ) : (
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <input
                        name="oldPassword"
                        type="password"
                        placeholder="Old Password"
                        className="w-full p-2 border rounded"
                        required
                      />
                      <input
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        className="w-full p-2 border rounded"
                        required
                      />
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                        Update Password
                      </button>
                      {message && <p className="text-center text-sm text-red-500">{message}</p>}
                    </form>
                  )}
                </div>
              </div>

              {/* Admin-only Section */}
              {user.role === "admin" && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Manage Employees</h3>

                  {!showCreateEmployeeForm ? (
                    <Button
                      onClick={() => setShowCreateEmployeeForm(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white mb-4"
                    >
                      Create New Employee
                    </Button>
                  ) : (
                    <form onSubmit={handleCreateEmployee} className="space-y-3">
                      <input
                        name="first_name"
                        type="text"
                        placeholder="First Name"
                        className="w-full p-2 border rounded"
                        required
                        value={employeeFormData.first_name}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, first_name: e.target.value })}
                      />
                      <input
                        name="last_name"
                        type="text"
                        placeholder="Last Name"
                        className="w-full p-2 border rounded"
                        required
                        value={employeeFormData.last_name}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, last_name: e.target.value })}
                      />
                      <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        required
                        value={employeeFormData.email}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                      />
                      <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        required
                        value={employeeFormData.password}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, password: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded">
                          Create Employee
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateEmployeeForm(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {businessUsers.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">Users in Your Business</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                          <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Role
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {businessUsers.map((u) => (
                              <tr key={u.id}>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {u.first_name} {u.last_name}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {u.role}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Admin-only section for changing the business password */}
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Change Business Password</h3>
                    {!showBusinessChangePasswordForm ? (
                      <Button
                        onClick={() => setShowBusinessChangePasswordForm(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Change Business Password
                      </Button>
                    ) : (
                      <form onSubmit={handleChangeBusinessPassword} className="space-y-3">
                        <input
                          name="oldBusinessPassword"
                          type="password"
                          placeholder="Old Business Password"
                          className="w-full p-2 border rounded"
                          required
                        />
                        <input
                          name="newBusinessPassword"
                          type="password"
                          placeholder="New Business Password"
                          className="w-full p-2 border rounded"
                          required
                        />
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                          Update Business Password
                        </button>
                        {businessMessage && <p className="text-center text-sm text-red-500">{businessMessage}</p>}
                      </form>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white mt-6"
                variant="destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
