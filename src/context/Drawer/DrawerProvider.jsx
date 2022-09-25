import React, {useReducer} from 'react';
import DrawerContext from './DrawerContext'

const initialState = {
    isOpen: false,
    drawerComponent: null,
    data: null,
    machine: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'OPEN_DRAWER':
            return {
                ...state,
                isOpen: true,
                drawerComponent: action.drawerComponent,
                data: action.data,
                machine: null,
            };
        case 'CLOSE_DRAWER':
            return {
                ...state,
                isOpen: false,
                drawerComponent: null,
                data: null,
                machine: null,
            };
        default:
            return state;
    }
}
const DrawerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return(
        <DrawerContext.Provider value={[state, dispatch]}>
            {children}
        </DrawerContext.Provider>
    );
}

export default DrawerProvider;