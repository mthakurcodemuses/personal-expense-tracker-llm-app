import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ExpenseGrid from "@/components/expense-grid";
import CategoryChart from "@/components/category-chart";
import MerchantAnalysis from "@/components/merchant-analysis";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker 2025</h1>
          <Button variant="outline" className="bg-white">
            <Upload className="mr-2 h-4 w-4" />
            Upload Statement
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Monthly Expenses</h2>
            <ExpenseGrid />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Category Breakdown</h2>
              <CategoryChart />
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Merchant Analysis</h2>
              <MerchantAnalysis />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}