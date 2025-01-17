import { authContext } from "@context/AuthContext";
import { AccountCircle, LogoutRounded, Wallet, Dashboard, AddCircleOutline, Share, Settings } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import AuthService from "@service/AuthService";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import './UserMenu.css';

export default function UserMenu() {
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);
	const { profile } = useContext(authContext);
	const { t } = useTranslation();
	const open = !!anchor;

	async function logout() {
		await AuthService.instance.logout();
		window.location.href = "/";
	}

	const isCreatorOrDeveloper = profile.roles.includes("Creator") || profile.roles.includes("Developer");
	const isAdminOrDeveloper = profile.roles.includes("Admin") || profile.roles.includes("Developer");

	return (
		<>
			<Button
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				variant="contained"
				onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
					setAnchor(event.currentTarget)
				}
			>
				{profile.name}
			</Button>
			<Menu
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
				open={open}
				anchorEl={anchor}
				onClick={() => setAnchor(null)}
				onClose={() => setAnchor(null)}
			>
				<MenuItem>
					<Link className="profileLink" to="/profile">
						<AccountCircle className="mr-2" />
						{t("profile")}
					</Link>
				</MenuItem>
				{isCreatorOrDeveloper && [
    <MenuItem key="creator-dashboard">
        <Link className="profileLink" to="/creator-dashboard">
            <Dashboard className="mr-2" />
            {t("Pannello di Gestione")}
        </Link>
    </MenuItem>,
    <MenuItem key="new-supportshare">
        <Link className="profileLink" to="/new-supportshare">
            <AddCircleOutline className="mr-2" />
            {t("Nuove SupportShare")}
        </Link>
    </MenuItem>
]}

				<MenuItem>
					<Link className="profileLink" to="/wallet">
						<Wallet className="mr-2" />
						{t("Wallet")}
					</Link>
				</MenuItem>
				<MenuItem>
					<Link className="profileLink" to="/referral">
						<Share className="mr-2" />
						{t("Referral")}
					</Link>
				</MenuItem>
				<MenuItem>
					<Link className="profileLink" to="/settings">
						<Settings className="mr-2" />
						{t("Impostazioni")}
					</Link>
				</MenuItem>
				{isAdminOrDeveloper && (
					<MenuItem>
						<Link className="profileLink" to="/admin-dashboard">
							<Dashboard className="mr-2" />
							{t("Dashboard Amministratore")}
						</Link>
					</MenuItem>
				)}
				<MenuItem onClick={logout}>
					<LogoutRounded className="mr-2" />
					{t("Esci")}
				</MenuItem>
			</Menu>
		</>
	);
}