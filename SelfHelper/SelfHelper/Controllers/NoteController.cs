using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelfHelper.Comparers;
using SelfHelper.DataCatchers;
using SelfHelper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfHelper.Controllers
{
    public class NoteController : Controller
    {

        private ApplicationContext db;

        public NoteController(ApplicationContext context)
        {
            db = context;
        }

        [HttpGet]
        public IEnumerable<Note> LoadCategories()
        {
            IEnumerable<Note> result = db.Notes.AsNoTracking().Where(e => e.User.Login == User.Identity.Name).Select(e => new Note { Topic = e.Topic }).ToList();

            result = result.Distinct(new NoteTopicComparer());

            return result;
        }

        [HttpPost]
        public ActionResult<IEnumerable<NoteView>> LoadNotes([FromBody] NoteCatch noteCatch)
        {
            ActionResult<IEnumerable<NoteView>> result;
            if (noteCatch.Date == "Все")
            {
                if (noteCatch.Category == "Все")
                {
                    result = db.NoteViews.AsEnumerable().Where(e => e.User == User.Identity.Name).ToList();
                    /*result = db.Notes.AsNoTracking().Include(e => e.User).AsEnumerable()
                    .Where(e => e.User.Login == User.Identity.Name)
                    .Select(e => new Note { Text = e.Text, Title = e.Title, Id = e.Id, Topic = e.Topic, Important = e.Important}).ToList();*/
                }
                else if (noteCatch.Category == "Важные")
                {
                    result = db.NoteViews.AsEnumerable().Where(e => e.User == User.Identity.Name && e.Important == true).ToList();
                    /*result = db.Notes.AsNoTracking().Include(e => e.User).AsEnumerable()
                   .Where(e => e.User.Login == User.Identity.Name && e.Important == true)
                   .Select(e => new Note { Text = e.Text, Title = e.Title, Id = e.Id, Topic = e.Topic, Important = e.Important }).ToList();*/
                }
                else
                {
                    result = db.NoteViews.AsEnumerable().Where(e => e.User == User.Identity.Name && e.Topic == noteCatch.Category).ToList();
                    /*result = db.Notes.AsNoTracking().Include(e => e.User).AsEnumerable()
                   .Where(e => e.User.Login == User.Identity.Name && e.Topic == noteCatch.Category)
                   .Select(e => new Note { Text = e.Text, Title = e.Title, Id = e.Id, Topic = e.Topic, Important = e.Important }).ToList();*/
                }
            }
            else
            {
                if (noteCatch.Category == "Все")
                {
                    result = db.NoteViews.AsEnumerable().Where(e => e.User == User.Identity.Name && e.DateTime.ToShortDateString() == noteCatch.Date).ToList();
                    /* result = db.Notes.AsNoTracking().Include(e => e.User).AsEnumerable()
                    .Where(e => e.User.Login == User.Identity.Name && e.DateTime.ToShortDateString() == noteCatch.Date)
                    .Select(e => new Note { Text = e.Text, Title = e.Title, Id = e.Id, Topic = e.Topic, Important = e.Important }).ToList();*/
                }
                else if (noteCatch.Category == "Важные")
                {
                    result = db.NoteViews.AsEnumerable().Where(e => e.User == User.Identity.Name && e.DateTime.ToShortDateString() == noteCatch.Date && e.Important == true).ToList();
                    /*result = db.Notes.AsNoTracking().Include(e => e.User).AsEnumerable()
                   .Where(e => e.User.Login == User.Identity.Name && e.DateTime.ToShortDateString() == noteCatch.Date && e.Important == true)
                   .Select(e => new Note { Text = e.Text, Title = e.Title, Id = e.Id, Topic = e.Topic, Important = e.Important }).ToList();*/
                }
                else
                {
                    result = db.NoteViews.AsEnumerable().Where(e => e.User == User.Identity.Name && e.DateTime.ToShortDateString() == noteCatch.Date && e.Topic == noteCatch.Category).ToList();
                    /*result = db.Notes.AsNoTracking().Include(e => e.User).AsEnumerable()
                   .Where(e => e.User.Login == User.Identity.Name && e.DateTime.ToShortDateString() == noteCatch.Date && e.Topic == noteCatch.Category)
                   .Select(e => new Note { Text = e.Text, Title = e.Title, Id = e.Id, Topic = e.Topic, Important = e.Important }).ToList();*/
                }
            }


            return result;
        }

        [HttpPost]
        public async Task AddNote([FromBody] NoteCatch noteCatch)
        {
            if (noteCatch.Text != null && noteCatch.Text != "" && noteCatch.Category != null && noteCatch.Category != "" && noteCatch.Title != null && noteCatch.Title != "" && noteCatch.Important != null && noteCatch.Important != "")
            {
                DateTime dateTime = DateTime.Now;

                User user = db.Users.FirstOrDefault(e => e.Login == User.Identity.Name);

                bool imprtnt;

                if (noteCatch.Important == "true")
                {
                    imprtnt = true;
                }
                else
                {
                    imprtnt = false;
                }

                db.Notes.Add(new Note { Text = noteCatch.Text, DateTime = dateTime, User = user, Title = noteCatch.Title, Topic = noteCatch.Category, Important = imprtnt });
                await db.SaveChangesAsync();
            }
        }

        [HttpPost]
        public async Task EditNote([FromBody] NoteCatch noteCatch)
        {
            if (noteCatch.Text != null && noteCatch.Text != "" && noteCatch.Category != null && noteCatch.Category != "" && noteCatch.Title != null && noteCatch.Title != "" && noteCatch.Important != null && noteCatch.Important != "")
            {
                Note note = db.Notes.Include(e => e.User).AsEnumerable().FirstOrDefault(e => e.Id.ToString() == noteCatch.Id && e.User.Login == User.Identity.Name);

                note.Text = noteCatch.Text;
                note.Topic = noteCatch.Category;
                note.Title = noteCatch.Title;

                if (noteCatch.Important == "true")
                {
                    note.Important = true;
                }
                else
                {
                    note.Important = false;
                }

                await db.SaveChangesAsync();
            }
        }

        [HttpPost]
        public async Task DeleteNote([FromBody] NoteCatch noteCatch)
        {
            Note note = db.Notes.Include(e => e.User).AsEnumerable().FirstOrDefault(e => e.Id.ToString() == noteCatch.Id && e.User.Login == User.Identity.Name);

            db.Notes.Remove(note);

            await db.SaveChangesAsync();
        }
    }
}
