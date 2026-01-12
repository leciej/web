using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Company.Data.Data;
using Company.Data.Data.Shop;

namespace Company.Intranet.Controllers
{
    public class TypeOfProductController : Controller
    {
        private readonly CompanyContext _context;

        public TypeOfProductController(CompanyContext context)
        {
            _context = context;
        }

        // GET: TypeOfProduct
        public async Task<IActionResult> Index()
        {
            return View(await _context.TypeOfProduct.ToListAsync());
        }

        // GET: TypeOfProduct/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var typeOfProduct = await _context.TypeOfProduct
                .FirstOrDefaultAsync(m => m.IdTypeOfProduct == id);
            if (typeOfProduct == null)
            {
                return NotFound();
            }

            return View(typeOfProduct);
        }

        // GET: TypeOfProduct/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: TypeOfProduct/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdTypeOfProduct,Name,Description")] TypeOfProduct typeOfProduct)
        {
            if (ModelState.IsValid)
            {
                _context.Add(typeOfProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(typeOfProduct);
        }

        // GET: TypeOfProduct/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var typeOfProduct = await _context.TypeOfProduct.FindAsync(id);
            if (typeOfProduct == null)
            {
                return NotFound();
            }
            return View(typeOfProduct);
        }

        // POST: TypeOfProduct/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("IdTypeOfProduct,Name,Description")] TypeOfProduct typeOfProduct)
        {
            if (id != typeOfProduct.IdTypeOfProduct)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(typeOfProduct);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TypeOfProductExists(typeOfProduct.IdTypeOfProduct))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(typeOfProduct);
        }

        // GET: TypeOfProduct/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var typeOfProduct = await _context.TypeOfProduct
                .FirstOrDefaultAsync(m => m.IdTypeOfProduct == id);
            if (typeOfProduct == null)
            {
                return NotFound();
            }

            return View(typeOfProduct);
        }

        // POST: TypeOfProduct/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var typeOfProduct = await _context.TypeOfProduct.FindAsync(id);
            if (typeOfProduct != null)
            {
                _context.TypeOfProduct.Remove(typeOfProduct);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool TypeOfProductExists(int id)
        {
            return _context.TypeOfProduct.Any(e => e.IdTypeOfProduct == id);
        }
    }
}
