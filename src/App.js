import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import { AuthMachineContextProvider } from "./context/Auth/Auth";
import { StoreStateContextProvider } from "./context/store/store";

function App() {
  return (
    <div className="App">
      <AuthMachineContextProvider>
        <StoreStateContextProvider>
          <Router>
            <Routes />
          </Router>
        </StoreStateContextProvider>
      </AuthMachineContextProvider>
    </div>
  );
}

export default App;
