import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockExpenses } from "@/lib/mock-data";
import { formatGBP } from "@/lib/utils";
import { CalendarRange, TrendingUp } from "lucide-react";

interface MonthData {
  name: string;
  total: number;
  year: number;
  month: number;
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
        year,
        month
      };
    })
    .sort((a, b) => {
      const yearDiff = a.year - b.year;
      if (yearDiff !== 0) return yearDiff;
      return a.month - b.month;
    })
    .slice(-12); // Show last 12 months by default
}

function getYearlyData(): MonthData[] {
  const yearlyTotals = mockExpenses.reduce((acc, expense) => {
    const year = new Date(expense.date).getFullYear();
    acc[year] = (acc[year] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(yearlyTotals)
    .map(([year, total]) => ({
      name: year,
      total,
      year: parseInt(year),
      month: 0
    }))
    .sort((a, b) => a.year - b.year);
}

export default function MonthlyTrend() {
  const [viewType, setViewType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const data = viewType === 'monthly' ? getMonthlyData() : getYearlyData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].value;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">
            {label} {viewType === 'monthly' ? payload[0].payload.year : ''}
          </p>
          <p className="text-lg font-bold text-primary">
            {formatGBP(total)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click to see details
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    const period = `${data.year}-${data.month || 1}`;
    setSelectedPeriod(selectedPeriod === period ? null : period);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">
            {viewType === 'monthly' ? 'Monthly' : 'Yearly'} Spending Trend
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewType(v => v === 'monthly' ? 'yearly' : 'monthly')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          {viewType === 'monthly' ? 'Show Yearly' : 'Show Monthly'}
        </Button>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} className="cursor-pointer">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(215, 85%, 45%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(215, 85%, 45%)" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value, index) => {
                const item = data[index];
                return viewType === 'monthly' ? `${value} ${item.year}` : value;
              }}
            />
            <YAxis 
              tickFormatter={formatGBP}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="total" 
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
            >
              {data.map((entry, index) => {
                const period = `${entry.year}-${entry.month || 1}`;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={selectedPeriod === period ? 1 : 0.7}
                    strokeWidth={selectedPeriod === period ? 2 : 0}
                    stroke="hsl(215, 85%, 45%)"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}