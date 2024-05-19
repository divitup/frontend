import { ReceiptInfo, Expense } from "./interface";

export const formatTo2Decimal = (num: number): string => {
  return num.toFixed(2);
};

// Extract expenses from a receipt information received from the backend server
export const extractExpensesFromReceipt = (receipt: ReceiptInfo): Expense[] => {
  const expenses: Expense[] = [];
  const { items_purchased } = receipt;

  items_purchased.forEach((item) => {
    // Attempt to parse the item cost as a float
    const cost = parseFloat(item.item_cost.replace(/[$,]/g, "")); // Remove currency symbols and commas

    // Check if the parsed cost is a valid number
    if (!isNaN(cost)) {
      // Assuming Expense can be created like this and has an appropriate constructor or factory method
      const expense: Expense = { tax: false, amount: cost, memberIds: [] };
      expenses.push(expense);
    }
  });

  return expenses;
};
