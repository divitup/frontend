export interface PersonInfo {
  id: number;
  name: string;
  amount: number;
  color: string;
  allChecked: boolean;
}

export interface Expense {
  tax: boolean;
  amount: number;
  memberIds: number[];
}
