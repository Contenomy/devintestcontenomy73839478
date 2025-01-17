using Contenomy.Data;
using Contenomy.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Contenomy.API.Services
{
	public class OrderBookService
	{
		private readonly ContenomyDbContext _context;

		public OrderBookService(ContenomyDbContext context)
		{
			_context = context;
		}

		public async Task<List<Order>> GetAllOrdersByCreatorAssetIdAsync(int creatorAssetId)
		{
			/* TIP: evita ripetizione di codice. Se due punti hanno lo stesso codice, fanne un metodo */
			return await GetPendingOrders()
				.Where(f => f.CreatorAssetId == creatorAssetId)
				.ToListAsync();
		}

		public async Task<List<Order>> GetAllOrdersByCreatorIdAsync(string creatorId)
		{
			return await GetPendingOrders()
				.Where(f => f.CreatorId == creatorId)
				.ToListAsync();
		}

		private IQueryable<Order> GetPendingOrders()
		{
			return _context.Orders
				.Where(o => o.Status == OrderStatus.Pending)
				.OrderBy(o => o.Direction)
				.ThenBy(o => o.Price)
				.ThenBy(o => o.CreatedAt);
		}

		public async Task<Order> PlaceOrderAsync(Order order)
		{
			_context.Orders.Add(order);
			await _context.SaveChangesAsync();
			return order;
		}

		public async Task<bool> CancelOrderAsync(int orderId, string userId)
		{
			var order = await _context.Orders.FindAsync(orderId);
			if (order != null && order.UserId == userId && order.Status == OrderStatus.Pending)
			{
				order.Status = OrderStatus.Cancelled;
				await _context.SaveChangesAsync();
				return true;
			}
			return false;
		}

		/* FACT: Questo metodo è uguale a "GetAllOrdersAsync" (ora "GetAllOrdersByCreatorAssetIdAsync") */
		//public async Task<List<Order>> GetPendingOrdersAsync(int creatorAssetId)
		//{
		//	return await _context.Orders
		//		.Where(o => o.CreatorAssetId == creatorAssetId && o.Status == OrderStatus.Pending)
		//		.OrderBy(o => o.Direction)
		//		.ThenBy(o => o.Price)
		//		.ThenBy(o => o.CreatedAt)
		//		.ToListAsync();
		//}
	}
}

/*
Questo servizio gestisce le operazioni relative al libro ordini nella piattaforma Contenomy.
Fornisce metodi per ottenere il libro ordini di un CreatorAsset, piazzare nuovi ordini,
cancellare ordini esistenti e recuperare ordini pendenti. Utilizza una gestione unificata
degli ordini senza separare gli ordini di acquisto e vendita in classi distinte.
*/
