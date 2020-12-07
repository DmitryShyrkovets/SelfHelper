using System.ComponentModel.DataAnnotations;


namespace SelfHelper.ViewModels
{
    public class CheckEmail
    {
        [Required(ErrorMessage = "Не указана почта")]
        [EmailAddress(ErrorMessage = "Некорректный адрес")]
        public string Email { get; set; }
    }
}
