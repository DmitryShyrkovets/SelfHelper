using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelfHelper.DataCatchers;
using SelfHelper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfHelper.Controllers
{
	public class TargetController : Controller
	{
		private ApplicationContext db;

		public TargetController(ApplicationContext context)
		{
			db = context;
		}

		[HttpPost]
		public ActionResult<IEnumerable<TargetView>> LoadTargets([FromBody] TargetCatch targetCatch)
		{
			ActionResult<IEnumerable<TargetView>> result;

			if (targetCatch.Status == "Всё")
			{
				result = db.TargetViews.AsEnumerable().Where(e => e.User == User.Identity.Name).ToList();
				/* result = db.Targets.AsNoTracking().Include(e => e.User).AsEnumerable()
				 .Where(e => (e.User.Login == User.Identity.Name))
				 .Select(e => new Target { Id = e.Id, Text = e.Text, Status = e.Status, DateTimeFirst = e.DateTimeFirst, DateTimeSecond = e.DateTimeSecond }).ToList();*/
			}
			else
			{
				result = db.TargetViews.AsEnumerable().Where(e => e.User == User.Identity.Name && e.Status == targetCatch.Status).ToList();
				/*result = db.Targets.AsNoTracking().Include(e => e.User).AsEnumerable()
                .Where(e => (e.User.Login == User.Identity.Name && e.Status == targetCatch.Status))
                .Select(e => new Target { Id = e.Id, Text = e.Text, Status = e.Status, DateTimeFirst = e.DateTimeFirst, DateTimeSecond = e.DateTimeSecond }).ToList();*/
			}

			return result;
		}

		[HttpPost]
		public async Task ChangeStatus([FromBody] TargetCatch targetCatch)
		{
			if (targetCatch.Id != "" && targetCatch.Id != null && targetCatch.Status != "" && targetCatch.Status != null)
			{
				Target target = db.Targets.FirstOrDefault(e => e.Id.ToString() == targetCatch.Id);

				if (target != null)
				{
					target.Status = targetCatch.Status;
					await db.SaveChangesAsync();
				}
			}
		}

		public async Task CheckStatus()
		{
			IEnumerable<Target> targets = db.Targets.Include(e => e.User).AsEnumerable().Where(e => e.User.Login == User.Identity.Name && e.Status == "Performed").ToList();

			foreach (var item in targets)
			{
				if (item.DateTimeSecond < DateTime.Now)
				{
					item.Status = "Failed";
				}
			}

			await db.SaveChangesAsync();
		}

		[HttpPost]
		public async Task AddTarget([FromBody] TargetCatch targetCatch)
		{
			if (targetCatch.Text != "" && targetCatch.Text != null && targetCatch.DateTimeStart != "" && targetCatch.DateTimeStart != null && targetCatch.DateTimeEnd != "" && targetCatch.DateTimeEnd != null)
			{
				User user = db.Users.FirstOrDefault(e => e.Login == User.Identity.Name);

				db.Targets.Add(new Target { Text = targetCatch.Text, Status = "Performed", DateTimeFirst = Convert.ToDateTime(targetCatch.DateTimeStart), DateTimeSecond = Convert.ToDateTime(targetCatch.DateTimeEnd), User = user });
				await db.SaveChangesAsync();
			}
		}

		[HttpPost]
		public async Task EditTarget([FromBody] TargetCatch targetCatch)
		{
			if (targetCatch.Text != "" && targetCatch.Text != null && targetCatch.DateTimeStart != "" && targetCatch.DateTimeStart != null && targetCatch.DateTimeEnd != "" && targetCatch.DateTimeEnd != null && targetCatch.Id != "" && targetCatch.Id != null)
			{
				Target target = db.Targets.FirstOrDefault(e => e.Id.ToString() == targetCatch.Id);

				target.Text = targetCatch.Text;
				target.DateTimeFirst = Convert.ToDateTime(targetCatch.DateTimeStart);
				target.DateTimeSecond = Convert.ToDateTime(targetCatch.DateTimeEnd);

				await db.SaveChangesAsync();
			}
		}

		[HttpPost]
		public async Task DeleteTarget([FromBody] TargetCatch targetCatch)
		{
			if (targetCatch.Id != "" && targetCatch.Id != null)
			{
				Target target = db.Targets.FirstOrDefault(e => e.Id.ToString() == targetCatch.Id);

				db.Targets.Remove(target);

				await db.SaveChangesAsync();
			}
		}
	}
}
