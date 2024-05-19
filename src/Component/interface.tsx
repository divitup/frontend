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

export interface UploadReceiptResponse {
  result?: ReceiptInfo;
}

export interface ReceiptInfo {
  datetime: string;
  items_purchased: PurchasedItem[];
  subtotal: string;
  tax_rate: string;
  total_after_tax: string;
  vendor_address: string;
  vendor_name: string;
}

export interface PurchasedItem {
  item_cost: string;
  item_name: string;
}
