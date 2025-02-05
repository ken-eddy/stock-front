"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { API_BASE_URL } from "@/utils/config"

interface Category {
  ID: number
  name: string
}

export default function EditCategoryPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}api/categories/${id}`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Category not found" : "Failed to fetch category")
        }

        const categoryData: Category = await response.json()
        setCategory(categoryData)
        setCategoryName(categoryData.name)
      } catch (err: any) {
        console.error("Fetch error:", err)
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      toast.success("Category updated successfully")
      router.push(`/dashboard/categories/${id}`)
    } catch (err: any) {
      console.error("Update error:", err)
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="text-center p-8">
          <CardTitle className="text-xl font-semibold mb-2">Error Loading Category</CardTitle>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

