using Cabo.Data;
using Cabo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Cabo.Controllers
{
    public class OrderController : Controller
    {
        private readonly AppDbContext _context;
        private const string CartSessionKey = "Cart";

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // Checkout sayfasını göster
        public IActionResult Checkout()
        {
            var cartSession = HttpContext.Session.GetString(CartSessionKey);
            var cart = string.IsNullOrEmpty(cartSession)
                ? new List<CartItemModel>()
                : JsonSerializer.Deserialize<List<CartItemModel>>(cartSession) ?? new List<CartItemModel>();

            if (!cart.Any())
            {
                TempData["Error"] = "Sepetiniz boş!";
                return RedirectToAction("Index", "Products");
            }

            return View(cart);
        }

        // Siparişi oluştur ve DB'ye kaydet
        [HttpPost]
        public async Task<IActionResult> PlaceOrder(string fullName, string address, string paymentMethod, string? cardNumber, string? expiry, string? cvv)
        {
            var cartSession = HttpContext.Session.GetString(CartSessionKey);
            var cart = string.IsNullOrEmpty(cartSession)
                ? new List<CartItemModel>()
                : JsonSerializer.Deserialize<List<CartItemModel>>(cartSession) ?? new List<CartItemModel>();

            if (!cart.Any())
            {
                TempData["Error"] = "Sepetiniz boş!";
                return RedirectToAction("Index", "Products");
            }

            if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(address) || string.IsNullOrWhiteSpace(paymentMethod))
            {
                TempData["Error"] = "Lütfen tüm zorunlu alanları doldurun!";
                return RedirectToAction("Checkout");
            }

            // Kart seçilmişse bilgiler de zorunlu
            if (paymentMethod == "Kart" && (string.IsNullOrWhiteSpace(cardNumber) || string.IsNullOrWhiteSpace(expiry) || string.IsNullOrWhiteSpace(cvv)))
            {
                TempData["Error"] = "Kart bilgilerini eksiksiz giriniz!";
                return RedirectToAction("Checkout");
            }

            var order = new Order
            {
                UserId = User.Identity?.Name ?? "anonim",
                FullName = fullName,
                Address = address,
                PaymentMethod = paymentMethod,
                CardNumber = cardNumber,
                Expiry = expiry,
                CVV = cvv,
                TotalAmount = cart.Sum(c => c.Price * c.Quantity),
                OrderDate = DateTime.Now
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var item in cart)
            {
                // Stok düşür
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Stock -= item.Quantity;
                    if (product.Stock < 0) product.Stock = 0;

                    _context.Products.Update(product);
                }

                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Name = item.Name,
                    ImageUrl = item.ImageUrl
                };
                _context.OrderItems.Add(orderItem);
            }

            await _context.SaveChangesAsync();

            // Sepeti temizle
            HttpContext.Session.Remove(CartSessionKey);

            TempData["Success"] = "Siparişiniz başarıyla oluşturuldu!";
            return RedirectToAction("Index", "Products");
        }

        // Kullanıcının kendi siparişlerini görmesi
        public async Task<IActionResult> MyOrders()
        {
            var userId = User.Identity?.Name ?? "anonim";

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return View(orders);
        }

        // Admin için tüm siparişler
        public async Task<IActionResult> AllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return View(orders);
        }

        // Tek bir siparişin detayını göster
        public async Task<IActionResult> Details(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }
    }
}
