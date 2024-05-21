import { IconButton, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Expense } from "./interface";

import ImageUploader from "./ImageUploader";

interface ExpenseTableTitleProps {
  addExpense: () => void;
  addExpenses: (expenses: Expense[]) => void;
}

export default function ExpenseTableTitle(props: ExpenseTableTitleProps) {
  const { addExpense, addExpenses } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "16px",
      }}
    >
      <Typography
        sx={{ fontSize: 20, padding: "0px", margin: "0px" }}
        color="text.primary"
        gutterBottom
      >
        Expenses
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconButton onClick={addExpense} sx={{ padding: "0px", margin: "0px" }}>
          <AddBoxIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <ImageUploader addExpenses={addExpenses} />
      </div>
    </div>
  );
}
