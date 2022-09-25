import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  "@keyframes spinner": {
    "0%": {
      transform: "rotate(0deg)"
    },
    "100%": {
      transform: "rotate(360deg)"
    }
  },
  root: {
    display: "inline-block",
    width: "80px",
    height: "80px",
    "&:after": {
      content: '""',
      display: "block",
      width: "64px",
      height: "64px",
      margin: "8px",
      borderRadius: "50%",
      border: `6px solid ${theme.palette.primary.main}`,
      borderColor: `${theme.palette.primary.main} transparent ${theme.palette.primary.main} transparent`,
      animation: "$spinner 1.2s linear infinite"
    }
  }
}));

export default function LoadingSpinner(props) {
  const classes = useStyles();
  return <div className={classes.root}></div>;
}
