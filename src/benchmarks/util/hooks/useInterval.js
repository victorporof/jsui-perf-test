import { useEffect } from "react";

export const useInterval = (callback, ms) => {
  useEffect(() => {
    const id = setInterval(callback, ms);
    return () => clearInterval(id);
  }, [callback, ms]);
};
