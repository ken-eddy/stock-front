'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/utils/config'

interface Product {
  ID: number;
  name: string;
  quantity: number;
  price: number;
}

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)

  const { id } = useParams() // Get the product ID from the URL
  const router = useRouter()

  // Fetch the product to edit
  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/products/${id}`,{
         credentials:'include'
        })
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        setProduct(data)
        setName(data.name)
        setQuantity(data.quantity)
        setPrice(data.price)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Handle form submission to update the product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedProduct = { name, quantity, price }

    try {
      const response = await fetch(`${API_BASE_URL}api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials : 'include', 
        body: JSON.stringify(updatedProduct),
      })

      if (response.ok) {
        alert('Product updated successfully!')
        router.push('/dashboard/products') // Navigate back to the product list
      } else {
        alert('Failed to update product')
      }
    } catch (err: any) {
      alert('Error updating product')
      console.error(err)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-lg font-medium text-gray-700">Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <Button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
