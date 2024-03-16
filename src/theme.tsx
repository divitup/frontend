import { createTheme, ThemeProvider } from '@mui/material';



const theme = createTheme({
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Customize the font
    },
    palette: {
        background: {
            default: '#f4f4f4', // Customize the default background color
            paper: '#ffffff', // Customize the background color of paper-based components
        },
        primary: {
            main: '#303f9f', // Customize the primary color
        },
        // Add other color overrides if needed
    },
});