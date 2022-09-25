import React, { useState, useEffect, Fragment } from "react";
import { Typography, makeStyles, Button } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  siguiente: {
    marginLeft: "0.5rem",
  },
  anterior: {
    marginRight: "0.5rem",
  },
  pageNumber: {
    margin: "0 0.25rem",
    padding: "0.5rem 0.5rem",
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&.actualPage": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
    },
  },
}));
export default function Paginador({
  limit,
  total,
  actualPage,
  prevPage,
  nextPage,
  onClickPageNumber,
  className,
  sendParent,
  hasPageNumbers = true,
}) {
  const classes = useStyles();
  const [state, setState] = useState({
    paginas: Math.ceil(Number(total) / limit),
  });

  useEffect(() => {
    setState({ paginas: Math.ceil(Number(total) / limit) });
    console.log(Math.ceil(Number(total) / limit));
  }, [total]);

  return (
    <Fragment>
      <div className={`d-flex w-100 ${className}`}>
        {state.paginas == 1 || state.paginas == 0 ? (
          ""
        ) : (
          <Fragment>
            <Button
              className={`${classes.anterior} anterior ${
                actualPage > 1 ? "" : "disabled"
              }`}
              onClick={() => {
                sendParent({ type: "PREVPAGE" });
              }}
              disabled={actualPage > 1 ? false : true}
            >
              Anterior
            </Button>
            {hasPageNumbers && (
              <div className="d-flex align-items-center justify-content-center">
                {[...Array(state.paginas)].map((e, index) => (
                  <Button
                    key={index}
                    className={`${classes.pageNumber} ${
                      index + 1 == actualPage ? "actualPage" : ""
                    } page-number`}
                    onClick={() => {
                      {
                        /* onClickPageNumber(index + 1); */
                      }
                      sendParent({ type: "CLICKPAGE", data: index + 1 });
                    }}
                  >
                    <Typography>{index + 1}</Typography>
                  </Button>
                ))}
              </div>
            )}

            <Button
              className={`${classes.siguiente} siguiente ${
                actualPage !== state.paginas ? "" : "disabled"
              }`}
              onClick={() => {
                sendParent({ type: "NEXTPAGE" });
              }}
              disabled={actualPage !== state.paginas ? false : true}
            >
              Siguiente
            </Button>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
