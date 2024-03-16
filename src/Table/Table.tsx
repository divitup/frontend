import React, { useState, useEffect, ChangeEventHandler } from "react";
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,

} from "@mui/material";
import { Theme } from "@emotion/react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SwapVertIcon from '@mui/icons-material/SwapVert';

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


const CustomTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        border: 'none',
        fontSize: 'small',
    },
    '& .MuiInput-underline:before': {
        borderBottom: 'none',
    },
    '& .MuiInput-underline:after': {
        borderBottom: 'none',
    },
});

const StyledSelect = styled(Select)({
    padding: '2px',
    border: 'none',
    '& .MuiSelect-select': {
        padding: '0 24px 0 0', // Adjust padding as needed, keeping space for the icon
        minWidth: 'auto' // To make the Select as small as possible
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    }
})

interface MemberSelectionProps {
    selected: PersonInfo[];
    total: PersonInfo[];
    onSelect: (id: any) => void;
    onUnselect: (id: number) => void;
}

function MemberSelection(props: MemberSelectionProps) {
    const { selected, total, onSelect, onUnselect } = props;
    return (<div>
        {selected.map((member: PersonInfo) => (
            <Chip
                key={member.id}
                label={member.name}
                onDelete={() => {
                    onUnselect(member.id);
                }}
                style={{
                    backgroundColor: member.color,
                    margin: "2px",
                }}
            />
        ))}
        {
            selected.length !== total.length ?
                <StyledSelect
                    multiple
                    displayEmpty
                    labelId="demo-select-small-label"
                    value={[...total.map(member => member.id)]}
                    id="demo-select-small"
                    onChange={(e) => onSelect(e.target.value)}
                    renderValue={() => { return '' }}
                    IconComponent={AddCircleIcon}
                >
                    {total.map((member) =>
                        !member.allChecked ?
                            <MenuItem key={member.id} value={member.id}>
                                {member.name}
                            </MenuItem>
                            : null // Return null if the condition is not met
                    )}
                </StyledSelect> : null

        }
    </div>);
}

interface ExpenseTableTitleProps {
    addExpense: () => void;
}

function ExpenseTableTitle(props: ExpenseTableTitleProps) {
    const { addExpense } = props;
    return (<div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            Expenses
        </Typography>
        <div>
            <IconButton onClick={addExpense}>
                <AddBoxIcon sx={{ fontSize: 20 }} />
            </IconButton>
        </div>
    </div>);
}

interface ExpenseTableHeadProps {
    members: PersonInfo[],
    onMemberCheckAllDelete: (arg0: any) => void,
    onMemberCheckAllAdd: (arg0: any) => void,
    taxPercent: number,
    onTaxPercentChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    numTaxChecked: number;
    taxCheckedCnt: number;
    onTaxCheckAllClick: () => void;
    numMemberChecked: number;
    memberCheckedCnt: number;
    onMemberCheckAllClick: () => void;
}

