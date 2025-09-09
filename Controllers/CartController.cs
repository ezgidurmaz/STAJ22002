using Cabo.Data;
using Cabo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Cabo.Controllers
{
    public class CartController : Controller
    {
        private readonly AppDbContext _context;
        private const string CartSessionKey = "Cart";

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        private void UpdateCartCount()
        {
            var cartSession = HttpContext.Session.GetString(CartSessionKey);
            var cart = string.IsNullOrEmpty(cartSession)
                ? new List<CartItemModel>()
                : JsonSerializer.Deserialize<List<CartItemModel>>(cartSession)!;

            ViewBag.CartCount = cart.Sum(c => c.Quantity);
        }

        public IActionResult Index()
        {
            UpdateCartCount();
            var cartSession = HttpContext.Session.GetString(CartSessionKey);
            var cart = string.IsNullOrEmpty(cartSession)
                ? new List<CartItemModel>()
                : JsonSerializer.Deserialize<List<CartItemModel>>(cartSession)!;

            return View(cart);
        }

        [HttpPost]
        public IActionResult AddToCart(int productId, int quantity = 1)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null) return NotFound();

            var cartSession = HttpContext.Session.GetString(CartSessionKey);
            var cart = string.IsNullOrEmpty(cartSession)
                ? new List<CartItemModel>()
                : JsonSerializer.Deserialize<List<CartItemModel>>(cartSession)!;

            var existingItem = cart.FirstOrDefault(c => c.ProductId == productId);
            if (existingItem != null)
                existingItem.Quantity += quantity;
            else
                cart.Add(new CartItemModel
                {
                    ProductId = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = quantity,
                    ImageUrl = product.ImageUrl
                });

            HttpContext.Session.SetString(CartSessionKey, JsonSerializer.Serialize(cart));
            TempData["Success"] = "Ürün sepete eklendi!";
            UpdateCartCount();

            return RedirectToAction("Index", "Products");
        }

        public IActionResult RemoveFromCart(int productId)
        {
            var cartSession = HttpContext.Session.GetString(CartSessionKey);
            if (string.IsNullOrEmpty(cartSession)) return RedirectToAction("Index");

            var cart = JsonSerializer.Deserialize<List<CartItemModel>>(cartSession)!;
            var item = cart.FirstOrDefault(c => c.ProductId == productId);
            if (item != null) cart.Remove(item);

            HttpContext.Session.SetString(CartSessionKey, JsonSerializer.Serialize(cart));
            UpdateCartCount();
            return RedirectToAction("Index");
        }

        public IActionResult ClearCart()
        {
            HttpContext.Session.Remove(CartSessionKey);
            UpdateCartCount();
            return RedirectToAction("Index");
        }

        // 🟢 Checkout yönlendirme action'ı (CartController'dan OrderController'a)
        [HttpGet]
        public IActionResult Checkout()
        {
            return RedirectToAction("Checkout", "Order");
        }
    }
}
