using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiTelecom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperadoraController : ControllerBase
    {
        private readonly TelecomContext _telecomContext;

        public OperadoraController(TelecomContext telecomContext)
        {
            _telecomContext = telecomContext;
        }

        // GET: api/operadora
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _telecomContext.Operadoras.AsNoTracking().ToListAsync();
            return Ok(result);
        }

        // GET: api/operadora/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var operadora = await _telecomContext.Operadoras.FindAsync(id);

            if (operadora == null)
                return NotFound();

            return Ok(operadora);
        }

        // POST: api/operadora
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Operadora operadora)
        {
            _telecomContext.Operadoras.Add(operadora);
            await _telecomContext.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = operadora.Id }, operadora);
        }

        // PUT: api/operadora/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Operadora operadora)
        {
            if (id != operadora.Id)
                return BadRequest("ID da URL diferente do corpo da requisição.");

            var existe = await _telecomContext.Operadoras.AnyAsync(o => o.Id == id);
            if (!existe)
                return NotFound();

            _telecomContext.Entry(operadora).State = EntityState.Modified;
            await _telecomContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/operadora/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var operadora = await _telecomContext.Operadoras.FindAsync(id);
            if (operadora == null)
                return NotFound();

            _telecomContext.Operadoras.Remove(operadora);
            await _telecomContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
