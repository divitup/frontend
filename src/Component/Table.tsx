// @TODO: remove any top empty lines upon adding valid expenses
import React, { useState, useEffect, useRef } from "react";
import { Theme } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Checkbox,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatTo2Decimal } from "./utility";
import { PersonInfo, Expense } from "./interface";
import MemberCard from "./MemberCard";
import {
  StyledTableRow,
  TaxCell,
  AmountCell,
  MemberCell,
  PerMemberCell,
  DeleteCell,
  StyledSelect,
} from "./StyledTableComponents";
import ExpenseTableHead from "./TableHead";
import ExpenseTableTitle from "./TableTitle";

// Colors for member chips
const Colors = [
  "#e57373",
  "#9fa8da",
  "#ffe082",
  "#aed581",
  "#e91e63",
  "#2196f3",
  "#4caf50",
  "#ffc107",
];

// Main component for displaying and managing expenses
export default function ExpenseTable(props: {
  theme: Theme;
  toggleTheme: any;
}) {
  const { theme, toggleTheme } = props;

  // Track how many expenses has tax
  const [taxCheckedCnt, setTaxCheckedCnt] = useState<number>(0);
  // Tax Percentage for the expenses
  const [taxPercent, setTaxPercent] = useState<number>(7);

  // Ref for the last input field, this is used for automatically
  // setting focus
  const lastInputRef = useRef(null);
  const [settingLastInput, setSettingLastInput] = useState<number>(-1);

  // Track how many members are checked for all expenses
  const [membersAllCheckedCnt, setMembersAllCheckedCnt] = useState<number>(0);

  // Members listed
  const [members, setMembers] = useState<PersonInfo[]>(() => {
    const savedMembers = localStorage.getItem("members");
    return savedMembers
      ? JSON.parse(savedMembers)
      : [
          {
            id: 0,
            name: "Ao Wang",
            amount: 0,
            color: Colors[0],
            allChecked: false,
          },
          {
            id: 1,
            name: "Xiaoheng Xia",
            amount: 0,
            color: Colors[1],
            allChecked: false,
          },
          {
            id: 2,
            name: "Hanyu Xu",
            amount: 0,
            color: Colors[2],
            allChecked: false,
          },
          {
            id: 3,
            name: "Ye Yuan",
            amount: 0,
            color: Colors[3],
            allChecked: false,
          },
        ];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses
      ? JSON.parse(savedExpenses)
      : [
          { tax: false, amount: 0, memberIds: [] },
          { tax: false, amount: 0, memberIds: [] },
          { tax: false, amount: 0, memberIds: [] },
        ];
  });

  // Save state to local storage when expenses or members change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("members", JSON.stringify(members));
  }, [expenses, members]);

  useEffect(() => {
    console.log(expenses);
    calculateMemberTotals();
    if (settingLastInput > 0) {
      console.log("setting last input");
      (document.getElementById(`amount-${settingLastInput}`) as any).focus();
      setSettingLastInput(-1);
    }
  }, [expenses, settingLastInput]);

  /* Remove a member from all expenses */
  const removeMemberAllChecked = (index: number, member: PersonInfo) => {
    if (member.allChecked) {
      setMembersAllCheckedCnt(membersAllCheckedCnt - 1);
    }
    const newMembers = [...members];
    newMembers[index].allChecked = false;
    setMembers(newMembers);
    removeFromAllExpenseMemberList(member.id);
  };

  const removeFromAllExpenseMemberList = (memberId: number) => {
    const updatedExpenses: Expense[] = expenses.map((expense: Expense) => ({
      ...expense,
      memberIds: expense.memberIds.filter((id) => id !== memberId),
    }));
    setExpenses(updatedExpenses);
  };

  const addMemberAllChecked = (memberId: any) => {
    console.log("memberId", memberId);
    if (!members[memberId].allChecked) {
      setMembersAllCheckedCnt(membersAllCheckedCnt + 1);
    }
    const newMembers = [...members];
    newMembers.forEach((member: PersonInfo) => {
      if (member.id === memberId) {
        member.allChecked = true;
      }
    });
    addToAllExpenseMemberList(memberId);
  };

  const addToAllExpenseMemberList = (memberId: number) => {
    const updatedExpenses: Expense[] = expenses.map((expense: Expense) => ({
      ...expense,
      memberIds: expense.memberIds.includes(memberId)
        ? expense.memberIds
        : [...expense.memberIds, memberId],
    }));
    setExpenses(updatedExpenses);
  };

  const onTaxPercentChange = (event: any) => {
    const inputValue = parseFloat(event.target.value);
    setTaxPercent(inputValue);
  };

  const onTaxCheck = (index: number) => {
    const updatedExpenses: any = [...expenses];
    let hasTax = updatedExpenses[index].tax;
    updatedExpenses[index].tax = !hasTax;
    // update tax checked count
    let newTaxCheckedCnt = hasTax ? taxCheckedCnt - 1 : taxCheckedCnt + 1;
    setTaxCheckedCnt(newTaxCheckedCnt);
    setExpenses(updatedExpenses);
  };

  const onTaxCheckAllClick = () => {
    if (taxCheckedCnt === expenses.length) {
      // unselect all
      setTaxCheckedCnt(0);
      const updatedExpenses = expenses.map((expense: any) => ({
        ...expense,
        tax: false,
      }));
      setExpenses(updatedExpenses);
      return;
    }
    // set tax checked count to equal to total expenses count
    setTaxCheckedCnt(expenses.length);
    const updatedExpenses = expenses.map((expense: any) => ({
      ...expense,
      tax: true,
    }));
    setExpenses(updatedExpenses);
  };

  const findMember = (memberId: number) => {
    return members.find((member: any) => member.id === memberId);
  };

  const addExpense = () => {
    setExpenses([...expenses, { tax: false, amount: 0, memberIds: [] }]);
  };

  const addExpenses = (newExpenses: Expense[]) => {
    setExpenses([...expenses, ...newExpenses]);
  };

  const updateExpense = (index: number, field: keyof Expense, value: any) => {
    console.log("expense", value);
    const updatedExpenses: any = [...expenses];
    updatedExpenses[index][field] = value;
    setExpenses(updatedExpenses);
  };

  const removeExpenseMember = (index: number, memberId: number) => {
    const updatedExpenses: Expense[] = [...expenses];
    updatedExpenses[index].memberIds = updatedExpenses[index].memberIds.filter(
      (m: number) => m !== memberId
    );
    setExpenses(updatedExpenses);
    const member: any = findMember(memberId);
    if (member.allChecked) {
      member.allChecked = false;
      setMembersAllCheckedCnt(membersAllCheckedCnt - 1);
    }
  };

  // Function to calculate the total expense for each member including tax
  const calculateMemberTotals = () => {
    const memberTotals: { [key: number]: number } = {};
    expenses.forEach((expense) => {
      const taxMultiplier = expense.tax ? taxPercent / 100 + 1 : 1;
      expense.memberIds.forEach((memberId) => {
        if (!memberTotals[memberId]) {
          memberTotals[memberId] = 0;
        }
        memberTotals[memberId] +=
          (expense.amount / expense.memberIds.length) * taxMultiplier;
      });
    });

    const updatedMembers = [...members];
    updatedMembers.forEach((member) => {
      if (memberTotals[member.id]) {
        member.amount = memberTotals[member.id];
      } else {
        member.amount = 0;
      }
    });
    setMembers(updatedMembers);
  };

  const calculateTotalExpense = (): number => {
    return expenses.reduce((total, expense) => {
      const taxMultiplier = expense.tax ? taxPercent / 100 + 1 : 1;
      return total + expense.amount * taxMultiplier;
    }, 0);
  };

  const calculateTotalUnassignedExpense = (): number => {
    return expenses.reduce((total, expense) => {
      const taxMultiplier = expense.tax ? taxPercent / 100 + 1 : 1;
      if (expense.memberIds.length === 0) {
        return total + expense.amount * taxMultiplier;
      } else {
        return total;
      }
    }, 0);
  };

  const deleteExpense = (number: number) => {
    const expensesCopy = [
      ...expenses.slice(0, number),
      ...expenses.slice(number + 1),
    ];
    setExpenses(expensesCopy);
  };

  const addMember = (name: string) => {
    const newMembers = [...members];
    newMembers.push({
      id: newMembers.length,
      name: name,
      amount: 0,
      color: Colors[newMembers.length],
      allChecked: false,
    });
    setMembers(newMembers);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "flex-start",
        padding: "16px",
      }}
    >
      {/* EXPENSE CARD and MEMBER CARD */}
      <div style={{ width: "30%" }}>
        <Card sx={{ margin: 2, padding: "16px" }}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              Total Expenses
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ marginBottom: "8px" }}
            >
              ${formatTo2Decimal(calculateTotalExpense())}
            </Typography>
            {calculateTotalUnassignedExpense() !== 0 ? (
              <Typography
                sx={{ fontSize: 16, marginBottom: "8px" }}
                color="error.main"
                gutterBottom
              >
                Unassigned Expenses: $
                {formatTo2Decimal(calculateTotalUnassignedExpense())}
              </Typography>
            ) : null}
          </CardContent>
        </Card>
        <MemberCard members={members} addMember={addMember} />
      </div>
      {/* EXPENSE TABLE */}
      <Card sx={{ margin: 2, width: "100%", mb: 2 }}>
        <TableContainer sx={{ padding: "32px" }}>
          <ExpenseTableTitle
            addExpense={addExpense}
            addExpenses={addExpenses}
          />
          <Table size="small">
            <ExpenseTableHead
              theme={theme}
              taxPercent={taxPercent}
              onTaxPercentChange={onTaxPercentChange}
              taxCheckedCnt={taxCheckedCnt}
              totalExpenses={expenses.length}
              onTaxCheckAllClick={onTaxCheckAllClick}
              members={members}
              removeMemberAllChecked={removeMemberAllChecked}
              addMemberAllChecked={addMemberAllChecked}
              deleteAllExpenses={() => setExpenses([])}
            />
            <TableBody>
              {expenses.map((expense, index) => (
                <StyledTableRow key={index}>
                  <TaxCell>
                    <Checkbox
                      checked={expenses[index]["tax"]}
                      onChange={() => onTaxCheck(index)}
                    />
                  </TaxCell>
                  <AmountCell>
                    <TextField
                      hiddenLabel
                      id={`amount-${index}`}
                      defaultValue="Small"
                      variant="filled"
                      size="small"
                      type="number"
                      value={expense.amount}
                      ref={index === expenses.length - 1 ? lastInputRef : null}
                      onChange={(e) =>
                        updateExpense(index, "amount", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // Find the next index
                          const nextIndex = index + 1;
                          console.log("nextIndex", nextIndex);
                          console.log("expense length", expenses.length);
                          if (nextIndex < expenses.length) {
                            // Focus the next TextField
                            (
                              document.getElementById(
                                `amount-${nextIndex}`
                              ) as any
                            ).focus();
                          } else {
                            setSettingLastInput(nextIndex);
                            addExpense();
                          }
                        }
                      }}
                      onFocus={(e) => {
                        // If the value is 0, clear the field when it gains focus
                        if (e.target.value === "0") {
                          updateExpense(index, "amount", "");
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          updateExpense(index, "amount", 0); // Reset to 0 when input is not focused and empty
                        }
                      }}
                    />
                  </AmountCell>
                  <MemberCell>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <div>
                        {expense.memberIds.map((memberId, memberIndex) => {
                          const member: any = members.find(
                            (person) => person.id === memberId
                          );
                          return (
                            <Chip
                              key={memberIndex}
                              label={member.name}
                              onDelete={() => {
                                removeExpenseMember(index, memberId);
                              }}
                              style={{
                                backgroundColor: member.color,
                                margin: "2px",
                              }}
                            />
                          );
                        })}
                      </div>
                      {members.length !== expense.memberIds.length ? (
                        <StyledSelect
                          multiple
                          displayEmpty
                          labelId="demo-select-small-label"
                          value={expense.memberIds}
                          id="demo-select-small"
                          onChange={(e) =>
                            updateExpense(index, "memberIds", e.target.value)
                          }
                          renderValue={() => {
                            return "";
                          }}
                          IconComponent={AddCircleIcon}
                        >
                          {members.map(
                            (member) =>
                              !expense.memberIds.includes(member.id) ? (
                                <MenuItem key={member.id} value={member.id}>
                                  {member.name}
                                </MenuItem>
                              ) : null // Return null if the condition is not met
                          )}
                        </StyledSelect>
                      ) : null}
                    </Box>
                  </MemberCell>
                  <PerMemberCell>
                    {expense.memberIds.length > 0
                      ? (
                          (expense.amount / expense.memberIds.length) *
                          (expense.tax ? taxPercent / 100 + 1 : 1)
                        ).toFixed(2)
                      : "0.00"}
                  </PerMemberCell>
                  <DeleteCell>
                    <IconButton>
                      <DeleteIcon
                        sx={{ fontSize: 20 }}
                        onClick={() => {
                          deleteExpense(index);
                        }}
                      />
                    </IconButton>
                  </DeleteCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
