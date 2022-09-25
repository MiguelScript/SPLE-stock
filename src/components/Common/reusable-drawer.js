import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import {
  ReusableDrawerStateContext,
  ReusableDrawerDispatchContext,
} from "../../context/ReusableDrawer/reusable-drawer";
import { useTheme, Typography } from "@material-ui/core";
import { md } from "../../theme/breakpoints";

const DrawerS = styled(Modal)`
  //   z-index: 10000;
  display: flex !important;
  justify-content: flex-end;
  &:not(.show) {
    .modal-dialog {
      -webkit-transform: translate3d(100%, 0, 0) !important;
      transform: translate3d(100%, 0, 0) !important;
      transition: all 0.5s ease-out;
    }
  }

  .modal-dialog {
    margin: 0;
    max-width: fit-content;
    transition: all 0.5s ease-out;
    -webkit-transform: translate3d(0%, 0, 0) !important;
    transform: translate3d(0%, 0, 0) !important;
    .modal-content {
      min-height: 100vh;
      border: none;
      border-radius: inherit;
      width: 768px;
    }
  }
  ${(props) => props.theme.breakpoints.down(md)} {
    .modal-dialog {
      overflow-y: auto;
      .modal-content {
        width: 100vw;
      }
    }
  }
`;

const DrawerHeader = styled.header`
  height: 70px;
  background-color: ${(props) => props.theme.palette.primary.main};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  h6 {
    color: white;
    font-weight: 400;
  }
`;

const DrawerContent = styled.section`
padding:0rem 2rem;
 >div{
    min-height: calc(100vh - 70px - 1rem);
    >form.form-row{
        min-height: calc(100vh - 70px - 1rem);
        align-items:start;
        flex-direction:column;
    }
  }
`;

export const ActionBtnsContainer = styled.div`
  width: 100%;
  flex: 1;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 60px;
`;

function ReusableDrawer() {
  const reusableDrawerState = React.useContext(ReusableDrawerStateContext);
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );
  const handleClose = () => {
    reusableDrawerDispatch({ type: "CLOSEDRAWER" });
  };
  const theme = useTheme();
  return (
    <>
      <DrawerS
        show={reusableDrawerState.matches("openedDrawer")}
        onHide={handleClose}
        theme={theme}
        {...reusableDrawerState.context.drawerOptions}
      >
        <>
          {reusableDrawerState.context.drawerProps.layout && (
            <DrawerHeader theme={theme}>
              <Typography variant="h6">
                {reusableDrawerState.context.drawerProps.layout.title}
              </Typography>
            </DrawerHeader>
          )}
          <DrawerContent>
            {reusableDrawerState.context.component &&
              React.createElement(reusableDrawerState.context.component, {
                ...reusableDrawerState.context.drawerProps,
                closeDrawer: handleClose,
              })}
          </DrawerContent>
        </>
      </DrawerS>
    </>
  );
}

export default ReusableDrawer;
