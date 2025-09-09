using Cabo.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabo.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminMessagesController : Controller
    {
        private readonly AppDbContext _context;

        public AdminMessagesController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var messages = await _context.ContactForms.OrderByDescending(m => m.Id).ToListAsync();
            return View(messages);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var message = await _context.ContactForms.FindAsync(id);
            if (message != null)
            {
                _context.ContactForms.Remove(message);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction("Index");
        }
    }
}
