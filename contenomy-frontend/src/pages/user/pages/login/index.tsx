import {
	Box,
	Button,
	Divider,
	IconButton,
	InputAdornment,
	Link as MUILink,
	TextField,
	Typography,
} from "@mui/material";
import ExternalLogins from "./ExternalLogins";
import { FormEvent, useState } from "react";
import AuthService from "@service/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UserLayout from "../../layout";

export default function Login() {
	const [showPassword, setShowPassword] = useState(false);



	async function submitLogin(event: FormEvent) {
		event.preventDefault();
	
		var fd = new FormData(event.target as HTMLFormElement);
	
		if (await AuthService.instance.login(fd)) {
			window.location.href = '/';
		}
	}


	function togglePasswordVisibility() {
		setShowPassword(!showPassword);
	}

	return (
		<UserLayout>
			<Box className="w-full mr-8 ml-16">
				<Typography className="text-center" variant="h6" alignSelf="center">
					Accedi
				</Typography>
				<br />
				<form onSubmit={submitLogin}>
					<Box className="w-full">
						<TextField
							id="username"
							label="Username"
							name="username"
							placeholder="Username..."
							variant="outlined"
						/>
						<br />
						<br />
						<TextField
							id="password"
							label="Password"
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="Password..."
							variant="outlined"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={togglePasswordVisibility}
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								),
							}}
						></TextField>
						<br />
						<br />
						<Button variant="contained" type="submit">
							Accedi
						</Button>
					</Box>
				</form>
				<br />
				<Divider className="w-full">or</Divider>
				<br />
				<Box className="w-full">
					<ExternalLogins />
				</Box>
				<br />
				<br />
				<br />
				<Typography textAlign="center">
					<MUILink href="/recover-password">
						Password dimenticata? Recuperala!
					</MUILink>
				</Typography>
				<Typography textAlign="center">
					<MUILink href="/register">Non hai un account? Crealo subito!</MUILink>
				</Typography>
			</Box>
		</UserLayout>
	);
}
