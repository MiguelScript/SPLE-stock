import React, { useState, useCallback } from "react";
import { Typography, makeStyles, Button } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { isEmpty } from "lodash";
const useStyles = makeStyles(theme => ({
  baseStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: theme.palette.primary.main,
    borderStyle: "dashed",
    backgroundColor: "#fff",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      borderColor: theme.palette.secondary.main
    }
  },
  activeStyle: {
    borderColor: "#2196f3"
  },
  acceptStyle: {
    borderColor: "#00e676"
  },
  rejectStyle: {
    borderColor: "#ff1744"
  },
  imagePreview: {
    width: "200px",
    height: "200px"
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "200px",
    height: "200px"
  },
  "@keyframes stripes": {
    "0%": {
      transform: "translateX(0px)"
    },
    "100%": {
      transform: "translateX(46px)"
    }
  },
  progressBarContainer: {},
  progressBar: {
    border: "1px solid #3DE566",
    width: "200px",
    height: "25px",
    borderRadius: "12.5px",
    overflow: "hidden",
    "& > div": {
      width: props => props.progress,
      height: "25px",
      position: "relative",
      borderRadius: "12.5px",
      overflow: "hidden",
      "& > div": {
        animation: "$stripes 0.6s linear infinite",
        background:
          "repeating-linear-gradient(-55deg,#f8e9db 1px,#fff5ed 2px,#fff5ed 11px,#f8e9db 12px,#f8e9db 20px)",
        height: "25px",
        position: "absolute",
        top: "0px",
        left: "-46px",
        right: "0px",
        bottom: "0px",
        borderRadius: "12.5px"
      }
    }
  },
  uploadedBtnsContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "200px",
    padding: "0rem 0.5rem",
    "& > div": {
      backgroundColor: "#32c671",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "30px",
      height: "30px",
      borderRadius: "15px",
      color: "#fff",
      "& i": {
        fontSize: "1.3rem"
      }
    }
  },
  btnEliminar: {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error.light,
    "&:hover": {
      backgroundColor: theme.palette.error.main,
      color: "#fff"
    }
  }
}));

function DropZone({
  //required,
  className,
  placeholderText,
  dispatch,
  uploadedFile,
  editImage,
  field

}) {

  const [state, setState] = useState({
    acceptedFile: false,
    rejectedFile: false,
    file: "",
    fileUploaded: "",
    fileProgress: "0%"
  });

  const onDrop = useCallback(async file => {
    if (!isEmpty(file)) {
      const img = file[0];

      Object.assign(img, {
        preview: URL.createObjectURL(img)
      });
      setState(prev => ({ ...prev, file: img }));
      dispatch({type:'SETDATA',name:field,value:img});
    }
  });

  const onDropAccepted = useCallback(() => {
    if (state.rejectedFile) {
      setState(prev => ({ ...prev, acceptedFile: true, rejectedFile: false }));
    } else {
      setState(prev => ({ ...prev, acceptedFile: true }));
    }
  });
  const onDropRejected = useCallback(() => {
    if (state.acceptedFile) {
      setState(prev => ({ ...prev, acceptedFile: false, rejectedFile: true }));
    } else {
      setState(prev => ({ ...prev, rejectedFile: true }));
    }
  });

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/*",
    onDrop,
    onDropAccepted,
    onDropRejected
  });
  const classes = useStyles({ progress: state.fileProgress });
  

  return (
    <div
      {...getRootProps({
        className: `dropzone ${classes.baseStyle}  ${className}
      ${isDragActive ? classes.activeStyle : ""}
      ${isDragAccept || state.acceptedFile ? classes.acceptStyle : ""}
      ${
        isDragReject || state.rejectedFile /* || required */
          ? classes.rejectStyle
          : ""
      }
      `
      })}
    >
      <input {...getInputProps()} />
      <Typography variant="subtitle2">
        {placeholderText
          ? placeholderText
          : "Arrastra y suelta la imagen, o haz click para seleccionarlo."}
      </Typography>
      <div className={classes.imageContainer}>
        {editImage && !state.file ? (
          <img
            src={`${process.env.REACT_APP_BACKEND_URL_IMG_PRODUCTOS}/${editImage}`}
            className={`mt-3 ${classes.imagePreview}`}
          />
        ) : !uploadedFile ? (
          state.file ? (
            <img
              src={state.file.preview}
              className={`mt-3 ${classes.imagePreview}`}
            />
          ) : (
            ""
          )
        ) : (
          <img
            src={`/uploads/${uploadedFile}`}
            className={`mt-3 ${classes.imagePreview}`}
          />
        )}
        
      </div>
    </div>
  );
}


export default DropZone;
