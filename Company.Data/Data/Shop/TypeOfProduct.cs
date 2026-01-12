using System.ComponentModel.DataAnnotations;

namespace Company.Data.Data.Shop
{
    public class TypeOfProduct
    {
        [Key]
        public int IdTypeOfProduct { get; set; }

        [Required(ErrorMessage = "Name of type of product is required")]
        [MaxLength(30, ErrorMessage = "Name of type of product should have max 30 characters")]
        public string Name { get; set; }

        public string? Description { get; set; }
        public virtual ICollection<Product>? Products { get; set; }
    }
}
