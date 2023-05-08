using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs.UserAuthDtos;
using AppDevCw2WebApi.Models;

namespace AppDevCw2WebApi.Services
{
    public class DocService
    {
        private readonly AppDbContext _context;
        public async Task AddAsync(DocDto docDto)
        {
            await _context.DocumentType.AddAsync( new DocumentType
            {
                Id = docDto.Id,
                Title = docDto.Title,
            });
            await _context.SaveChangesAsync();
        }


    }
}
