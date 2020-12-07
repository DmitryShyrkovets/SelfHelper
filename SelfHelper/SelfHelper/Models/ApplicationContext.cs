using Microsoft.EntityFrameworkCore;

namespace SelfHelper.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Diary> Diaries { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Target> Targets { get; set; }
        public DbSet<DiaryView> DiaryViews { get; set; }
        public DbSet<NoteView> NoteViews { get; set; }
        public DbSet<TargetView> TargetViews { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DiaryView>((pc =>
            {
                pc.HasNoKey();
                pc.ToView("DiaryView");
            }));

            modelBuilder.Entity<NoteView>((pc =>
            {
                pc.HasNoKey();
                pc.ToView("NoteView");
            }));

            modelBuilder.Entity<TargetView>((pc =>
            {
                pc.HasNoKey();
                pc.ToView("TargetView");
            }));
        }

        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
            Database.EnsureCreated();

            /*Database.ExecuteSqlRaw(@"CREATE VIEW DiaryView AS 
                                            SELECT c.Id AS Id, c.Text AS Text, c.DateTime AS DateTime, p.Login AS User
                                            FROM Entries c
                                            INNER JOIN Users p on p.Id = c.UserId");*/
        }
    }
}
