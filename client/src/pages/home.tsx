import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ExpenseGrid from "@/components/expense-grid";
import CategoryChart from "@/components/category-chart";
import MerchantAnalysis from "@/components/merchant-analysis";
import MonthlyTrend from "@/components/monthly-trend";
import { CategoryProvider } from "@/lib/category-context";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('statement', file);

      const response = await fetch('/api/upload-statement', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log('Extracted expenses:', data);

      toast({
        title: "Success",
        description: "Statement processed successfully",
      });

      // TODO: Update the expense state with the new data

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to process the statement",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <CategoryProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracker 2025</h1>
            <div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                ref={fileInputRef}
                className="hidden"
                id="pdf-upload"
              />
              <Button
                variant="outline"
                className="bg-white"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={`mr-2 h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
                {isUploading ? 'Processing...' : 'Upload Statement'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Monthly Expenses</h2>
              <ExpenseGrid />
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Expense Trend</h2>
              <MonthlyTrend />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Category Breakdown</h2>
              <CategoryChart />
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Top Merchants</h2>
              <MerchantAnalysis />
            </Card>
          </div>
        </div>
      </div>
    </CategoryProvider>
  );
}