import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getExpensesByMonth } from "@/lib/mock-data";
import { formatGBP } from "@/lib/utils";

const months = ["January", "February", "March", "April"];

export default function ExpenseGrid() {
  const [currentMonth, setCurrentMonth] = useState(1);

  const expenses = getExpensesByMonth(currentMonth);
  const monthTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const nextMonth = () => {
    setCurrentMonth(curr => Math.min(curr + 1, 4));
  };

  const prevMonth = () => {
    setCurrentMonth(curr => Math.max(curr - 1, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            disabled={currentMonth === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">{months[currentMonth - 1]}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            disabled={currentMonth === 4}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-lg font-semibold">
          Total: {formatGBP(monthTotal)}
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.merchant}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="text-right">
                  {formatGBP(expense.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
