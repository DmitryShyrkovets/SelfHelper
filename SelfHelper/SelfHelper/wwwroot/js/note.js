$(window).on('load', function (){
    date = $('.datedrop .select span').text();
    LoadCategories();
    LoadNotes();
});

let date;
let text;
let category;
let title;
let topic;
let check = true;
let important;

$('.typedrop').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.type-menu').slideToggle(300);
});
$('.typedrop').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.type-menu').slideUp(300);
});



$('.datedrop').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.date-menu').slideToggle(300);
});
$('.datedrop').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.date-menu').slideUp(300);
});

$('.datedrop .date-menu li').click(function () {
    $(this).parents('.datedrop').find('span').text($(this).text());
    $(this).parents('.datedrop').find('input').attr('value', $(this).attr('id'));
    
    if($(this).text() == 'Календарь'){
        $('.note-date').prop('disabled', false);
        let t = $('.note-date').val();
        if($('.note-date').val() != ""){
            date = $('.note-date').val();
            date = date.replace(/(\d*)-(\d*)-(\d*)/, '$3-$2-$1');
            date  = date.substring(0,2) + '.' + date.substring(3,5) + '.' + date.substring(6,10);
            LoadNotes()
        }
    }
    else{
        $('.note-date').prop('disabled', true);
        date = $('.datedrop .select span').text();
        LoadNotes()
    }
});

$('.note-date').change(function(event){
    date = event.target.value;
    date = date.replace(/(\d*)-(\d*)-(\d*)/, '$3-$2-$1');
    date  = date.substring(0,2) + '.' + date.substring(3,5) + '.' + date.substring(6,10);
    LoadNotes();
});

async function LoadCategories(){
    const response = await fetch("/Note/LoadCategories", {
        method: "GET",
        headers: { "Accept": "application/json" }
    }).catch(err => console.error("Error", err));

    const categories = await response.json();

    $('.type-menu').empty();

    $('.type-menu').append($('<li>Все</li>'));
    $('.type-menu').append($('<li>Важные</li>'));

    for(var i = 0; i < categories.length; i++){
        $('.type-menu').append($('<li>' + categories[i].topic + '</li>'));
    }


    if(check){

        $('.typedrop .type-menu li').click(function () {
            $(this).parents('.typedrop').find('span').text($(this).text());
            $(this).parents('.typedrop').find('input').attr('value', $(this).attr('id'));
            LoadNotes();
        });

    }
}

