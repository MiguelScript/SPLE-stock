import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";
import api from "../../config/api";
export const AuthStateContext = React.createContext();
export const AuthDispatchContext = React.createContext();

const authMachine = Machine(
  {
    id: "authMachine",
    initial: "idle",
    context: {
      userData: {
        
      },
    },
    states: {
      idle: {
        invoke: {
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              let token;
              if (localStorage.token) {
                token = localStorage.token;
              } else if (evt.token) {
                token = evt.token;
                localStorage.setItem("token", token);
              }
              if (token) {
                try {
                  const { data: user } = await api.get("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (user) {
                    resolve(user);
                  } else {
                    reject("Error");
                  }
                } catch (e) {
                  reject(
                    "¡Ha ocurrido un error! Verifica tu conexión a internet."
                  );
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: {
            target: "LoggedIn",
            actions: "setUserData",
          },
          onError: { target: "LoggedOut", actions: "clearUserData" },
        },
      },
      LoggedOut: {
        on: {
          LOGIN: {
            target: "idle",
          },
        },
      },
      LoggedIn: {
        on: {
          LOGOUT: {
            target: "LoggedOut",
            actions: "clearUserData",
          },
          REFRESHUSERDATA: {
            actions: "setUserData",
          },
        },
      },
      error: {},
    },
  },
  {
    actions: {
      setUserData: assign({
        userData: (_ctx, evt) => evt.data,
      }),
      clearUserData: assign({
        userData: (_ctx, evt) => {
          localStorage.removeItem("token");
          return {
            contacts: null,
            addresses: null,
          };
        },
      }),
    },
  }
);

// export function ProtectRoute(Component) {
//   return () => {
//     const authState = useContext(AuthStateContext);
//     useEffect(() => {
//       if (authState.matches("LoggedOut")) Router.push("/");
//     }, [authState]);

//     return <Component {...arguments} />;
//   };
// }

export const AuthMachineContextProvider = ({ children }) => {
  const [current, send] = useMachine(authMachine);
  return (
    <AuthStateContext.Provider value={current}>
      <AuthDispatchContext.Provider value={send}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
