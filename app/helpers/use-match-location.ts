import { useLocation } from "@remix-run/react";
import { useCallback } from "react";

export default function useMatchLocation() {
  const location = useLocation();

  return useCallback(
    (path: string) => Boolean(location.pathname.match(`^${path}(/*)?$`)),
    [location.pathname]
  );
}
