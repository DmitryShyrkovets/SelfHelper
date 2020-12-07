using Microsoft.AspNetCore.Mvc;
using SelfHelper.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;
using System.Threading.Tasks;
using SelfHelper.Comparers;
using SelfHelper.DataCatchers;

namespace SelfHelper.Controllers
{
    public class DiaryController : Controller
    {

        private ApplicationContext db;

        public DiaryController(ApplicationContext context)
        {
            db = context;
        } 

        [HttpGet]
        public IEnumerable<Diary> LoadDates()
        {
            IEnumerable<Diary> result = db.Diaries.AsNoTracking().OrderBy(e => e.DateTime).Where(e => e.User.Login == User.Identity.Name).Select(e => new Diary{ DateTime = e.DateTime }).ToList();

            result = result.Distinct(new DiaryDateComparer());

            return result;
        }

        [HttpPost]
        public ActionResult<IEnumerable<DiaryView>> LoadEntries([FromBody] DiaryCatch info)
        {
            /*var result = db.Entries.AsNoTracking().Include(e => e.User).AsEnumerable()
                .Where(e => (e.DateTime.ToShortDateString() == info.Date && e.User.Login == User.Identity.Name))
                .Select(e => new Entry { Text = e.Text, DateTime = e.DateTime, Id = e.Id }).ToList();*/

            var result = db.DiaryViews.AsEnumerable().Where(e => e.User == User.Identity.Name && e.DateTime.ToShortDateString() == info.Date).ToList();

            return result;
        }

        [HttpPost]
        public async Task AddEntry([FromBody] DiaryCatch info)
        {
            if (info.Text != null && info.Text != "")
            {
                DateTime dateTime = DateTime.Now;

                User user = db.Users.FirstOrDefault(e => e.Login == User.Identity.Name);

                db.Diaries.Add(new Diary { Text = info.Text, DateTime = dateTime, User = user });
                await db.SaveChangesAsync();
            }
        }

        [HttpPost]
        public async Task EditEntry([FromBody] DiaryCatch info)
        {
            if (info.Text != null && info.Text != "")
            {
                Diary entry = db.Diaries.Include(e => e.User).AsEnumerable().FirstOrDefault(e => e.Id.ToString() == info.Id && e.User.Login == User.Identity.Name);

                entry.Text = info.Text;

                await db.SaveChangesAsync();
            }
        }

        [HttpPost]
        public async Task DeleteEntry([FromBody] DiaryCatch info)
        {
            Diary entry = db.Diaries.Include(e => e.User).AsEnumerable().FirstOrDefault(e => e.Id.ToString() == info.Id && e.User.Login == User.Identity.Name);

            db.Diaries.Remove(entry);

            await db.SaveChangesAsync();
        }

    }
}
