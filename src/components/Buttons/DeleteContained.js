import React from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.error.main,
    //backgroundColor: theme.palette.primary.main,
    "&:focus": {
      outline: "none"
    },
    "&:hover": {
      textDecoration: "none",
      //color: "white",
      //backgroundColor: theme.palette.primary.main
    },
    padding: "10px 20px",
    fontSize: "1rem",
    "& span": {
      display: "flex",
      flexDirection: "column"
    }
  }
}));

const DeleteContained = (props) => {
  const classes = useStyles();
  return (
    <Button
      {...props}
      className={`${classes.root} ${props.className ? props.className : ""}`}
    >
      {props.children}
    </Button>
  )
}

export default DeleteContained;
