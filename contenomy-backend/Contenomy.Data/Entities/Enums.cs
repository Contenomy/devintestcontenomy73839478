namespace Contenomy.Data.Enums
{
	public enum TransactionType
	{
		Purchase,
		Sell,

		Deposit,
		Withdraw
	}

	public enum TransactionStatus
	{
		Accepted,
		Processing,
		Completed,
		Error,
		Canceled
	}
}
