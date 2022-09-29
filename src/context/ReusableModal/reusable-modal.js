import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

export const ReusableModalStateContext = React.createContext();
export const ReusableModalDispatchContext = React.createContext();

const reusableModalMachine = Machine(
  {
    id: "reusableModal",
    initial: "closedModal",
    context: {
      modalProps: {},
      component: null,
      modalOptions: {},
    },
    states: {
      closedModal: {
        on: {
          OPENMODAL: {
            target: "openedModal",
            actions: "openModal",
          },
        },
      },
      openedModal: {
        on: {
          CLOSEMODAL: {
            target: "closedModal",
          },
          UPDATEPROPS: { actions: "updateProps" },
        },
      },
    },
  },
  {
    actions: {
      openModal: assign({
        modalProps: (_ctx, evt) => evt.modalProps,
        component: (_ctx, evt) => evt.component,
        modalOptions: (_ctx, evt) => evt.modalOptions ? (evt.modalOptions) : {},
        customModal: (_ctx, evt) => evt.customModal
      }),
      updateProps: assign({
        modalProps: (_ctx, evt) => {
          return { ..._ctx.modalProps, ...evt.modalProps }
        },
      }),
    },
  }
);

export const ReusableModalContextProvider = ({ children }) => {
  const [current, send] = useMachine(reusableModalMachine);
  return (
    <ReusableModalStateContext.Provider value={current}>
      <ReusableModalDispatchContext.Provider value={send}>
        {children}
      </ReusableModalDispatchContext.Provider>
    </ReusableModalStateContext.Provider>
  );
};
