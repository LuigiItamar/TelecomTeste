using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class FaturaController : ControllerBase
{
    private readonly TelecomContext _context;

    public FaturaController(TelecomContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fatura>>> GetFaturas()
    {
        var result = await _context.Faturas
            .Include(f => f.Contrato)
            .ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Fatura>> PostFatura(Fatura fatura)
    {   
        _context.Faturas.Add(fatura);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFatura), new { id = fatura.Id }, fatura);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Fatura>> GetFatura(int id)
    {
        var fatura = await _context.Faturas
            .Include(f => f.Contrato)
            .FirstOrDefaultAsync(f => f.Id == id);
        if (fatura == null)
            return NotFound();
        return Ok (fatura);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutFatura(int id, Fatura fatura)
    {
        if (id != fatura.Id)
            return BadRequest();
        _context.Entry(fatura).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Faturas.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFatura(int id)
    {
        var fatura = await _context.Faturas.FindAsync(id);
        if (fatura == null)
            return NotFound();
        _context.Faturas.Remove(fatura);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("total/{anoMes}")]
    public async Task<ActionResult<decimal>> GetTotalMensal(string anoMes)
    {
        if (!DateTime.TryParse($"{anoMes}-01", out var dataBase))
            return BadRequest("Formato inválido. Use AAAA-MM");
        var total = await _context.Faturas
            .Where(f => f.DataEmissao.Year == dataBase.Year && f.DataEmissao.Month == dataBase.Month)
            .SumAsync(f => f.ValorCobrado);
        return Ok(total);
    }
}