function ExpenseTableHead(props: ExpenseTableHeadProps) {
    const {
        members,
        onMemberCheckAllDelete,
        onMemberCheckAllAdd,
        taxPercent,
        onTaxPercentChange,
        numTaxChecked,
        taxCheckedCnt,
        onTaxCheckAllClick,
        numMemberChecked,
        memberCheckedCnt,
        onMemberCheckAllClick,
    } = props;


    useEffect(() => {
        computeMembersAllCheckedCnt()
    }, [members]);

    const [membersAllCheckedCnt, setMembersAllCheckedCnt] = useState<number>(0);

    const computeMembersAllCheckedCnt = () => {
        const count = members.reduce((acc, member) => {
            return member.allChecked ? acc + 1 : acc;
        }, 0); // Initial value of the accumulator is 0

        setMembersAllCheckedCnt(count);
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <TextField
                            label="Tax"
                            id="standard-size-small"
                            size="small"
                            value={taxPercent === 0 ? "" : taxPercent}
                            onChange={onTaxPercentChange}
                            variant="standard"
                            style={{
                                width: '40%'
                            }}
                        />
                        <Checkbox
                            color="primary"
                            indeterminate={numTaxChecked > 0 && numTaxChecked < taxCheckedCnt}
                            checked={numTaxChecked === taxCheckedCnt}
                            onChange={onTaxCheckAllClick}
                            inputProps={{
                                "aria-label": "select all has tax",
                            }}
                        />
                    </Box>
                </TableCell>
                <TableCell >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography> Amount</Typography>
                        <TableSortLabel
                            direction={"asc"}
                            onClick={() => { return "asc"; }}
                        >
                            <SwapVertIcon sx={{ fontSize: 20, marginLeft: '8px', marginRight: '8px' }} />
                        </TableSortLabel>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box display="flex" justifyContent="flex-start" alignItems="center">
                        <Typography> Members</Typography>
                        {members.map((member: PersonInfo) => (
                            member.allChecked ? (
                                <Chip
                                    key={member.id}
                                    label={member.name}
                                    onDelete={() => {
                                        onMemberCheckAllDelete(member.id);
                                    }}
                                    style={{
                                        backgroundColor: member.color,
                                        margin: "2px",
                                    }}
                                />
                            ) : null
                        ))}
                        {membersAllCheckedCnt !== members.length ?
                            <StyledSelect
                                multiple
                                displayEmpty
                                labelId="demo-select-small-label"
                                value={members.filter(member => member.allChecked).map(member => member.id)}
                                id="demo-select-small"
                                onChange={(e) => onMemberCheckAllAdd(e.target.value)
                                }
                                renderValue={() => { return '' }}
                                IconComponent={AddCircleIcon}
                            >
                                {members.map((member) =>
                                    <MenuItem key={member.id} value={member.id} disabled={member.allChecked}>
                                        {member.name}
                                    </MenuItem>
                                )}
                            </StyledSelect> : null
                        }
                        <Checkbox
                            color="primary"
                            indeterminate={
                                numMemberChecked > 0 && numMemberChecked < memberCheckedCnt
                            }
                            checked={
                                memberCheckedCnt > 0 && numMemberChecked === memberCheckedCnt
                            }
                            onChange={onMemberCheckAllClick}
                            inputProps={{
                                "aria-label": "select all members",
                            }}
                        />
                    </Box>
                </TableCell>
            </TableRow>
        </TableHead >
    );
}

interface PersonInfo {
    id: number;
    name: string;
    amount: number;
    color: string;
    allChecked: boolean;
}

interface Expense {
    tax: boolean;
    amount: number;
    memberIds: number[];
}

