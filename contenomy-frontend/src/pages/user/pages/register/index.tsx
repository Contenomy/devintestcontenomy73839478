import React, { useState } from 'react';
import {
	Box,
	Button,
	Divider,
	TextField,
	Typography,
	Link as MUILink,
	Alert
} from "@mui/material";
import ExternalLogins from "../login/ExternalLogins";
import UserLayout from "../../layout";

export default function Register() {
	// Stati per i campi di input
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		passwordConfirm: '',
		nickname:'',
		phonenumber:''
	});

	const [errors, setErrors] = useState([]);
	

	// Gestione del cambio di stato per gli input
	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value
		}));
	};
	


	// Funzione per inviare i dati all'API
	const handleRegister = async (event) => {
		event.preventDefault();
		setErrors([]); 
		if (formData.password !== formData.passwordConfirm) {
			alert("Le password non coincidono");
			return;
		}

		try {
			const response = await fetch('https://localhost:7126/api/Account/CreateUser', { 
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
                const data = await response.json();
                // Mappa gli errori in un array di stringhe
                const extractedErrors = Object.values(data).flat();
                setErrors(extractedErrors); 
                return; 
            }

            
            // Naviga alla pagina delle impostazioni
            window.location.href = '/login';
		} catch (error) {
			console.error("Errore durante la registrazione:", error);
			setErrors(["Errore nella connessione al server"]);
		}
	
	};

	return (
		<UserLayout>
			<Box className="w-full mr-8 ml-16">
				<Typography className="text-center" variant="h6" alignSelf="center">
					Registrati
				</Typography>
				<br />
				<form onSubmit={handleRegister}>
					<Box className="w-full">
						<TextField
							id="username"
							label="Username"
							name="username"
							placeholder="Username..."
							variant="outlined"
							value={formData.username}
							onChange={handleChange}
						/>
						<br />
						<br />
						<TextField
							id="email"
							label="Email"
							name="email"
							placeholder="Email"
							variant="outlined"
							value={formData.email}
							onChange={handleChange}
						/>
						<br />
						<br />
						<TextField
							id="password"
							label="Password"
							name="password"
							type="password"
							placeholder="Password..."
							variant="outlined"
							value={formData.password}
							onChange={handleChange}
						/>
						<br />
						<br />
						<TextField
							id="passwordConfirm"
							label="Conferma password"
							name="passwordConfirm"
							type="password"
							variant="outlined"
							value={formData.passwordConfirm}
							onChange={handleChange}
						/>
						<br />
						<br />
						{/* Mostra gli errori */}
						{errors.length > 0 && (
							<Box mt={2}>
								{errors.map((error, index) => (
									<React.Fragment key={index}>
										<Alert severity="error">{error}</Alert>
										<br />
									</React.Fragment>
								))}
							</Box>
						)}
						<Button type="submit" variant="contained">Registrati</Button>
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
					<MUILink href="/login">Hai già un account? Accedi ora!</MUILink>
				</Typography>
			</Box>
		</UserLayout>
	);
}
