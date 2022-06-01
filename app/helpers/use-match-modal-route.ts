import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

export default function useMatchModalRoute() {
  const matches = useMatches();

  return useMemo(
    () => matches.some((match) => match.handle?.isModal),
    [matches]
  );
}
