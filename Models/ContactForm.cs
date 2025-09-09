using System.ComponentModel.DataAnnotations;

namespace Cabo.Models
{
    public class ContactForm
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Adınızı girin")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email adresinizi girin")]
        [EmailAddress(ErrorMessage = "Geçerli bir email girin")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mesajınızı girin")]
        public string Message { get; set; } = string.Empty;
    }
}
