

using System.Collections.Generic;

namespace SelfHelper.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }

        public List<Diary> Entries { get; set; }
        public List<Note> Notes { get; set; }
        public List<Target> Targets { get; set; }
    }
}
