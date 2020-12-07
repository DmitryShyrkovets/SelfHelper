using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfHelper.Models
{
    public class TargetView
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime DateTimeFirst { get; set; }
        public DateTime DateTimeSecond { get; set; }
        public string Status { get; set; }

        public string User { get; set; }
    }
}
