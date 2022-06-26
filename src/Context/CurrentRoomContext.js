import React from "react";
import { createContext, useContextSelector } from "use-context-selector";

const CurrentRoomContext = createContext(); // This creates a special context for useContextSelector.

export const CurrentRoomProvider = ( {children, data} ) => {

    return (
        <CurrentRoomContext.Provider value = {data} >
            {children}
        </CurrentRoomContext.Provider>
    )
}

// This hook returns context selected value by selector.
// It will only accept context created by createContext. It will trigger re-render if only the selected value is referentially changed.
// The selector should return referentially equal result for same input for better performance.
export const useCurrentRoom = (selector) => useContextSelector(CurrentRoomContext, selector); 