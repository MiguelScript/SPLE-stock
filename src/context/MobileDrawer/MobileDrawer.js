import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";
export const MobileDrawerStateContext = React.createContext();
export const MobileDrawerDispatchContext = React.createContext();
const mobileDrawerMachine = Machine(
  {
    id: "mobileDrawer",
    initial: "mobileDrawer",
    context: {
      isOpen: false,
    },
    states: {
        mobileDrawer: {
        on: {
          OPENDRAWER: { actions: "openDrawer" },
          CLOSEDRAWER: { actions: "closeDrawer" },
        },
      },
    },
  },
  {
    actions: {
      openDrawer: assign({
        isOpen: (_ctx, evt) => true,
      }),
      closeDrawer: assign({
        isOpen: (_ctx, evt) => false,
      }),
    },
  }
);
export const MobileDrawerContextProvider = ({ children }) => {
  const [current, send] = useMachine(mobileDrawerMachine);
  return (
    <MobileDrawerStateContext.Provider value={current}>
      <MobileDrawerDispatchContext.Provider value={send}>
        {children}
      </MobileDrawerDispatchContext.Provider>
    </MobileDrawerStateContext.Provider>
  );
};
