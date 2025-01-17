import { IWalletEntry } from "@model/WalletEntry";
import { Button, ListItem } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface WalletEntryProp {
	walletEntry: IWalletEntry;
	onSellClick: Function
}

export function WalletEntry({ walletEntry, onSellClick }: WalletEntryProp) {

    const { t } = useTranslation();

	return (
		<ListItem>
			<p className="text-center w-1/6 ml-3">{walletEntry.name}</p>
			<p className="text-center w-1/6 ml-3">{walletEntry.amount}</p>
			<p className="text-center w-1/6 ml-3">{t("number:currency", {value: walletEntry.price})}</p>
			<p className="text-center w-1/6 ml-3">{t("number:currency", {value: walletEntry.amount * walletEntry.price})}</p>
			<div className="ml-10">
				<Button
					variant="contained"
					onClick={(evt) => {
						evt.preventDefault();
						evt.stopPropagation();
						onSellClick();
					}}
				>
					Scambia
				</Button>
			</div>
		</ListItem>
	);
}
