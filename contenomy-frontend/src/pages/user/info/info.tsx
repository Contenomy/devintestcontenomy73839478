import { Box, Divider, Typography } from "@mui/material";
import { AccountBalance, Diversity3, Lock } from "@mui/icons-material";

import './info.css'

export default function Info() {
	return (
		<div className="flex flex-col justify-center align-center w-100">
			<Typography fontWeight="bold">
				Contenomy Personal Value è la prima piattaforma dove guadagni sostenendo
				i tuoi creator preferiti!
			</Typography>
			<br />
			<br />
			<br />
			<Box className="flex">
				<AccountBalance className="p-3" fontSize="large" />
                <Divider orientation="vertical" />
                <p className="pl-3">
                    I tuoi fondi sono al sicuro e sempre disponibili!
                </p>
			</Box>
			<br />
			<Box className="flex">
				<Lock className="p-3" fontSize="large" />
                <Divider orientation="vertical" />
                <p className="pl-3">
                    I tuoi dati non verranno diffusi diffusi!
                </p>
			</Box>
			<br />
			<Box className="flex">
				<Diversity3 className="p-3" fontSize="large" />
                <Divider orientation="vertical" />
                <p className="pl-3">
                    Investi sulla prima piattaforma che crede nelle persone!
                </p>
			</Box>
		</div>
	);
}
