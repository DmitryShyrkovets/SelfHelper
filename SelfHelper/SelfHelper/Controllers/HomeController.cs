using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelfHelper.Models;

namespace SelfHelper.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationContext db;

        public HomeController(ApplicationContext context)
        {
            db = context;
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult Diary()
        {

            DateTime date = DateTime.Now;
            ViewBag.Date = DateTime.Now.ToString("yyyy-MM-dd");

            return View();
        }

        [Authorize]
        public IActionResult Note()
        {

            return View();
        }

        [Authorize]
        public IActionResult Target()
        {

            return View();
        }

        [Authorize]
        public IActionResult Board()
        {

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
