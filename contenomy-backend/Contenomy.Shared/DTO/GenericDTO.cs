using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contenomy.API.Shared.DTO
{
    public abstract class GenericDTO<T>
    {
        public abstract T ConvertTo();
    }
}
