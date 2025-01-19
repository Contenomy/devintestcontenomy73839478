using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json;

namespace Contenomy.Shared.DTO
{
    public class CustomUpdateDtoModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var stream = bindingContext.HttpContext.Request.Body;
            if (stream == null || stream.Length == 0)
            {
                return Task.CompletedTask;
            }

            using var reader = new StreamReader(stream);
            var body = reader.ReadToEndAsync().Result;
            
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                var result = JsonSerializer.Deserialize<UpdateShopProductDTO>(body, options);
                bindingContext.Result = ModelBindingResult.Success(result);
            }
            catch
            {
                bindingContext.Result = ModelBindingResult.Failed();
            }

            return Task.CompletedTask;
        }
    }
}
