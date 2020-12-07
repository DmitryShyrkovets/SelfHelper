using SelfHelper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfHelper
{
    public class DiaryDateComparer : IEqualityComparer<Diary>
    {
        bool IEqualityComparer<Diary>.Equals(Diary x, Diary y)
        {
            if (x.DateTime.Date == y.DateTime.Date)
                return true;

            return false;
        }

        int IEqualityComparer<Diary>.GetHashCode(Diary obj)
        {
            return 0;
        }
    }
}
