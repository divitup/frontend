import { useState } from "react";
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { PersonInfo } from "./interface";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface MemberCardProps {
  members: PersonInfo[];
  addMember: (name: string) => void;
}

export default function MemberCard(props: MemberCardProps) {
  const { members, addMember } = props;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    addMember(name); // Add member to the member list
    setName(""); // Clear the input field
    handleClose(); // Close the dialog
  };

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  return (
    <Card sx={{ margin: 2, padding: "16px" }}>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
          Members
        </Typography>
        {members.map((member, index) => {
          return (
            <div>
              <Chip
                key={index}
                label={`${member?.name}: $${member.amount.toFixed(2)}`}
                style={{
                  fontSize: "16px",
                  backgroundColor: member.color,
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              />
            </div>
          );
        })}
        <div>
          <IconButton
            onClick={handleClickOpen}
            sx={{ padding: "0px", marginTop: "10px", marginBottom: "0px" }}
          >
            <AddBoxIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add a New User</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="User Name"
                type="text"
                fullWidth
                value={name}
                onChange={handleNameChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleOk} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
