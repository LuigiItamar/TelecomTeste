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

    // GET: api/fatura
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fatura>>> GetFaturas()
    {
        var result = await _context.Faturas
            //.Include(f => f.Operadora) //fazer relacionamento.
            .Include(f => f.Contrato)
            .ToListAsync();
        return Ok(result);
    }

    // POST: api/fatura
    [HttpPost]
    public async Task<ActionResult<Fatura>> PostFatura(Fatura fatura)
    {   
        _context.Faturas.Add(fatura);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFatura), new { id = fatura.Id }, fatura);
    }

    // GET: api/fatura/5
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

    // GET: api/fatura/total/2025-07
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
