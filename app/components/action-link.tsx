import { NavLink } from "@remix-run/react";
import clsx from "clsx";

export default function ActionLink({
  to,
  color,
  children,
}: {
  to: string;
  color: "green" | "red";
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={clsx(
        "flex-1 p-4",
        color === "green" && "bg-green-500",
        color === "red" && "bg-red-500"
      )}
    >
      {children}
    </NavLink>
  );
}
