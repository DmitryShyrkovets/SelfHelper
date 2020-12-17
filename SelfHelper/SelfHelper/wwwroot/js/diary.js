$(window).on('load', async function (){
    await LoadDates();
    await LoadEntries();
});

let check = true;
let change = true;
let text;
let editText;
let date;

$('.diary-date').change(function(event){
    LoadEntries();
});

async function LoadDates(){
    const response = await fetch("/Diary/LoadDates", {
        method: "GET",
        headers: { "Accept": "application/json" }
    }).catch(err => console.error("Error", err));

    const dates = await response.json();

    if(dates.length != 0){
        date = dates[dates.length - 1].dateTime.substring(0,4) + '-' + dates[dates.length - 1].dateTime.substring(5,7) +'-'+ dates[dates.length - 1].dateTime.substring(8,10);
        $('.diary-date').val(date);
    }

    $('.days').remove();
    $('.statistics').append($('<h2 class = "days"> Всего дней: ' +  dates.length + '</h2>'));
}

async function LoadEntries(){
    date = $(".diary-date").val().replace(/(\d*)-(\d*)-(\d*)/, '$3-$2-$1');
    date  = date.substring(0,2) + '.' + date.substring(3,5) + '.' + date.substring(6,10);
    const response = await fetch('/Diary/LoadEntries', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            date: date
        } )
    }).catch(err => console.error("Error", err));

    const entries = await response.json();

    $('.sheet').empty();

    if(entries.length == 0){
        $('.sheet').append($('<h2>Записей нету!</h2>'));
    }

    for(var i = 0; i < entries.length; i++){
        let time = new String(entries[i].dateTime.substr(10));
        
        $('.sheet').append($(
            '<div class="msg-up">'+
                '<h3>' + time.slice(1,6) + '</h3>'+
                '<div class="action">'+
                    '<div class="edit" id="'+ (entries[i].id) +'">'+
                        '<img src="../images/pen.png" >'+
                    '</div>'+
                    '<div class="delete" id="'+ (entries[i].id) +'">'+
                        '<img src="../images/trash_basket.png">'+
                    '</div>'+
                '</div>'+
            '</div>'+
                '<p id="'+ (entries[i].id) +'">' + entries[i].text + '</p>'+
            '<div class="line"></div>'
        ));
    }

    $('.edit').click(function(){
        if(check){
            check = !check;
    
            id = $(this).attr('id');

            text = $(this).parents('.sheet').find('p#' + id).text();

            $('.entry-form').submit(function() {
                return false;
              });
    
            $('.form').append($('<form class = "entry-form"></form>'));
            $('.entry-form').append($('<h2>Редактирование записи</h2>'));
            $('.entry-form').append($('<div class = "entry-text"><textarea class = "text" placeholder="Напишите тут свои мысли">'+  $(this).parents('.sheet').find('p#' + id).text() +'</textarea></div>'));
            $('.entry-form').append($('<div class = "form-buttons"></div>'));
            $('.form-buttons').append('<div class = "save"><p>Сохранить</p></div>');
            $('.form-buttons').append('<div class = "cancel"><p>Отмена</p></div>');
            $('.content').toggleClass('blur');
            $('.up-diary').toggleClass('blur');
            $('.button').toggleClass('blur');
            $('.statistics').toggleClass('blur');

            $('.save').click(function(){
                EditEntry();
            });

            $('.cancel').click(function(){
                check = !check;
                $('.entry-form').remove();
                $('.content').toggleClass('blur');
                $('.up-diary').toggleClass('blur')
                $('.button').toggleClass('blur');
                $('.statistics').toggleClass('blur');
            });

            async function EditEntry(){

                editText = $('.text').val();
                
                if(editText != ""){
                    const response = await fetch("/Diary/EditEntry", {
                        method: "Post",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            text: editText,
                            id: id
                        })
                    });
                    if (response.ok === true) { 
                        check = !check;

                        $('.entry-form').remove();
                        $('.content').toggleClass('blur');
                        $('.up-diary').toggleClass('blur')
                        $('.button').toggleClass('blur');
                        $('.statistics').toggleClass('blur');
                               
                        await LoadEntries();
                    }
                }
                else{
                    alert("Данные не были изменены! Нельзя оставлять текст пустым!");
                }
            };
        }
    });

    $('.delete').click(function(){
        if(check){
            check = !check;
    
            id = $(this).attr('id');
    
            $('.form').append($('<form class = "delete-form"></form>'));
            $('.delete-form').append($('<h2>Удаление записи</h2>'));
            $('.delete-form').append($('<p> Вы действительно хотите удалить запись?</p>'));
            $('.delete-form').append($('<div class = "form-buttons"></div>'));
            $('.form-buttons').append('<div class = "del"><p>Удалить</p></div>');
            $('.form-buttons').append('<div class = "cancel"><p>Отмена</p></div>');
            $('.content').toggleClass('blur');
            $('.up-diary').toggleClass('blur')
            $('.button').toggleClass('blur');
            $('.statistics').toggleClass('blur');

            $('.del').click(function(){
                DeleteEntry();

                check = !check;
                $('.delete-form').remove();
                $('.content').toggleClass('blur');
                $('.up-diary').toggleClass('blur')
                $('.button').toggleClass('blur');
                $('.statistics').toggleClass('blur');
            });

            $('.cancel').click(function(){
                check = !check;
                $('.delete-form').remove();
                $('.content').toggleClass('blur');
                $('.up-diary').toggleClass('blur')
                $('.button').toggleClass('blur');
                $('.statistics').toggleClass('blur');
            });

            async function DeleteEntry(){
    
                change = false;

                const response = await fetch("/Diary/DeleteEntry", {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: id
                    })
                });
                if (response.ok === true) { 
                    await LoadDates();
                      
                    await LoadEntries();
                }
            };
        }
    });

    $('.entries').remove();
    $('.statistics').append($('<h2 class = "entries"> Записей на день: ' +  entries.length + '</h2>'));  
};

