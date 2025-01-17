import { Link } from "react-router-dom";
import "./NavLink.css";
import { Button } from "@mui/material";

export interface NavLinkProps {
    children: React.ReactNode | string,
    href: string,
    icon?: React.ReactNode,
}

export default function NavLink({
    children,
    href,
    icon,
    ...props
}: NavLinkProps & React.HTMLProps<HTMLElement>) {

    return (
        <Link to={{ pathname: href }} className={`NavLink ${props.className}`}>
            <Button startIcon={icon} variant="text" className="NavLink">
                {children}
            </Button>
        </Link>
    );
}
