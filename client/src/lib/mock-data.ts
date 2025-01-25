export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  merchant: string;
  description: string;
}

export const mockExpenses: Expense[] = [
  // January
  {
    id: "1",
    date: "2025-01-05",
    amount: 89.50,
    category: "Transportation",
    merchant: "Trainline",
    description: "London-Manchester Return"
  },
  {
    id: "2",
    date: "2025-01-10",
    amount: 75.25,
    category: "Groceries",
    merchant: "Tesco",
    description: "Weekly groceries"
  },
  {
    id: "3", 
    date: "2025-01-15",
    amount: 120.00,
    category: "Shopping",
    merchant: "Marks & Spencer",
    description: "Winter clothing"
  },
  {
    id: "4",
    date: "2025-01-20",
    amount: 210.50,
    category: "Transportation",
    merchant: "easyJet",
    description: "Flight to Edinburgh"
  },

  // February
  {
    id: "5",
    date: "2025-02-02",
    amount: 82.30,
    category: "Groceries",
    merchant: "Sainsbury's",
    description: "Monthly groceries"
  },
  {
    id: "6",
    date: "2025-02-12",
    amount: 45.00,
    category: "Dining Out",
    merchant: "Pizza Express",
    description: "Dinner with friends"
  },
  {
    id: "7",
    date: "2025-02-18",
    amount: 95.00,
    category: "Entertainment",
    merchant: "Vue Cinema",
    description: "Movie night"
  },

  // March
  {
    id: "8",
    date: "2025-03-05",
    amount: 150.75,
    category: "Transportation",
    merchant: "British Airways",
    description: "Flight to Glasgow"
  },
  {
    id: "9",
    date: "2025-03-15",
    amount: 65.50,
    category: "Groceries",
    merchant: "Tesco",
    description: "Weekly shop"
  },
  {
    id: "10",
    date: "2025-03-25",
    amount: 55.00,
    category: "Entertainment",
    merchant: "Spotify",
    description: "Annual subscription"
  },

  // April
  {
    id: "11",
    date: "2025-04-02",
    amount: 78.90,
    category: "Shopping",
    merchant: "John Lewis",
    description: "Home goods"
  },
  {
    id: "12",
    date: "2025-04-10",
    amount: 92.45,
    category: "Transportation",
    merchant: "Trainline",
    description: "London-Bristol Return"
  }
];

export const getExpensesByMonth = (month: number) => {
  return mockExpenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === month - 1;
  });
};

export const getCategoryTotal = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getMerchantTotal = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => {
    acc[expense.merchant] = (acc[expense.merchant] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};
