using Cabo.Data;
using Cabo.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Cabo.Controllers
{
    public class ProductsController : Controller
    {
        private readonly AppDbContext _context;
        private const string CartSessionKey = "Cart";

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // Tüm ürünleri listele
        public async Task<IActionResult> Index()
        {
            var products = await _context.Products.ToListAsync();
            return View(products);
        }

        // Ürün detay sayfası
        public async Task<IActionResult> Details(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
                return NotFound();

            return View(product);
        }

        // Sepete ürün ekle
        [HttpPost]
        public IActionResult AddToCart(int productId, int quantity = 1)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null)
            {
                return NotFound();
            }

            var cartSession = HttpContext.Session.GetString(CartSessionKey);
            var cart = string.IsNullOrEmpty(cartSession)
                ? new List<CartItemModel>()
                : JsonSerializer.Deserialize<List<CartItemModel>>(cartSession)!;

            var existingItem = cart.FirstOrDefault(c => c.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                cart.Add(new CartItemModel
                {
                    ProductId = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = quantity,
                    ImageUrl = product.ImageUrl
                });
            }

            HttpContext.Session.SetString(CartSessionKey, JsonSerializer.Serialize(cart));
            TempData["Success"] = "Ürün sepete eklendi!";

            return RedirectToAction("Index");
        }
    }
}
