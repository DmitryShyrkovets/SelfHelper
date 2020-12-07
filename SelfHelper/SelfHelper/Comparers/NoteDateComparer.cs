using SelfHelper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfHelper.Comparers
{
    public class NoteDateComparer : IEqualityComparer<Note>
    {
        bool IEqualityComparer<Note>.Equals(Note x, Note y)
        {
            if (x.DateTime.Date == y.DateTime.Date)
                return true;

            return false;
        }

        int IEqualityComparer<Note>.GetHashCode(Note obj)
        {
            return 0;
        }
    }
}
