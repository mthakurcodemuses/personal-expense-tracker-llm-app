import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { mockExpenses, getCategoryTotal } from "@/lib/mock-data";
import { categoryColors } from "@/lib/utils";
import { useCategory } from "@/lib/category-context";
import { cn } from "@/lib/utils";

export default function CategoryChart() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const categoryTotals = getCategoryTotal(mockExpenses);

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  const onPieClick = (data: any) => {
    const category = data.name;
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="w-full h-[400px]">
      <div className="text-sm text-muted-foreground mb-4">
        Click on a category to filter merchants
      </div>
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
            onClick={onPieClick}
            className="cursor-pointer"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={categoryColors[entry.name as keyof typeof categoryColors]}
                opacity={selectedCategory === null || selectedCategory === entry.name ? 1 : 0.5}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP'
            }).format(value)}
          />
          <Legend 
            formatter={(value) => (
              <span className={cn(
                "cursor-pointer",
                selectedCategory === value ? "font-bold" : ""
              )}
                onClick={() => setSelectedCategory(
                  selectedCategory === value ? null : value
                )}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}