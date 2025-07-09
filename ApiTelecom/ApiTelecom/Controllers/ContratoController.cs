using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Net.Mail;
using System.Net;

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
        var result = await _context.Contratos.Include(c => c.Operadora).ToListAsync();

        return Ok(result);
    }

    // GET: api/contrato/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Contrato>> GetContrato(int id)
    {
        var contrato = await _context.Contratos.Include(c => c.Operadora)
                                               .FirstOrDefaultAsync(c => c.Id == id);

        if (contrato == null)
            return NotFound();

        return Ok (contrato);
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

    [HttpGet("vencendo")]
    public async Task<ActionResult<IEnumerable<Contrato>>> GetContratosVencendo()
    {
        var hoje = DateTime.Today;
        var limite = hoje.AddDays(5);
        var contratos = await _context.Contratos
            .Include(c => c.Operadora)
            .Where(c => c.DataVencimento >= hoje && c.DataVencimento <= limite)
            .ToListAsync();
        return Ok(contratos);
    }

    public class NotificacaoVencimentoDto
    {
        public int ContratoId { get; set; }
        public string Email { get; set; }
        public string Corpo { get; set; }
    }

    [HttpPost("notificar-vencimento")]
    public async Task<IActionResult> NotificarVencimento([FromBody] NotificacaoVencimentoDto dto)
    {
        var contrato = await _context.Contratos.Include(c => c.Operadora).FirstOrDefaultAsync(c => c.Id == dto.ContratoId);
        if (contrato == null)
            return NotFound();
        try
        {
            var assunto = $"Seu contrato está próximo do vencimento";
            var corpo = string.IsNullOrWhiteSpace(dto.Corpo)
                ? $"Olá,\n\nSeu contrato com a filial '{contrato.NomeFilial}', operadora '{contrato.Operadora?.Nome}', plano '{contrato.PlanoContratado}' vence em {contrato.DataVencimento:dd/MM/yyyy}.\n\nEntre em contato para renovar!"
                : dto.Corpo;
            // Envio real via Gmail SMTP
            // ATENÇÃO: Para funcionar, ative 2FA na sua conta Google e gere uma senha de app em https://myaccount.google.com/apppasswords
            var smtpUser = "SEU_EMAIL@gmail.com"; // <-- Altere aqui
            var smtpPass = "SENHA_DE_APP_AQUI";   // <-- Altere aqui
            using (var smtp = new SmtpClient("smtp.gmail.com", 587))
            {
                smtp.Credentials = new NetworkCredential(smtpUser, smtpPass);
                smtp.EnableSsl = true;
                var mail = new MailMessage(smtpUser, dto.Email, assunto, corpo);
                await smtp.SendMailAsync(mail);
            }
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao enviar e-mail: {ex.Message}");
        }
    }
}
