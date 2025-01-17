import { LoginProvider } from "@environment/external-providers/external-providers.environment.development";
import { Box, Divider, Typography } from "@mui/material";

export default function ExternalLoginBadge({
	provider,
}: {
	provider: LoginProvider;
}) {
	return (
		<Box className="flex border-solid border-gray-400 border rounded cursor-pointer">
			<img
				width={50}
				height={50}
				alt="google"
				src="/external-logins/google.svg"
			/>
            <Divider orientation="vertical" flexItem/>
            <Typography className="pl-5" alignSelf="center" fontSize={18}>
                Login con {provider.name}
            </Typography>
		</Box>
	);
}
