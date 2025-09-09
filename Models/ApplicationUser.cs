using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Cabo.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required, StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(20)]
        public string? City { get; set; }
    }
}
