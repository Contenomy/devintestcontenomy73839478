import { TransactionType } from "./Enums";

export type ActionTransaction = {
    amount: number;
    actionId: number,
    operation: TransactionType,

    price?: number
}