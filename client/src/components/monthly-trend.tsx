import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockExpenses } from "@/lib/mock-data";
import { formatGBP } from "@/lib/utils";

interface MonthData {
  name: string;
  total: number;
  year: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthlyData(): MonthData[] {
  const monthlyTotals = mockExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(monthlyTotals)
    .map(([monthYear, total]) => {
      const [year, month] = monthYear.split('-').map(Number);
      return {
        name: monthNames[month - 1],
        total,
        year
      };
    })
    .sort((a, b) => {
      const yearDiff = a.year - b.year;
      if (yearDiff !== 0) return yearDiff;
      return monthNames.indexOf(a.name) - monthNames.indexOf(b.name);
    })
    .slice(-4);
}

export default function MonthlyTrend() {
  const data = getMonthlyData();

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value, index) => {
              const item = data[index];
              return `${value} ${item.year}`;
            }}
          />
          <YAxis 
            tickFormatter={formatGBP}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: number) => formatGBP(value)}
            labelStyle={{ color: 'black' }}
          />
          <Bar 
            dataKey="total" 
            fill="hsl(215, 85%, 45%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}