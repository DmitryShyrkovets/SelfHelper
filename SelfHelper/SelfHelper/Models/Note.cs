using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfHelper.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Topic { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime DateTime { get; set; }
        public bool Important { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

    }
}
