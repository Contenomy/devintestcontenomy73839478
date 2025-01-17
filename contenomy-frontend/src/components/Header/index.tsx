import { Login, PersonAdd, TrendingUp, AccountBalanceWallet, PersonPin } from "@mui/icons-material";
import "./Header.css";
import NavLink from "@components/NavLink";
import Guard from "@components/Guard";
import { Divider, Link } from "@mui/material";
import UserMenu from "./UserMenu";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="contenomy-header">
      <Link href="/">
        <img
          className="h-full ml-2 align-middle"
          src="/logo.svg"
          alt="contenomy"
          width={200}
          height={40}
        />
      </Link>
      <div className="flex ml-5">
        {/* <Guard> */}
          <NavLink href="/market">
            Mercato
          </NavLink>
          <RouterLink to="/#how-it-works" className="NavLink">
            Come Funziona
          </RouterLink>
          <NavLink href="/creator-info">
            Sono un Creator
          </NavLink>
          {/* <NavLink icon={<AccountBalanceWallet />} href="/wallet">
            Portafoglio
          </NavLink> */}
        {/* </Guard> */}
      </div>
      <div className="flex ml-auto mr-0">
        <Guard>
          <UserMenu />
        </Guard>
        <Guard authenticated={false}>
          <NavLink icon={<Login />} href="/login">
            Login
          </NavLink>
          <Divider orientation="vertical" />
          <NavLink icon={<PersonAdd />} href="/register">
            {t("register")}
          </NavLink>
        </Guard>
      </div>
    </header>
  );
}