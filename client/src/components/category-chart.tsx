import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { mockExpenses, getCategoryTotal } from "@/lib/mock-data";
import { categoryColors } from "@/lib/utils";

export default function CategoryChart() {
  const categoryTotals = getCategoryTotal(mockExpenses);
  
  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => 
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={categoryColors[entry.name as keyof typeof categoryColors]}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP'
            }).format(value)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
