using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SelfHelper.Models
{
    public class SampleData
    {
        public static void Initialize(ApplicationContext context)
        {

            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        Login = "zoldik",
                        Email = "zoldikds@mail.ru",
                        Password = "1111"
                    },
                    new User
                    {
                        Login = "zoldikds",
                        Email = "zoldikds@mail.ru",
                        Password = "3228"
                    },
                    new User
                    {
                        Login = "zaludik",
                        Email = "zoldikds@mail.ru",
                        Password = "1234"
                    }
                );
                context.SaveChanges();
            }

            User user = context.Users.FirstOrDefault(e => e.Login == "zoldik");
            User user2 = context.Users.FirstOrDefault(e => e.Login == "zoldikds");
            User user3 = context.Users.FirstOrDefault(e => e.Login == "zaludik");

            DateTime dateTime = new DateTime(2020, 01, 10, 22, 20, 00);
            DateTime dateTime2 = new DateTime(2020, 01, 11, 20, 20, 00);
            DateTime dateTime3 = new DateTime(2020, 01, 12, 22, 29, 00);
            DateTime dateTime4 = new DateTime(2020, 01, 11, 21, 20, 00);

            if (!context.Diaries.Any())
            {
                context.Diaries.AddRange(
                    new Diary
                    {
                        User = user,
                        DateTime = dateTime,
                        Text = "Text 1"
                    },
                    new Diary
                    {
                        User = user2,
                        DateTime = dateTime2,
                        Text = "Text 2"
                    },
                    new Diary
                    {
                        User = user3,
                        DateTime = dateTime3,
                        Text = "Text 3"
                    },
                    new Diary
                    {
                        User = user,
                        DateTime = dateTime4,
                        Text = "Text 4"
                    }
                );
                context.SaveChanges();
            }

            if (!context.Notes.Any())
            {
                context.Notes.AddRange(
                    new Note
                    {
                        User = user,
                        DateTime = dateTime,
                        Title = "Title 1",
                        Topic = "Topic 1",
                        Important = true,
                        Text = "Text 1"
                    },
                    new Note
                    {
                        User = user2,
                        DateTime = dateTime2,
                        Title = "Title 2",
                        Topic = "Topic 2",
                        Important = true,
                        Text = "Text 2"
                    },
                    new Note
                    {
                        User = user3,
                        DateTime = dateTime3,
                        Title = "Title 3",
                        Topic = "Topic 3",
                        Important = true,
                        Text = "Text 3"
                    },
                    new Note
                    {
                        User = user,
                        DateTime = dateTime4,
                        Title = "Title 4",
                        Topic = "Topic 4",
                        Important = true,
                        Text = "Text 4"
                    }
                );
                context.SaveChanges();
            }

            if (!context.Targets.Any())
            {
                context.Targets.AddRange(
                    new Target
                    {
                        User = user,
                        Text = "Text 1",
                        Status = "Completed",
                        DateTimeFirst = new DateTime(2020, 01, 10, 12, 00, 00),
                        DateTimeSecond = new DateTime(2020, 01, 20, 14, 00, 00)
                    },
                    new Target
                    {
                        User = user2,
                        Text = "Text 2",
                        Status = "Completed",
                        DateTimeFirst = new DateTime(2020, 01, 10, 10, 00, 00),
                        DateTimeSecond = new DateTime(2020, 01, 20, 20, 20, 00)
                    },
                    new Target
                    {
                        User = user3,
                        Text = "Text 3",
                        Status = "Completed",
                        DateTimeFirst = new DateTime(2020, 01, 10, 12, 00, 00),
                        DateTimeSecond = new DateTime(2020, 02, 02, 14, 00, 00)
                    },
                    new Target
                    {
                        User = user,
                        Text = "Text 4",
                        Status = "Performed",
                        DateTimeFirst = new DateTime(2020, 02, 10, 12, 30, 00),
                        DateTimeSecond = new DateTime(2020, 02, 21, 15, 00, 00)
                    }
                );
                context.SaveChanges();
            }

            try
            {
                var result = context.DiaryViews.Any();
            }
            catch (Exception)
            {
                context.Database.ExecuteSqlRaw(@"CREATE VIEW DiaryView AS 
                                            SELECT c.Id AS 'Id', c.Text AS 'Text', c.DateTime AS 'DateTime', p.Login AS 'User'
                                            FROM Diaries c
                                            INNER JOIN Users p on p.Id = c.UserId");

                context.SaveChanges();
            }

            try
            {
                var result = context.NoteViews.Any();
            }
            catch (Exception)
            {
                context.Database.ExecuteSqlRaw(@"CREATE VIEW NoteView  AS 
                                            SELECT c.Id AS 'Id', c.Topic AS 'Topic', c.Title AS 'Title',  c.Text AS 'Text', c.DateTime AS 'DateTime', c.Important AS 'Important', p.Login AS 'User'
                                            FROM Notes c
                                            INNER JOIN Users p on p.Id = c.UserId");

                context.SaveChanges();
            }

            try
            {
                var result = context.TargetViews.Any();
            }
            catch (Exception)
            {
                context.Database.ExecuteSqlRaw(@"CREATE VIEW TargetView  AS 
                                            SELECT c.Id AS 'Id',  c.Text AS 'Text', c.DateTimeFirst AS 'DateTimeFirst', c.DateTimeSecond AS 'DateTimeSecond', c.Status AS 'Status', p.Login AS 'User'
                                            FROM Targets c
                                            INNER JOIN Users p on p.Id = c.UserId");

                context.SaveChanges();
            }
        }
    }
}

