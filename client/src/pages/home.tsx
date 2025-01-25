import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ExpenseGrid from "@/components/expense-grid";
import CategoryChart from "@/components/category-chart";
import MerchantAnalysis from "@/components/merchant-analysis";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Expense Tracker 2025</h1>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Statement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Breakdown</h2>
            <ExpenseGrid />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Category Analysis</h2>
            <CategoryChart />
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Merchant Analysis</h2>
          <MerchantAnalysis />
        </Card>
      </div>
    </div>
  );
}
