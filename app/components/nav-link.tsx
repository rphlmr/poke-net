import { NavLink as RemixNavLink } from "@remix-run/react";
import clsx from "clsx";
import useMatchLocation from "~/helpers/use-match-location";

export default function NavLink({
  to,
  children,
}: {
  to: string;
  children?: React.ReactNode;
}) {
  const matchLocation = useMatchLocation();

  const isActive = matchLocation(to);

  return (
    <RemixNavLink
      to={to}
      className={clsx(
        isActive ? "bg-gray-100 text-blue-400" : "bg-blue-400 text-gray-100",
        "text-md items-center rounded-sm px-4 py-2 font-medium"
      )}
    >
      {children}
    </RemixNavLink>
  );
}
