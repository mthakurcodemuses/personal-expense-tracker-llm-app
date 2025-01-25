import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockExpenses, getMerchantTotal } from "@/lib/mock-data";
import { formatGBP } from "@/lib/utils";

export default function MerchantAnalysis() {
  const merchantTotals = getMerchantTotal(mockExpenses);
  
  const data = Object.entries(merchantTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      amount: value
    }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={formatGBP} />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip 
            formatter={(value: number) => formatGBP(value)}
            labelStyle={{ color: 'black' }}
          />
          <Bar 
            dataKey="amount" 
            fill="hsl(258, 90%, 66%)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
