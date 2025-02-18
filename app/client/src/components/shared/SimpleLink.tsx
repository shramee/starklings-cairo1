import { Link } from "@mui/material";
import { ReactNode } from "react";

interface ISimpleLink {
  href: string;
  children: ReactNode;
}
export const SimpleLink = ({ href, children }: ISimpleLink) => {
  return (
    <Link
      href={href}
      sx={{ textDecoration: "none" }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};
