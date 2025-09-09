using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Cabo.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Cabo.Controllers
{
    public class AdminUsersController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminUsersController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<IActionResult> Index()
        {
            var users = _userManager.Users.ToList();
            var userList = new List<UserViewModel>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user) ?? new List<string>(); // null olursa boş liste
                userList.Add(new UserViewModel
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Roles = string.Join(", ", roles)
                });
            }

            return View(userList);
        }
    }
}
