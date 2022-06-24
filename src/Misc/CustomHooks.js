import { useCallback, useState } from "react";

export function useOpen(defaultVal = false) {          // Hook to manage opening and closing dashboards
    const [isOpen, setIsOpen] = useState(defaultVal);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(true), []);

    return {isOpen, open, close};

}