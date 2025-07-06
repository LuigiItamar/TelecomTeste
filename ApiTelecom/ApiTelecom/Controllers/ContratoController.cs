using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ContratoController : ControllerBase
{
    private readonly TelecomContext _context;

    public ContratoController(TelecomContext context)
    {
        _context = context;
    }

    // GET: api/contrato
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contrato>>> GetContratos()
    {
        // Incluir dados da operadora para facilitar a visualização
        return await _context.Contratos.Include(c => c.Operadora).ToListAsync();
    }

    // GET: api/contrato/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Contrato>> GetContrato(int id)
    {
        var contrato = await _context.Contratos.Include(c => c.Operadora)
                                               .FirstOrDefaultAsync(c => c.Id == id);

        if (contrato == null)
            return NotFound();

        return contrato;
    }

    // POST: api/contrato
    [HttpPost]
    public async Task<ActionResult<Contrato>> CreateContrato(Contrato contrato)
    {
        _context.Contratos.Add(contrato);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetContrato), new { id = contrato.Id }, contrato);
    }

    // PUT: api/contrato/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContrato(int id, Contrato contrato)
    {
        if (id != contrato.Id)
            return BadRequest();

        _context.Entry(contrato).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Contratos.Any(c => c.Id == id))
                return NotFound();
            else
                throw;
        }

        return NoContent();
    }

    // DELETE: api/contrato/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContrato(int id)
    {
        var contrato = await _context.Contratos.FindAsync(id);
        if (contrato == null)
            return NotFound();

        _context.Contratos.Remove(contrato);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