$('.button h2').click(function(){
    if(check){
        check = !check;

        $('.entry-form').submit(function() {
            return false;
          });

        $('.form').append($('<form class = "entry-form"></form>'));
        $('.entry-form').append($('<h2>Добавление записи</h2>'));
        $('.entry-form').append($('<div class = "entry-text"><textarea class = "text" placeholder="Напишите тут свои мысли"></textarea></div>'));
        $('.entry-form').append($('<div class = "form-buttons"></div>'));
        $('.form-buttons').append('<div class = "add"><p>Добавить</p></div>');
        $('.form-buttons').append('<div class = "cancel"><p>Отмена</p></div>');
        $('.content').toggleClass('blur');
        $('.up-diary').toggleClass('blur')
        $('.button').toggleClass('blur');
        $('.statistics').toggleClass('blur');

          
        $('.add').click( async function(){
            AddEntry();

        })

        $('.cancel').click(function(){
            check = !check;
            $('.entry-form').remove();
            $('.content').toggleClass('blur');
            $('.up-diary').toggleClass('blur')
            $('.button').toggleClass('blur');
            $('.statistics').toggleClass('blur');
        });

        async function AddEntry(){

            text = $('.text').val();

            if(text != ""){
                const response = await fetch("/Diary/AddEntry", {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: text,
                    })
                });
                if (response.ok === true) {
                    check = !check;

                    $('.entry-form').remove();
                    $('.content').toggleClass('blur');
                    $('.up-diary').toggleClass('blur')
                    $('.button').toggleClass('blur');
                    $('.statistics').toggleClass('blur');

                    await LoadDates();
    
                    await LoadEntries();
                }
            }
            else{
                alert("Запись не была добавленна! Нельзя добавлять пустую запись!");
            }
        };
    }

})

$(function() {

    var mark = function() {
  
      var keyword = $("input[name='keyword']").val();

      $(".context").unmark({
        done: function() {
          $(".context").mark(keyword);
        }
      });
    };
  
    $("input[name='keyword']").on("input", mark);
  
  });