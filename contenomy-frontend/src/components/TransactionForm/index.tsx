import { TransactionType } from "@model/Enums";
import { ActionTransaction } from "@model/TransactionData";
import { Button, FormControl, TextField, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface TransactionFormProps {
	operation: TransactionType;
	action: {
        name: string,
        id: number
    },
	onSubmit: (data: ActionTransaction) => void
}

function wrapSubmit(submitHandler: (data: ActionTransaction) => void): SubmitHandler<ActionTransaction> {
	return (data: ActionTransaction) =>
		{
			console.log(data);
			submitHandler(data);
		};
};

export function TransactionForm({ operation, action, onSubmit }: TransactionFormProps) {

	let { register, handleSubmit, control } = useForm<ActionTransaction>({
		defaultValues: {
			operation,
			actionId: action?.id,
			amount: 1,
		},
	});

	const { t } = useTranslation();

	return (
		<>
			<form onSubmit={handleSubmit(wrapSubmit(onSubmit))}>
				<Typography variant="h5" align="center">
					{action?.name}
				</Typography>
				<br />
				<br />
				<input hidden {...register("operation")} />
				<input hidden {...register("actionId")} />
				<FormControl>
					<Controller
						render={({ field: { name, value, onChange } }) => (
							<TextField
								type="number"
								name={name}
								label={t("amount")}
								value={value}
								onChange={(e) => onChange(+e.target.value)}
							/>
						)}
						control={control}
						name="amount"
                        rules={{
                            required: true
                        }}
					/>
				</FormControl>
				<br />
				<br />
				<FormControl>
					<Controller
						render={({ field: { name, value, onChange } }) => (
							<TextField
								type="number"
								name={name}
								value={value}
								label={t("price")}
								onChange={(e) => onChange(+e.target.value)}
							/>
						)}
						control={control}
						name="price"
					/>
				</FormControl>
				<br />
				<br />
				<FormControl>
					<Button type="submit" variant="contained">
						Piazza ordine
					</Button>
				</FormControl>
			</form>
		</>
	);
}
