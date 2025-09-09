using Cabo.Data;
using Cabo.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cabo.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppDbContext _context;

        public HomeController(AppDbContext context)
        {
            _context = context;
        }

        // Anasayfa - Pop�ler �r�nleri g�ster
        public IActionResult Index()
        {
            var popularProducts = _context.Products
                .Where(p => p.IsPopular)   // Pop�ler �r�nler
                .OrderByDescending(p => p.Id)
                .Take(6)                    // Son 6 pop�ler �r�n
                .ToList();

            return View(popularProducts);
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Contact(ContactForm model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            _context.ContactForms.Add(model);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Mesaj�n�z g�nderildi!";
            return RedirectToAction("Contact");
        }
    }
}
