import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";
import api from "../../config/api";

export const StoreStateContext = React.createContext();
export const StoreDispatchContext = React.createContext();

const dollarRateMachine = Machine(
    {
        id: "dollarRateMachine",
        initial: "fetchingDollarRate",
        context: {
            dollarRate: "",
        },
        states: {
            fetchingDollarRate: {
                invoke: {
                    src: (_ctx, evt) =>
                        new Promise(async (resolve, reject) => {
                            try {
                                const data = await api.get("api/tasa-dolar/actual");
                                const body = await data;
                                if (data.status === 200) {
                                    resolve(body.data);
                                } else {
                                    reject(body);
                                }
                            } catch (e) {
                                reject(e.message);
                            }
                        }),
                    onDone: { target: "dataReady", actions: "setDollarRate" },
                    onError: { target: "error", actions: "setResponseMsg" },
                },
            },
            dataReady: {},
            error: {},
        },
    },
    {
        actions: {
            setDollarRate: assign({
                dollarRate: (_ctx, evt) => evt.data.data,
            }),
            setResponseMsg: assign({
                responseMsg: (_ctx, evt) => {
                    return evt.data.message;
                },
            }),
            clearResponseMsg: assign({
                responseMsg: "",
            }),
        },
    }
);


export const StoreStateContextProvider = ({ children }) => {
    //const [current, send] = useMachine(dollarRateMachine);
    const [dollarRateCurrent, dollarRateSend] = useMachine(dollarRateMachine);

    return (
        <StoreStateContext.Provider value={{ dollarRate: dollarRateCurrent }}>
            <StoreDispatchContext.Provider value={{ dollarRate: dollarRateSend }}>
                {children}
            </StoreDispatchContext.Provider>
        </StoreStateContext.Provider>
    );
};
