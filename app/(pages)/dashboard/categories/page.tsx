"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Category {
  ID: number
  name: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const token = localStorage.getItem("businessToken")
    if (!token) {
      toast.error("Unauthorized. Please log in.")
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast.error("Failed to load categories.")
    }
  }

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("businessToken")
    if (!token) {
      toast.error("Unauthorized. Please log in.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Category added successfully!")
        setName("")
        setCategories([...categories, data])
      } else {
        toast.error(data.error || "Failed to add category.")
      }
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-grow"
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.ID}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/dashboard/categories/${category.ID}`}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  )
}

