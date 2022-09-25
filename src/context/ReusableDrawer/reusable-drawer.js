import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";
export const ReusableDrawerStateContext = React.createContext();
export const ReusableDrawerDispatchContext = React.createContext();
const reusableDrawerMachine = Machine(
  {
    id: "reusableDrawer",
    initial: "closedDrawer",
    context: {
      drawerProps: {},
      component: null,
      drawerOptions: {},
    },
    states: {
      closedDrawer: {
        on: {
          OPENDRAWER: {
            target: "openedDrawer",
            actions: "openDrawer",
          },
        },
      },
      openedDrawer: {
        on: {
          CLOSEDRAWER: {
            target: "closedDrawer",
          },
        },
      },
    },
  },
  {
    actions: {
      openDrawer: assign({
        drawerProps: (_ctx, evt) => evt.drawerProps,
        component: (_ctx, evt) => evt.component,
        drawerOptions: (_ctx, evt) =>
          evt.drawerOptions ? evt.drawerOptions : {},
      }),
    },
  }
);
export const ReusableDrawerContextProvider = ({ children }) => {
  const [current, send] = useMachine(reusableDrawerMachine);
  return (
    <ReusableDrawerStateContext.Provider value={current}>
      <ReusableDrawerDispatchContext.Provider value={send}>
        {children}
      </ReusableDrawerDispatchContext.Provider>
    </ReusableDrawerStateContext.Provider>
  );
};
