import { useEffect, useRef } from "react";

export default function useHandleOutsideClick<T>(onClickOutside: () => void) {
    const refInside = useRef<T | any>(null);
    const refOutside = useRef<T | any>(null);

    useEffect(() => {
      function handleClickOutside(event: any) {
        if (refInside !== null && refOutside !== null) {
            if (!refInside.current.contains(event.target) && refOutside.current.contains(event.target)) {
                console.log("outside");
                onClickOutside();
            }
        }
      }
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refInside, refOutside]);

    return [refInside, refOutside];
}