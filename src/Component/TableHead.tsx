import { useState, useEffect, ChangeEventHandler } from "react";
import {
  Box,
  Chip,
  Checkbox,
  IconButton,
  MenuItem,
  TableHead,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { PersonInfo } from "./interface";
import { Theme } from "@mui/material";
import {
  StyledTableRow,
  TaxCell,
  AmountCell,
  MemberCell,
  PerMemberCell,
  DeleteCell,
  StyledSelect,
} from "./StyledTableComponents";

interface ExpenseTableHeadProps {
  theme: Theme;
  members: PersonInfo[];
  removeMemberAllChecked: (index: number, member: PersonInfo) => void;
  addMemberAllChecked: (memberId: any) => void;
  taxPercent: number;
  onTaxPercentChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  taxCheckedCnt: number;
  totalExpenses: number;
  onTaxCheckAllClick: () => void;
  deleteAllExpenses: () => void;
}

/**
 * Head for expense table
 * @param ExpenseTableHeadProps
 * @returns
 */
export default function ExpenseTableHead(props: ExpenseTableHeadProps) {
  const {
    theme,
    taxPercent,
    onTaxPercentChange,
    taxCheckedCnt,
    totalExpenses,
    onTaxCheckAllClick,
    members,
    removeMemberAllChecked,
    addMemberAllChecked,
    deleteAllExpenses,
  } = props;

  useEffect(() => {
    computeMembersAllCheckedCnt();
  }, [members]);

  const [membersAllCheckedCnt, setMembersAllCheckedCnt] = useState<number>(0);

  const computeMembersAllCheckedCnt = () => {
    const count = members.reduce((acc, member) => {
      return member.allChecked ? acc + 1 : acc;
    }, 0);
    setMembersAllCheckedCnt(count);
  };

  return (
    <TableHead sx={{ backgroundColor: theme.palette.secondary.main }}>
      <StyledTableRow>
        {/* TAX HEAD CELL */}
        <TaxCell>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              label="Tax"
              id="standard-size-small"
              size="small"
              type="number"
              value={taxPercent}
              onChange={onTaxPercentChange}
              variant="standard"
              style={{
                width: "40%",
              }}
            />
            <Checkbox
              color="primary"
              indeterminate={taxCheckedCnt > 0 && taxCheckedCnt < totalExpenses}
              checked={taxCheckedCnt !== 0 && taxCheckedCnt === totalExpenses}
              onChange={onTaxCheckAllClick}
              inputProps={{
                "aria-label": "select all has tax",
              }}
            />
          </Box>
        </TaxCell>
        {/* AMOUNT HEAD CELL */}
        <AmountCell>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography style={{ marginRight: "8px" }}> Amount</Typography>
            <TableSortLabel
              direction={"asc"}
              onClick={() => {
                return "asc";
              }}
            ></TableSortLabel>
          </Box>
        </AmountCell>
        {/* MEMBERS HEAD CELL */}
        <MemberCell>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography style={{ marginRight: "8px" }}> Members</Typography>
              <div>
                {
                  /* CHIPS COMPONENT */
                  members.map((member: PersonInfo, memberIndex: number) => {
                    return member.allChecked ? (
                      <Chip
                        key={memberIndex}
                        label={member.name}
                        onDelete={() => {
                          console.log(member);
                          console.log(memberIndex);
                          removeMemberAllChecked(memberIndex, member);
                        }}
                        style={{
                          backgroundColor: member.color,
                          margin: "2px",
                        }}
                      />
                    ) : null;
                  })
                }
              </div>
            </Box>
            {
              /* SELECT COMPONENT */
              membersAllCheckedCnt !== members.length ? (
                <StyledSelect
                  multiple
                  displayEmpty
                  labelId="demo-select-small-label"
                  value={[]}
                  id="demo-select-small"
                  onChange={(e: any) => addMemberAllChecked(e.target.value[0])}
                  renderValue={() => {
                    return "";
                  }}
                  IconComponent={AddCircleIcon}
                >
                  {members
                    .filter((member) => !member.allChecked) // Implement this check based on your state structure
                    .map((filteredMember) => (
                      <MenuItem
                        key={filteredMember.id}
                        value={filteredMember.id}
                      >
                        {filteredMember.name}
                      </MenuItem>
                    ))}
                </StyledSelect>
              ) : null
            }
          </Box>
        </MemberCell>
        {/* PER MEMBERS HEAD CELL */}
        <PerMemberCell>
          <Typography style={{ marginRight: "8px" }}> Per Member </Typography>
        </PerMemberCell>
        {/* DELETE TABLE CELL */}
        <DeleteCell>
          <IconButton>
            <DeleteIcon sx={{ fontSize: 20 }} onClick={deleteAllExpenses} />
          </IconButton>
        </DeleteCell>
      </StyledTableRow>
    </TableHead>
  );
}
