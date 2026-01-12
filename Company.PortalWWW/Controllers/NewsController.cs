using Company.Data.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Company.PortalWWW.Controllers
{
    public class NewsController : Controller
    {
        private readonly ILogger<NewsController> _logger;
        private readonly CompanyContext _context;


        public NewsController(CompanyContext context, ILogger<NewsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IActionResult> Index(int? id)
        {
            ViewBag.ModelPage =
                (
                    from page in _context.Page
                    orderby page.DisplayOrder
                    select page
                ).ToList();

            ViewBag.ModelNews =
                (
                    from news in _context.News
                    orderby news.DisplayOrder
                    select news
                ).ToList();

            var item = await _context.News.FirstOrDefaultAsync(a => a.IdNews == id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }
    }
}