async function LoadNotes(){
    category = $('.typedrop .select span').text();

    const response = await fetch('/Note/LoadNotes', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            date: date,
            category: category
        } )
    }).catch(err => console.error("Error", err));

    const notes = await response.json();

    $('.note-content').empty();

    if(notes.length == 0){
        $('.note-content').append($('<h3>Заметок нету!</h3>'));
    }

    for(var i = 0; i < notes.length; i++){
        
        $('.note-content').append($(
            '<div class="note-block" id="note'+ notes[i].id +'">'+
                '<div class="up-note">'+
                    '<h2 class="title">'+ notes[i].title +'</h2>'+
                    '<h2 class="topic" hidden>'+ notes[i].topic +'</h2>'+
                    '<h2 class="important" hidden>'+ notes[i].important +'</h2>'+
                    '<div class="action">'+
                        '<div class="edit" id="'+ notes[i].id +'">'+
                            '<img src="../images/pen.png" alt="pen">'+
                        '</div>'+
                        '<div class="delete" id="'+ notes[i].id +'">'+
                            '<img src="../images/trash_basket.png" alt="trash">'+
                        '</div>'+
                    '</div>'+  
                '</div>'+
                '<div class="text-note">'+
                    '<p>'+ notes[i].text +'</p>'+
                '</div>'+
            '</div>'
        ));
    }

    async function LoadCategoriesFormEdit() {

        const response = await fetch("/Note/LoadCategories", {
            method: "GET",
            headers: { "Accept": "application/json" }
        }).catch(err => console.error("Error", err));
    
        const categories = await response.json();
    
        $('.type-menu-form').empty();
    
        for(var i = 0; i < categories.length; i++){
            $('.type-menu-form').append($('<li>' + categories[i].topic + '</li>'));
        }
    
        $('.type-menu-form').append($('<li>Редактировать/Новая категория</li>'));
    
        $('.typedrop-form .type-menu-form li').click(function () {
            $(this).parents('.typedrop-form').find('span').text($(this).text());
            $(this).parents('.typedrop-form').find('input').attr('value', $(this).attr('id'));
    
            if($('.typedrop-form span').text() == 'Редактировать/Новая категория'){
                $('.topic').prop('disabled', false);
            }
            else {
                $('.topic').prop('disabled', true);
            }
        });
    }
    
    $('.edit').click(function(){
        if(check){
            check = !check;
    
            id = $(this).attr('id');

            title = $(this).parents('.note-content #note'+ id).find('.up-note .title').text();
            topic = $(this).parents('.note-content #note'+ id).find('.up-note .topic').text();
            important = $(this).parents('.note-content #note'+ id).find('.up-note .important').text();
            text = $(this).parents('.note-content #note'+ id).find('.text-note p').text();

            $('.note-form').submit(function() {
                return false;
              });
    
              $('.form').append($('<form class = "note-form"></form>'));
              $('.note-form').append($('<h2>Редактирование заметки</h2>'));
              $('.note-form').append($('<div class="up-form"></div>'));
              $('.note-form').append($('<div class="middle-form"></div>'));
              $('.up-form').append($('<div class="dropdown typedrop-form"><div class="select"><span>'+topic+'</span><i class="fa fa-chevron-left"></i></div><ul class="dropdown-menu type-menu-form"></ul></div>'));
              $('.up-form').append($('<input class="topic" type=text value="'+ topic +'" placeholder="Категория" disabled>'));
              $('.middle-form').append($('<input class="title" type=text value="'+ title +'" placeholder="Заголовок">'));
              $('.note-form').append($('<div class = "note-text"><textarea class = "text" placeholder="Напишите тут подробности">'+ text +'</textarea></div>'));
              $('.note-form').append($('<div class = "form-buttons"></div>'));
              $('.form-buttons').append('<div class = "save"><p>Сохранить</p></div>');
              $('.form-buttons').append('<div class = "cancel"><p>Отмена</p></div>');

              if(important != "true"){
                $('.middle-form').append($('<p><input type="checkbox" class="important"/>Важное</p>'));
              }
              else {
                $('.middle-form').append($('<p><input type="checkbox" class="important" checked/>Важное</p>'));
              }

              LoadCategoriesFormEdit()

                            
            $('.typedrop-form').click(function () {
                $(this).attr('tabindex', 1).focus();
                $(this).toggleClass('active');
                $(this).find('.type-menu-form').slideToggle(300);
            });
            $('.typedrop-form').focusout(function () {
                $(this).removeClass('active');
                $(this).find('.type-menu-form').slideUp(300);
            });

              $('.note-content').toggleClass('blur');
              $('.up-content').toggleClass('blur');
              $('.add-note').toggleClass('blur');
              $('.statistic').toggleClass('blur');

            $('.save').click(function(){
                EditNote();
            });

            $('.cancel').click(function(){
                check = !check;
                $('.note-form').remove();
                $('.note-content').toggleClass('blur');
                $('.up-content').toggleClass('blur');
                $('.add-note').toggleClass('blur');
                $('.statistic').toggleClass('blur');
            });

            async function EditNote(){

                editText = $('.note-form .text').val();
                if($('.typedrop-form span').text() != 'Редактировать/Новая категория'){
                    editCategory = $('.typedrop-form span').text();
                }
                else{
                    editCategory = $('.note-form .topic').val();
                }

                editTitle = $('.note-form .title').val();
                
                if($('.important').is(":checked")){
                    editImportant = "true";
                }
                else{
                    editImportant = "false";
                }

                if(editText != "" && editCategory != "" && editTitle != ""){
                    const response = await fetch("/Note/EditNote", {
                        method: "Post",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            text: editText,
                            category: editCategory,
                            title: editTitle,
                            important: editImportant, 
                            id: id
                        })
                    });
                    if (response.ok === true) {   
                        check = !check;
                    
                        await LoadCategories();
                        await LoadNotes();
    
                        $('.note-form').remove();
                        $('.note-content').toggleClass('blur');
                        $('.up-content').toggleClass('blur');
                        $('.add-note').toggleClass('blur');
                        $('.statistic').toggleClass('blur');
                    }
                }
                else{
                    alert("Данные не были изменены! Нельзя оставлять текстовые поля пустыми!");
                }
            };
        }
      
    });

    $('.delete').click(function(){
        if(check){
            check = !check;
    
            id = $(this).attr('id');
    
            $('.form').append($('<form class = "delete-form"></form>'));
            $('.delete-form').append($('<h2>Удаление заметки</h2>'));
            $('.delete-form').append($('<p> Вы действительно хотите удалить заметку?</p>'));
            $('.delete-form').append($('<div class = "form-buttons"></div>'));
            $('.form-buttons').append('<div class = "del"><p>Удалить</p></div>');
            $('.form-buttons').append('<div class = "cancel"><p>Отмена</p></div>');
            $('.note-content').toggleClass('blur');
            $('.up-content').toggleClass('blur');
            $('.add-note').toggleClass('blur');
            $('.statistic').toggleClass('blur');

            $('.del').click(function(){
                DeleteNote();

                check = !check;
                $('.delete-form').remove();
                $('.note-content').toggleClass('blur');
                $('.up-content').toggleClass('blur');
                $('.add-note').toggleClass('blur');
                $('.statistic').toggleClass('blur');
            });

            $('.cancel').click(function(){
                check = !check;
                $('.delete-form').remove();
                $('.note-content').toggleClass('blur');
                $('.up-content').toggleClass('blur');
                $('.add-note').toggleClass('blur');
                $('.statistic').toggleClass('blur');
            });

            async function DeleteNote(){

                const response = await fetch("/Note/DeleteNote", {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: id
                    })
                });
                if (response.ok === true) { 
                    await LoadCategories();
                    await LoadNotes();
                }
            };
        }
    });

    $('.noties').remove();
    $('.statistic').append($('<h2 class = "noties"> Заметок показано: ' +  notes.length + '</h2>'));
}

