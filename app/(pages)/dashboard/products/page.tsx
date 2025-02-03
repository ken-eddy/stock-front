
'use client'

import { useEffect, useState } from 'react'

import Loading from '@/components/ui/loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit,Trash2 } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/router'


// Define the Product interface
interface Product {
  ID: number;
  name: string;
  // sku: string;
  quantity: number;
  price: number;
  // category: string;
}


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]) // State to hold products
  const [loading, setLoading] = useState<boolean>(true) // State to manage loading
  const [error, setError] = useState<string | null>(null) // State to manage errors

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("businessToken");
        if (!token) {
          // Redirect to login if no token found
          window.location.href = "/login";
          return;
        }
  
        const response = await fetch('http://localhost:8080/api/products/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Handle expired token
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error('Failed to fetch products');
        }
        
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  // Handle loading and error states
  if (loading) {
    return < Loading />
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  //deleting a product function

  // const deleteProduct = async (id: number) => {
  //   console.log("Deleting product with ID:", id)
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     try {
  //       const response = await fetch(`http://localhost:8080/api/products/${id}`, {
  //         method: 'DELETE',
  //       });

  //       if (response.ok) {
  //         alert('Product deleted successfully!');
  //         // Remove the deleted product from the state
  //         setProducts(products.filter((product) => product.ID !== id));
  //       } else {
  //         const responseData = await response.json()
  //         alert('Failed to delete product');
  //       }
  //     } catch (error) {
  //       console.error('Error deleting product:', error);
  //     }
  //   }
  // };
  const deleteProduct = async (id: number) => {
    try {
      const token = localStorage.getItem("businessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }
  
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Rest of your delete logic...
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Render the table
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold font-serif">Products</h1>
        <Link href="/dashboard/add-product">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add product</button>
      </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {/* <TableHead>SKU</TableHead> */}
            {/* <TableHead>Category</TableHead> */}
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.ID}>
              <TableCell className="font-medium">{product.name}</TableCell>
              {/* <TableCell>{product.sku}</TableCell> */}
              {/* <TableCell>{product.category}</TableCell> */}
              <TableCell>{product.quantity}</TableCell>
              <TableCell>ksh {product.price.toFixed(2)}</TableCell>
              <TableCell>
                {/* <Badge variant={product.quantity > 10 ? "success" : "destructive"}>
                  {product.quantity > 10 ? "In Stock" : "Low Stock"}
                </Badge> */}
                <Badge variant={product.quantity > 10 ? "secondary" : "destructive"}>
                {product.quantity > 10 ? "In Stock" : "Low Stock"}
              </Badge>

              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/edit-product/${product.ID}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button variant="outline" size="icon"
                  onClick={() => {
                    console.log("button clicked")
                    deleteProduct(product.ID)
                  }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}



