import { AppBar, Typography, CardMedia, IconButton, ImageList, ImageListItem, Toolbar } from '@mui/material';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import myImage from './logo.jpeg'; // Adjust the path accordingly


export default function TopBar({ theme, toggleTheme }: any) {
    return (
        <AppBar position="static" elevation={0} sx={{
            backgroundColor: theme.palette.grey[200], // slightly darker for the sidebar
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: "flex-start" }}>
                {/*
                <CardMedia
                    component="img"
                    height="40"
                    width="40"
                    image={myImage}
                    alt="My Image"
                    sx={{ objectFit: 'contain', margin: '0px' }} // Adjust the image to cover the area
    />*/}
                <Typography variant="h4" style={{
                    flexGrow: 1, textAlign: 'left',
                    color: theme.palette.primary.main,
                    display: 'inline-block', // Added for inline display
                    verticalAlign: 'middle', // Align text vertically
                    lineHeight: '64px',
                }}>
                    Expense Splitter
                </Typography>
                <IconButton edge="end" color="inherit" aria-label="theme switch" style={{
                    display: 'flex',
                    verticalAlign: 'middle', // Align icon vertically
                    color: theme.palette.primary.main,
                }}
                >
                    <Brightness5Icon />
                </IconButton>
            </Toolbar>
        </AppBar >
    );
}