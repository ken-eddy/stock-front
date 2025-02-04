'use client'

import { useEffect, useState } from "react";
import { Edit,Trash2 } from 'lucide-react'
import Link from "next/link";
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from "@/utils/config";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'




interface Product {
  ID: number;
  name: string;
  quantity: number;
  price: number;
}

export default function LowStockPage() {
  const [products, setProduct] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lowStockItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/products/low-stock-items`, {
         credentials : 'include'
        });
        if (!response.ok) {
          throw new Error("Could not fetch products");
        }
        const data: Product[] = await response.json();

        // Check if the response is an array
        if (Array.isArray(data)) {
          setProduct(data);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    lowStockItems();
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif">Low Stock Products</h1>
      </div>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.ID}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/edit-product/${product.ID}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
