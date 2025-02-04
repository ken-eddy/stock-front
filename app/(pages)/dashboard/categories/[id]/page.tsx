"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Package, DollarSign, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { API_BASE_URL } from "@/utils/config"

interface Product {
    ID: number
    name: string
    quantity: number
    price: number
}

interface Category {
    ID: number
    name: string
}

export default function CategoryProductsPage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [category, setCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const [categoryRes, productsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}api/categories/${id}`, {
                        credentials:'include'
                    }),
                    fetch(`${API_BASE_URL}api/categories/${id}/products`, {
                        credentials:'include'
                    })
                ])
                // Handle category response
                if (!categoryRes.ok) {
                    const errorText = await categoryRes.text()
                    console.error("Category Error:", errorText) // Debugging log
                    throw new Error(categoryRes.status === 404 ? "Category not found" : "Failed to fetch category")
                }

                // Handle products response
                if (!productsRes.ok) {
                    throw new Error("Failed to fetch products")
                }

                const categoryData: Category = await categoryRes.json()
                const productsData: Product[] = await productsRes.json()

                setCategory(categoryData)
                setProducts(productsData)

            } catch (err: any) {
                console.error("Fetch error:", err)
                setError(err.message)
                toast.error(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchData()
    }, [id, router])

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </CardHeader>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2 mb-2" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <Card className="text-center p-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Error Loading Category</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                        {category?.name || "Unknown Category"}
                    </CardTitle>
                    <Link href="/dashboard/categories">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Categories
                        </Button>
                    </Link>
                </CardHeader>
            </Card>

            {products.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                        <p className="text-gray-600">This category currently contains no products</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.ID}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                        <Package className="mr-2 h-4 w-4" />
                                        Quantity: {product.quantity}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Price: ksh {product.price.toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}