// @TODO: remove any top empty lines upon adding valid expenses
import { styled } from "@mui/material/styles";
import { Select, TableCell, TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)({
  display: "flex",
  alignItems: "stretch", // Ensure cells stretch to the row height
  "& > *": {
    display: "flex",
    alignItems: "center", // Center items vertically
  },
});

export const TaxCell = styled(TableCell)({
  display: "flex",
  alignItems: "center",
  width: "15%",
  textAlign: "right",
});

export const AmountCell = styled(TableCell)({
  width: "15%",
  display: "flex",
  alignItems: "center",
});

export const MemberCell = styled(TableCell)({
  display: "flex", // Use flex layout
  flexWrap: "wrap", // Allow wrapping of child elements
  textAlign: "right",
  width: "50%",
  maxWidth: "40%",
  padding: "8px", // Adjust padding to ensure consistent spacing
});

export const PerMemberCell = styled(TableCell)({
  display: "flex",
  width: "20%",
  alignItems: "center",
});

export const DeleteCell = styled(TableCell)({
  display: "flex",
  width: "10%",
});

export const StyledSelect = styled(Select)({
  padding: "2px",
  border: "none",
  "& .MuiSelect-select": {
    padding: "0 24px 0 0", // Adjust padding as needed, keeping space for the icon
    minWidth: "auto", // To make the Select as small as possible
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
});