export default function ExpenseTable(props: {
    theme: Theme;
    toggleTheme: any;
}) {

    const [taxCheckedCnt, setTaxCheckedCnt] = useState<number>(0);
    const [taxPercent, setTaxPercent] = useState<number>(0.07);

    const [membersAllCheckedCnt, setMembersAllCheckedCnt] = useState<number>(0);
    const [members, setMembers] = React.useState<PersonInfo[]>([
        { id: 0, name: "Ao Wang", amount: 0, color: Colors[0], allChecked: false },
        { id: 1, name: "Xiaoheng Xia", amount: 0, color: Colors[1], allChecked: false },
        { id: 2, name: "Hanyu Xu", amount: 0, color: Colors[2], allChecked: false },
    ]);

    const [expenses, setExpenses] = React.useState<Expense[]>([
        { tax: false, amount: 0, memberIds: [] },
        { tax: false, amount: 0, memberIds: [] },
        { tax: false, amount: 0, memberIds: [] },
    ]);

    useEffect(() => {
        console.log(expenses)
        calculateMemberTotals()
    }, [expenses]);


    /* Remove a member from all expenses */
    const removeMemberAllChecked = (index: number, member: PersonInfo) => {
        if (member.allChecked) {
            setMembersAllCheckedCnt(membersAllCheckedCnt - 1);
        }
        const newMembers = [...members];
        newMembers[index].allChecked = false;
        setMembers(newMembers);
        removeFromAllExpenseMemberList(member.id)

    }

    const removeFromAllExpenseMemberList = (memberId: number) => {
        const updatedExpenses: Expense[] = expenses.map((expense: Expense) => ({
            ...expense,
            memberIds: expense.memberIds.filter(id => id !== memberId)
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
        addToAllExpenseMemberList(memberId)
    }

    const addToAllExpenseMemberList = (memberId: number) => {
        const updatedExpenses: Expense[] = expenses.map((expense: Expense) => ({
            ...expense,
            memberIds: expense.memberIds.includes(memberId) ? expense.memberIds : [...expense.memberIds, memberId]
        }));
        setExpenses(updatedExpenses);
    };

    const onTaxPercentChange = (event: any) => {
        const inputValue = (event.target as any).value;
        const numericValue = parseFloat(inputValue) / 100;
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 1) {
            setTaxPercent(numericValue);
        }
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
            const updatedExpenses = expenses.map((expense) => ({
                ...expense,
                tax: false,
            }));
            setExpenses(updatedExpenses);
            return;
        }
        // set tax checked count to equal to total expenses count
        setTaxCheckedCnt(expenses.length);
        const updatedExpenses = expenses.map((expense) => ({
            ...expense,
            tax: true,
        }));
        setExpenses(updatedExpenses);
    };

    const findMember = (memberId: number) => {
        return members.find((member) => member.id === memberId);
    }

    const addExpense = () => {
        setExpenses([...expenses, { tax: false, amount: 0, memberIds: [] }]);
    };

    const updateExpense = (index: number, field: keyof Expense, value: any) => {
        console.log("expense", value)
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
    }

    // Function to calculate the total expense for each member
    const calculateMemberTotals = () => {
        const memberTotals: { [key: number]: number } = {};
        expenses.forEach((expense) => {
            expense.memberIds.forEach((memberId) => {
                if (!memberTotals[memberId]) {
                    memberTotals[memberId] = 0;
                }
                memberTotals[memberId] += expense.amount / expense.memberIds.length;
            });
        });
        return memberTotals;
    };

    const calculateTotalExpense = () => {
        /*
        return expenses.reduce((total, exp) => {
            return total + exp.amount;
        }, 0).toFixed(2);
        */
        return 0;
    };

    const updateExpenseAmount = (index: number, amount: any) => {
        const updatedExpenses = [...expenses];
        updatedExpenses[index].amount = amount;
        setExpenses(updatedExpenses);
        // calculateTotalExpense();
    }

    const deleteExpense = (number: number) => {
        const expensesCopy = [
            ...expenses.slice(0, number),
            ...expenses.slice(number + 1)
        ];
        setExpenses(expensesCopy);
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', padding: '16px' }}>
            <div style={{ width: '30%', }}>
                <Card sx={{ margin: 2, padding: '16px' }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                            Total Expenses
                        </Typography>
                        <Typography variant="h3" component="div" sx={{ padding: '8px' }}>
                            {calculateTotalExpense()}
                        </Typography>
                        {members.map((member) => {
                            return (
                                <Typography sx={{ fontSize: 16, padding: '4px' }}>{`${member?.name}: $${member.amount}`} </Typography>
                            );
                        })
                        }
                    </CardContent>
                </Card>
            </div>
            <Card sx={{ margin: 2, width: "100%", mb: 2 }}>
                <TableContainer sx={{ padding: '32px' }}>
                    <ExpenseTableTitle addExpense={addExpense} />
                    <Table size="small">


                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <TextField
                                            label="Tax"
                                            id="standard-size-small"
                                            size="small"
                                            value={taxPercent === 0 ? "" : taxPercent}
                                            onChange={onTaxPercentChange}
                                            variant="standard"
                                            style={{
                                                width: '40%'
                                            }}
                                        />
                                        <Checkbox
                                            color="primary"
                                            indeterminate={taxCheckedCnt > 0 && taxCheckedCnt < taxCheckedCnt}
                                            checked={taxCheckedCnt === taxCheckedCnt}
                                            onChange={onTaxCheckAllClick}
                                            inputProps={{
                                                "aria-label": "select all has tax",
                                            }}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell >
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography> Amount</Typography>
                                        <TableSortLabel
                                            direction={"asc"}
                                            onClick={() => { return "asc"; }}
                                        >
                                            <SwapVertIcon sx={{ fontSize: 20, marginLeft: '8px', marginRight: '8px' }} />
                                        </TableSortLabel>
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    <Box display="flex" justifyContent="flex-start" alignItems="center">
                                        <Typography> Members</Typography>
                                        {members.map((member: PersonInfo, memberIndex: number) => {
                                            return (
                                                member.allChecked ? <Chip
                                                    key={memberIndex}
                                                    label={member.name}
                                                    onDelete={() => {
                                                        removeMemberAllChecked(memberIndex, member);
                                                    }
                                                    }
                                                    style={{
                                                        backgroundColor: member.color,
                                                        margin: "2px",
                                                    }}
                                                /> : null
                                            );
                                        })}

                                        {
                                            membersAllCheckedCnt !== members.length ?
                                                <StyledSelect
                                                    multiple
                                                    displayEmpty
                                                    labelId="demo-select-small-label"
                                                    value={[]}
                                                    id="demo-select-small"
                                                    onChange={(e: any) =>
                                                        addMemberAllChecked(e.target.value[0])
                                                    }
                                                    renderValue={() => { return '' }}
                                                    IconComponent={AddCircleIcon}
                                                >
                                                    {
                                                        members
                                                            .filter(member => !member.allChecked) // Implement this check based on your state structure
                                                            .map(filteredMember => (
                                                                <MenuItem key={filteredMember.id} value={filteredMember.id}>
                                                                    {filteredMember.name}
                                                                </MenuItem>
                                                            ))
                                                    }
                                                </StyledSelect> : null
                                        }
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead >


                        <TableBody>
                            {expenses.map((expense, index) => (
                                <TableRow key={index}>
                                    <TableCell align="right" style={{ width: "130px" }}>
                                        <Checkbox
                                            checked={expenses[index]["tax"]}
                                            onChange={() => onTaxCheck(index)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            hiddenLabel
                                            id={`amount-${index}`}
                                            defaultValue="Small"
                                            variant="filled"
                                            size="small"
                                            type="number"
                                            value={expense.amount}
                                            onChange={(e) =>
                                                updateExpense(
                                                    index,
                                                    "amount",
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    // Find the next index
                                                    const nextIndex = index + 1;
                                                    if (nextIndex < expenses.length) {
                                                        // Focus the next TextField
                                                        (document.getElementById(`amount-${nextIndex}`) as any).focus();
                                                    }
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ width: "700px" }}>
                                        {expense.memberIds.map((memberId, memberIndex) => {
                                            console.log(expense)
                                            console.log(members)
                                            console.log(memberId)
                                            console.log(memberIndex)
                                            const member: any = members.find(
                                                (person) => person.id === memberId
                                            );
                                            return (
                                                <Chip
                                                    key={memberIndex}
                                                    label={member.name}
                                                    onDelete={() => {
                                                        removeExpenseMember(index, memberId);
                                                    }
                                                    }
                                                    style={{
                                                        backgroundColor: member.color,
                                                        margin: "2px",
                                                    }}
                                                />
                                            );
                                        })}
                                        {members.length !== expense.memberIds.length ?
                                            <StyledSelect
                                                multiple
                                                displayEmpty
                                                labelId="demo-select-small-label"
                                                value={expense.memberIds}
                                                id="demo-select-small"
                                                onChange={(e) =>
                                                    updateExpense(index, "memberIds", e.target.value)
                                                }
                                                renderValue={() => { return '' }}
                                                IconComponent={AddCircleIcon}
                                            >
                                                {members.map((member) =>
                                                    !expense.memberIds.includes(member.id) ? (
                                                        <MenuItem key={member.id} value={member.id}>
                                                            {member.name}
                                                        </MenuItem>
                                                    ) : null // Return null if the condition is not met
                                                )}
                                            </StyledSelect> : null
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {expense.memberIds.length > 0
                                            ? (expense.amount / expense.memberIds.length).toFixed(3)
                                            : "0.00"}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton>
                                            <DeleteIcon sx={{ fontSize: 20 }} onClick={() => { deleteExpense(index) }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </div >
    );
}
