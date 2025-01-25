import { Card } from "@/components/ui/card";
import { formatGBP } from "@/lib/utils";
import { getExpensesByMonth } from "@/lib/mock-data";
import { CalendarRange } from "lucide-react";

interface Props {
  month: number;
}

export default function MonthlyTotal({ month }: Props) {
  const expenses = getExpensesByMonth(month);
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthNames = ["January", "February", "March", "April"];

  return (
    <Card className="p-6 bg-primary text-primary-foreground">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">Total Expenses</p>
          <h2 className="text-4xl font-bold mt-2">{formatGBP(total)}</h2>
          <p className="text-sm mt-2 opacity-80">
            <CalendarRange className="w-4 h-4 inline mr-1" />
            {monthNames[month - 1]} 2025
          </p>
        </div>
      </div>
    </Card>
  );
}
