import { Card, CardContent } from "@/components/ui/card";
import { mockExpenses, getMerchantTotal, type Expense } from "@/lib/mock-data";
import { formatGBP } from "@/lib/utils";

interface MerchantCard {
  name: string;
  amount: number;
  transactions: number;
  trend: "up" | "down" | "stable";
}

function getMerchantStats(expenses: Expense[]): MerchantCard[] {
  const merchantTotals = getMerchantTotal(expenses);

  return Object.entries(merchantTotals)
    .map(([name, amount]) => {
      const merchantTransactions = expenses.filter(e => e.merchant === name);
      const transactionCount = merchantTransactions.length;

      // Simple trend calculation based on first and last transaction
      const sortedTransactions = merchantTransactions.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let trend: "up" | "down" | "stable" = "stable";
      if (transactionCount > 1) {
        const firstAmount = sortedTransactions[0].amount;
        const lastAmount = sortedTransactions[transactionCount - 1].amount;
        trend = lastAmount > firstAmount ? "up" : lastAmount < firstAmount ? "down" : "stable";
      }

      return {
        name,
        amount,
        transactions: transactionCount,
        trend
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
}

export default function MerchantAnalysis() {
  const merchants = getMerchantStats(mockExpenses);

  return (
    <div className="grid grid-cols-2 gap-4">
      {merchants.map((merchant) => (
        <Card key={merchant.name} className="bg-white">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-2">{merchant.name}</h3>
            <p className="text-2xl font-bold text-primary mb-1">
              {formatGBP(merchant.amount)}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{merchant.transactions} transactions</span>
              <span className="mx-2">•</span>
              <span>
                {merchant.trend === "up" ? "↑ Increasing" : 
                 merchant.trend === "down" ? "↓ Decreasing" : 
                 "→ Stable"}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}