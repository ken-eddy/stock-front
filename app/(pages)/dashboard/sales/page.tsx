"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { API_BASE_URL } from "@/utils/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import AuthGuard from "@/utils/auth";

interface Bidhaa {
  ID: number;
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  sold_at: string;
  Product: {
    name: string;
  } | null; // Add | null to handle cases where Product might be null
  quantity: number;
  total: number;
}


export default function SalesPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Bidhaa[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastFiveSales, setLastFiveSales] = useState<Sale[]>([]);

  // Fetch all products
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/products/` , {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials : 'include'
        });
        if (!response.ok) {
          throw new Error("Could not fetch products");
        }
        const data: Bidhaa[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  // Fetch all sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/sales` , {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:'include'
        });
        if (!response.ok) {
          throw new Error("Could not fetch sales");
        }
        const data: Sale[] = await response.json();
        setSales(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchSales();
  }, []);

  // Fetch last 5 sales
  useEffect(() => {
    const fetchLastFiveSales = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}api/sales/last-five-sales` , {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials:'include'
          }
        );
        if (!response.ok) {
          throw new Error("Could not fetch last 5 sales");
        }
        const data: Sale[] = await response.json();
        console.log("Fetched sales data:", data); // Log the response
        setLastFiveSales([...data]); // Update the state with a new array
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLastFiveSales();
  }, []);


  // Add new sale
  const handleAddSale = async () => {

    if (selectedDate && selectedProduct && quantity) {
      try {
        const response = await fetch(`${API_BASE_URL}api/sales`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: parseInt(selectedProduct),
            quantity: parseInt(quantity),
          }),
          credentials:'include'
        });

        if (!response.ok) {
          throw new Error("Failed to add sale");
        }

        const newSale: Sale = await response.json();

        // Update sales and last 5 sales
        setSales((prevSales) => [newSale, ...prevSales]);
        setLastFiveSales((prevLastFiveSales) => [
          newSale,
          ...prevLastFiveSales.slice(0, 4),
        ]);

        // Reset form
        setSelectedProduct("");
        setQuantity("");
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <AuthGuard >
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Record Sales</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sale Date</Label>
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.ID} value={product.ID.toString()}>
                      {product.name} (${product.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
            <Button onClick={handleAddSale}>Add Sale</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Last 5 Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lastFiveSales.map((sale, index) => {
                console.log("Sale Product:", sale.Product); // Debugging
                return (
                  <TableRow key={index}>
                    <TableCell>{new Date(sale.sold_at).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.Product?.name || "Unknown Product"}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>Ksh {sale.total.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
    </AuthGuard>
  );
}
