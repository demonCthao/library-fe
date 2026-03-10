import { useEffect } from "react";

export function useClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    callback: () => void
) {
    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }

            callback();
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [ref, callback]);
}