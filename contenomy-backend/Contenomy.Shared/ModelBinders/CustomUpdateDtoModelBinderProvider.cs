using Microsoft.AspNetCore.Mvc.ModelBinding;
using Contenomy.Shared.DTO;

namespace Contenomy.Shared.DTO
{
    public class CustomUpdateDtoModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (context.Metadata.ModelType == typeof(UpdateShopProductDTO))
            {
                return new CustomUpdateDtoModelBinder();
            }

            return null;
        }
    }
}
