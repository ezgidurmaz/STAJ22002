using Cabo.Models;
using System.Collections.Generic;

namespace Cabo.ViewModels
{
    public class OrderViewModel
    {
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemViewModel> OrderItems { get; set; } = new();
    }

    public class OrderItemViewModel
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
