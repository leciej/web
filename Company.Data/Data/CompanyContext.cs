using Company.Data.Data.CMS;
using Company.Data.Data.Shop;
using Microsoft.EntityFrameworkCore;

namespace Company.Data.Data;

public class CompanyContext : DbContext
{
    public CompanyContext (DbContextOptions<CompanyContext> options)
        : base(options)
    {
    }

    public DbSet<Page> Page { get; set; } = default!;
    public DbSet<News> News { get; set; } = default!;
    public DbSet<TypeOfProduct> TypeOfProduct { get; set; } = default!;
    public DbSet<Product> Product { get; set; } = default!;
}