"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";
import AuthGuard from "@/utils/auth";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {

    // Validate inputs
    if (!reportType) {
      alert("Please select a report type.");
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      alert("Please select a valid date range.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          reportType,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }),
      });

      if (response.ok) {
        const reportBlob = await response.blob(); // Get the PDF file as a blob
        const reportUrl = URL.createObjectURL(reportBlob); // Create a temporary URL for the PDF file
        const link = document.createElement("a");
        link.href = reportUrl;
        link.download = `${reportType}_report_${new Date().toISOString().slice(0, 10)}.pdf`;
        link.click();
        URL.revokeObjectURL(reportUrl); // Clean up the temporary URL
        alert("Report generated successfully!");
      } else {
        alert("Failed to generate the report. Please try again.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("An error occurred while generating the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Generate Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Report Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select a report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-stock">Current Stock</SelectItem>
                <SelectItem value="added-stock">Added Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="sales">Sales Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DatePickerWithRange
              onChange={(selectedDateRange) =>
                setDateRange({
                  from: selectedDateRange?.from || null,
                  to: selectedDateRange?.to || null,
                })
              }
            />
          </div>

          {/* Generate Report Button */}
          <Button onClick={handleGenerateReport} className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>
    </div>
    </AuthGuard>
  );
}