async function LoadCategoriesFormAdd() {

    const response = await fetch("/Note/LoadCategories", {
        method: "GET",
        headers: { "Accept": "application/json" }
    }).catch(err => console.error("Error", err));

    const categories = await response.json();

    $('.type-menu-form').empty();

    for(var i = 0; i < categories.length; i++){
        $('.type-menu-form').append($('<li>' + categories[i].topic + '</li>'));
    }

    $('.type-menu-form').append($('<li>Новая категория</li>'));

    $('.typedrop-form .type-menu-form li').click(function () {
        $(this).parents('.typedrop-form').find('span').text($(this).text());
        $(this).parents('.typedrop-form').find('input').attr('value', $(this).attr('id'));

        if($('.typedrop-form span').text() == 'Новая категория'){
            $('.topic').prop('disabled', false);
        }
        else {
            $('.topic').prop('disabled', true);
        }
    });
}

$('.add-note h2').click(function(){

    if(check){
        check = !check;

        $('.note-form').submit(function() {
            return false;
          });

        $('.form').append($('<form class = "note-form"></form>'));
        $('.note-form').append($('<h2>Добавление заметки</h2>'));
        $('.note-form').append($('<div class="up-form"></div>'));
        $('.note-form').append($('<div class="middle-form"></div>'));
        $('.up-form').append($('<div class="dropdown typedrop-form"><div class="select"><span>Новая категория</span><i class="fa fa-chevron-left"></i></div><ul class="dropdown-menu type-menu-form"></ul></div>'));
        $('.up-form').append($('<input class="topic" type=text placeholder="Категория">'));
        $('.middle-form').append($('<input class="title" type=text placeholder="Заголовок">'));
        $('.middle-form').append($('<p><input type="checkbox" class="important"/>Важное</p>'));
        $('.note-form').append($('<div class = "note-text"><textarea class = "text" placeholder="Напишите тут подробности"></textarea></div>'));
        $('.note-form').append($('<div class = "form-buttons"></div>'));
        $('.form-buttons').append('<div class = "add"><p>Добавить</p></div>');
        $('.form-buttons').append('<div class = "cancel"><p>Отмена</p></div>');
        $('.note-content').toggleClass('blur');
        $('.up-content').toggleClass('blur');
        $('.add-note').toggleClass('blur');
        $('.statistic').toggleClass('blur');

        LoadCategoriesFormAdd();

        $('.typedrop-form').click(function () {
            $(this).attr('tabindex', 1).focus();
            $(this).toggleClass('active');
            $(this).find('.type-menu-form').slideToggle(300);
        });
        $('.typedrop-form').focusout(function () {
            $(this).removeClass('active');
            $(this).find('.type-menu-form').slideUp(300);
        });
          
        $('.add').click( async function(){
            AddNote();
        })

        $('.cancel').click(function(){
            check = !check;
            $('.note-form').remove();
            $('.note-content').toggleClass('blur');
            $('.up-content').toggleClass('blur');
            $('.add-note').toggleClass('blur');
            $('.statistic').toggleClass('blur');
        });

        async function AddNote(){

            text = $('.note-form .text').val();
            title = $('.note-form .title').val();
            if($('.typedrop-form span').text() != 'Новая категория'){
                category = $('.typedrop-form span').text();
            }
            else{
                category = $('.note-form .topic').val();
            }

            if($('.important').is(":checked")){
                important = "true";
            }
            else{
                important = "false";
            }

            if(text != "" && title != "" && category != ""){
                const response = await fetch("/Note/AddNote", {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: text,
                        title: title,
                        category: category,
                        important: important 
                    })
                });
                if (response.ok === true) {
                    check = !check;

                    await LoadCategories();
                    await LoadNotes();

                    $('.note-form').remove();
                    $('.note-content').toggleClass('blur');
                    $('.up-content').toggleClass('blur');
                    $('.add-note').toggleClass('blur');
                    $('.statistic').toggleClass('blur');
                }
            }
            else{
                alert("Заметка не добавленна! Нельзя оставлять текстовые поля пустыми!");
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