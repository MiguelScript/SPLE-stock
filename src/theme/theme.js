import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";



/* 
  $vigitrack-segundary: #64DD17;
  $navbar: #27AA23;
  $sidenav: #071A52; 
*/
// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0d47a1",
      light: "#0d47a1",
    },
    secondary: {
      main: '#ff6f00',
    },
    error: {
      main: red.A400,
      dark:'#C81336'
    },
    background: {
      default: "#fff",
    },
    success:{
      main:'#009E43',
      dark:'#007632'
    },
    warning:{
      main:'#F2B600',
      dark:'#DAA502'
    }
  },
  typography: {
    allVariants: {
      color: "#455557",
    },
    fontFamily: '"Poppins", sans-serif',
    h4: {
      fontSize: "1.8rem",
    },
  },
  overrides: {
    MuiButton: {
      containedPrimary: {
        color: "white",
      },
      containedSecondary: {
        color: "#ffffff",
      },
    },
  },
});

export default theme;
