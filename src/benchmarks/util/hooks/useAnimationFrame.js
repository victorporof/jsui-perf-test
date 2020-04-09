import { useEffect } from "react";

export const useAnimationFrame = (callback) => {
  useEffect(() => {
    let id = null;
    const animate = () => {
      callback();
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [callback]);
};
