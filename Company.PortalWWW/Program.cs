using Company.Data.Data;
using Microsoft.EntityFrameworkCore;

namespace Company.PortalWWW
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // === TEST: sprawdzamy jaki connection string jest faktycznie u¿ywany ===
            var cs = builder.Configuration.GetConnectionString("CompanyContext");
            Console.WriteLine(">>> CONNECTION STRING = " + cs);
            // === KONIEC TESTU ===

            builder.Services.AddDbContext<CompanyContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("CompanyContext")
                    ?? throw new InvalidOperationException("Connection string 'CompanyContext' not found.")
                ));

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
