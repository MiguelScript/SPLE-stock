import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import {
  ReusableModalStateContext,
  ReusableModalDispatchContext,
} from "../../context/ReusableModal/reusable-modal";
import { useTheme } from "@material-ui/core";
import { md } from "../../theme/breakpoints";

export const CustomModal = styled(Modal)`
//z-index:1000;
.modal-dialog{
  max-width:fit-content;
  .modal-content{
    border:none;
  }
}
${(props) => props.theme.breakpoints.down(md)} {
  .modal-dialog{
    overflow-y:auto;
    margin:0;
    .modal-content{
      min-height:100vh;
      border-radius:inherit;
    }
  }
}
`;


const ModalS = styled(Modal)`
  .modal-dialog {
    max-width: fit-content;
    .modal-content {
      border: none;
    }
  }
  ${(props) => props.theme.breakpoints.down(md)} {
    .modal-dialog {
      overflow-y: auto;
    }
  }
`;



function ReusableModal() {

  const reusableModalState = React.useContext(ReusableModalStateContext);
  const reusableModalDispatch = React.useContext(ReusableModalDispatchContext);

  const handleClose = () => {
    reusableModalDispatch({ type: "CLOSEMODAL" });
  };


  useEffect(() => {
    if (reusableModalState.matches("openedModal")) {
      // console.log("modal abierto");

    } else {
    }
  }, [reusableModalState])

  const theme = useTheme();

  return (
    <>
      {!reusableModalState.context.customModal ? (
        <ModalS
          show={reusableModalState.matches("openedModal")}
          onHide={handleClose}
          theme={theme}
          {...reusableModalState.context.modalOptions}
        >
          {reusableModalState.context.component && (
            <reusableModalState.context.component
              {...reusableModalState.context.modalProps}
              closeModal={handleClose}
            >

            </reusableModalState.context.component>)}
          {/* {reusableModalState.context.component &&
            React.createElement(reusableModalState.context.component, {
              ...reusableModalState.context.modalProps,
              closeModal: handleClose,
            })} */}
        </ModalS>
      ) : (
        <customModal
          show={reusableModalState.matches("openedModal")}
          onHide={handleClose}
          theme={theme}
          {...reusableModalState.context.modalOptions}
        >
          {reusableModalState.context.component && (
            <reusableModalState.context.component
              {...reusableModalState.context.modalProps}
              closeModal={handleClose}
            >

            </reusableModalState.context.component>
          )}
        </customModal>
        //     React.createElement(reusableModalState.context.customModal, {
        //     children: reusableModalState.context.component &&
        //   React.createElement(reusableModalState.context.component, {
        //     ...reusableModalState.context.modalProps,
        //     closeModal: handleClose,
        //     }),
        //   show: reusableModalState.matches("openedModal"),
        //   onHide: handleClose,
        //   theme: theme,
        //   ...reusableModalState.context.modalOptions
        // })
      )
      }
    </>
  );
}

export default ReusableModal;
