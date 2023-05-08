using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs.UserAuthDtos;
using Microsoft.AspNetCore.Identity;

namespace AppDevCw2WebApi.Services
{
    public class DocUploadService
    {
        private readonly AppDbContext _dbContext;
        private readonly ImageService _imgService;

        public DocUploadService(AppDbContext dbContext, ImageService imgService)
        {
            _dbContext = dbContext;
            _imgService = imgService;
        }


        public async Task<string> UploadDoc(UploadDocDto dto)
        {
            var userId = dto.UserId;
            var user =  _dbContext.ApplicationUsers.FirstOrDefault(user => user.Id == userId);
            if (user == null)
            {
                throw new Exception( "Invalid user id." );
            }
            if(!string.IsNullOrEmpty(user.DocumentUrl))
            {
                throw new Exception("User document already exists.");

            }
            var validDoctypes = new List<String> { "license", "citizenship" };
            var docType = dto.DocType;
            if (!validDoctypes.Contains(docType))
            {
                throw new Exception("Invalid DocType." );

            }
            var docUrl = await _imgService.UploadImage(dto.Document);
            user.DocumentUrl = docUrl;
            user.DocType = validDoctypes.IndexOf(docType) + 1;
            _dbContext.SaveChanges();
            return docUrl;
        }

    }
}
