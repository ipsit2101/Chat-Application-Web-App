import React, { createContext, useContext, useEffect, useState } from "react";
import { database } from "../Misc/firebase";
import { TransformToArray } from "../Misc/Helpers";

const RoomsContext = createContext();

export const RoomsProvider = ( {children} ) => {
    const [rooms, setRooms] = useState(null);

    useEffect(() => {
        const roomListRef = database.ref('rooms');
        roomListRef.on('value', (snapshot) => {
            const roomData = TransformToArray(snapshot.val());
            setRooms(roomData);
        })

        return () => {
            roomListRef.off();
        }
    }, [])

    return (
        <RoomsContext.Provider value = {rooms}>
            {children}
        </RoomsContext.Provider>
    )
}

//(alias) useContext<any>(context: React.Context<any>): any
//import useContext
//Accepts a context object (the value returned from React.createContext) and returns the current context value, as given by the nearest context provider for the given context.
export const useRooms = () => useContext(RoomsContext);