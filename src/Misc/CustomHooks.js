import { useCallback, useState, useEffect } from "react";
import { database } from "./firebase";

export function useOpen(defaultVal = false) {          // Hook to manage opening and closing dashboards
    const [isOpen, setIsOpen] = useState(defaultVal);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return {isOpen, open, close};

}

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(
      () => window.matchMedia(query).matches
    );
  
    useEffect(() => {
      const queryList = window.matchMedia(query);
      setMatches(queryList.matches);
  
      const listener = evt => setMatches(evt.matches);
  
      queryList.addListener(listener);
      return () => queryList.removeListener(listener);
    }, [query]);
  
    return matches;
  };

  // getting user presence in chat window
  export function useUserPresence(uid) {

    const [presence, setPresence] = useState(null);

    useEffect(() => {
      const userStatusRef = database.ref(`/status/${uid}`);

      userStatusRef.on('value', (snapshot) => {

        //exists() returns true if this DataSnapshot contains any data. It is slightly more efficient than using snapshot.val() !== null.
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPresence(data);
        }
      });

      return () => {
        userStatusRef.off();
      }

    }, [uid]);

    return presence;
    
  } 
  