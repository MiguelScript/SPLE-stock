import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  "@keyframes ellipsis": {
    "0%": {
      width: "10px",
      height: "10px",
      opacity: 0.9,
      transform: "translateY(0)"
    },
    "100%": {
      width: "10px",
      height: "10px",
      opacity: "0.1",
      transform: "translateY(-5px)"
    }
  },
  root: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    padding:'0.5rem',
    "& span": {
      display: "inline-block",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      animation: "$ellipsis 0.9s infinite alternate",
      backgroundColor: "#fff"
    },
    "& span:nth-of-type(2)": {
      animationDelay: "0.3s"
    },
    "& span:nth-of-type(3)": {
      animationDelay: "0.6s"
    }
  }
}));

export default function LoadingEllipsis(props) {
  const classes = useStyles();
  return (
    <div
      className={`${classes.root} ${props.className ? props.className : ""}`}
    >
      <span></span><span></span><span></span>
    </div>
  );
}
