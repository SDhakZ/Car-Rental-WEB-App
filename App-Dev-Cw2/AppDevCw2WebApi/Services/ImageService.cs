using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Newtonsoft.Json.Linq;

namespace AppDevCw2WebApi.Services
{
    public class ImageService
    {

        public bool IsImage(IFormFile file)
        {
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg" };
            return allowedTypes.Contains(file.ContentType);
        }

        public bool IsDoc(IFormFile file)
        {
            var allowedTypes = new[] { "application/pdf", "image/png",};
            return allowedTypes.Contains(file.ContentType);
        }

        Account account;
        Cloudinary cloudinary;

        public void initCloudinary()
        {
            var cloudName = DotNetEnv.Env.GetString("CLOUD_NAME");
            var apiKey = DotNetEnv.Env.GetString("CLOUDINARY_API_KEY");
            var apiSecret = DotNetEnv.Env.GetString("CLOUDINARY_API_SECRET");

             account = new Account { Cloud = cloudName, ApiKey = apiKey, ApiSecret = apiSecret };
             cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImage(IFormFile formFile, bool isUser = true)
        {

            initCloudinary();
            // Convert the IFormFile to a Stream
            var stream = new MemoryStream();
            await formFile.CopyToAsync(stream);
            stream.Position = 0;
            var a = formFile.ContentType == "application/pdf";
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(formFile.FileName,stream),
                PublicId = $"car_rental/{(isUser? "user_docs" : "cars")}/{Guid.NewGuid()}",
                Transformation = formFile.ContentType == "application/pdf" ? new Transformation(): new Transformation().FetchFormat("auto")
            };
            var uploadResult = cloudinary.Upload(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }


        public async Task<bool> DeleteImage(string imgUrl)
        {
            initCloudinary();
            var basicUrl = imgUrl.Split("/car_rental").Last().Split(".").First();
            var imgId = $"car_rental{basicUrl}";
            var b = await cloudinary.DeleteResourcesAsync(imgId);
            var c = b.JsonObj["deleted_counts"][imgId]["original"];
            JToken jToken = JToken.Parse(c.ToString());
            //if (jToken.Type == JTokenType.Integer)
            //{
                int count = jToken.Value<int>();
                if(count > 0)
                {
                    return true;
                }
                else
                {
                return false;
                }
               

        }



    }
}
