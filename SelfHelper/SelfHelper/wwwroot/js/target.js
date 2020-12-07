$(window).on('load', function (){
    LoadTargets();
});

let category;
let status;
let dateStart;
let dateEnd;
let timeStart;
let timeEnd;
let text;
let check = true;

$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
    LoadTargets();
});

async function CheckStatus(){
    const response = await fetch("/Target/CheckStatus", {
        method: "GET",
        headers: { "Accept": "application/json" }
    }).catch(err => console.error("Error", err));
}

async function LoadTargets(){
    category = $('.target-category .select span').text();

    if(category == 'Завершённые'){
        status = 'Completed'
    }
    else if(category == 'В процессе'){
        status = 'Performed'
    }
    else if(category == 'Проваленные'){
        status = 'Failed'
    }
    else {
        status = 'Всё'
    }
    
    await CheckStatus();
    

    const response = await fetch('/Target/LoadTargets', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            status: status
        } )
    }).catch(err => console.error("Error", err));

    const targets = await response.json();

    $('.target-contents').empty();

    if(targets.length == 0){
        $('.target-contents').append($('<h3>Целей нету!</h3>'));
    }

    for(var i = 0; i < targets.length; i++){
        
        dateStart = new String(targets[i].dateTimeFirst.substr(0,10));
        timeStart = new String(targets[i].dateTimeFirst.substr(10));
        dateEnd = new String(targets[i].dateTimeSecond.substr(0,10));
        timeEnd = new String(targets[i].dateTimeSecond.substr(10));

        $('.target-contents').append($(
            '<div class="target-block" id="target'+ targets[i].id +'">'+
                '<div class="target-content">'+
                    '<div class="up-block">'+
                        '<p>'+  dateStart.slice(8, 10) + '.' + dateStart.slice(5, 7) + '.' + dateStart.slice(0, 4) + 
                        ' ' + timeStart.slice(1,6) +
                        ' - ' + 
                        dateEnd.slice(8, 10) + '.' + dateEnd.slice(5, 7) + '.' + dateEnd.slice(0, 4) + 
                        ' ' + timeEnd.slice(1,6) + '</p>'+
                        '<div class="action">'+
                            '<div class="edit" id="'+ targets[i].id +'">'+
                                '<img src="../images/pen.png" alt="pen">'+
                            '</div>'+
                            '<div class="delete" id="'+ targets[i].id +'">'+
                                '<img src="../images/trash_basket.png" alt="trash">'+
                            '</div>'+
                        '</div>'+ 
                    '</div>'+
                    '<div class="line"></div>'+
                    '<div class="down-block">'+
                        '<p>'+ targets[i].text +'</p>'+
                    '</div>'+
                '</div>'+
                '<div class="result">'+
                    '<div class="line-up"></div>'+
                    '<div class="target-status" id="'+ targets[i].id +'">'+
                    '</div>'+
                '</div>'+
            '</div>'
        ));

        if(targets[i].status == 'Performed'){
            $('#target' + targets[i].id + ' .target-status').append($(
                '<img src="../images/performed1.png" alt="performed">'
            ));
        }
        else if(targets[i].status == 'Completed'){
            $('#target' + targets[i].id + ' .target-status').append($(
                '<img src="../images/completed.png" alt="completed">'
            ));
        }
        else if(targets[i].status == 'Failed'){
            $('#target' + targets[i].id + ' .target-status').append($(
                '<img src="../images/failed1.png" alt="completed">'
            ));
        }
    }

    $('.targets').remove();
    $('.statistic').append($('<h2 class = "targets"> Целей показано: ' +  targets.length + '</h2>')); 

    $('.target-status').click(function(){
        if(check){
            check = !check;
            id = $(this).attr('id');

            $('.form').append($(
                '<div class="select-status">'+
                    '<h2>Выберите статус цели</h2>'+
                    '<div class="statuses">'+
                        '<img class="Completed" src="../images/completed.png" alt="completed">'+
                        '<img class="Performed" src="../images/performed1.png" alt="performed">'+
                        '<img class="Failed" src="../images/failed1.png" alt="failed">'+
                    '</div>'+
                '</div>'
            ));

            $('.up-target').toggleClass('blur');
            $('.target-contents').toggleClass('blur');
            $('.always-down').toggleClass('blur');

            $('.statuses img').click(function(){
                status = $(this).attr('class');
                check = !check;

                ChangeStatus();

                $('.form').empty();
                
                $('.up-target').toggleClass('blur');
                $('.target-contents').toggleClass('blur');
                $('.always-down').toggleClass('blur');
            })

            async function ChangeStatus(){
                const response = await fetch("/Target/ChangeStatus", {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status: status,
                        id: id
                    })
                });
                if (response.ok === true) {   
                    await LoadTargets();
                }
            }
        }
    });

    $('.edit').click(function(){
        if(check){
            check = !check;
    
            $('.up-target').toggleClass('blur');
            $('.target-contents').toggleClass('blur');
            $('.always-down').toggleClass('blur');

            id = $(this).attr('id');

            date= new String($(this).parents('.target-contents #target'+ id).find('.up-block p').text());
            text = $(this).parents('.target-contents #target'+ id).find('.down-block p').text();

            $('.target-form').submit(function() {
                return false;
              });
    
              $('.form').append($(
                '<div class="target-form">'+
                    '<h2>Редактирование цели</h2>'+
                    '<div class="date-pipckers">'+
                        '<div class="date1">'+
                            '<h3>&#160;С</h3>'+
                            '<input class="start-datetime" type="datetime-local" value="'+date.slice(6, 10)+'-'+date.slice(3, 5)+'-'+date.slice(0, 2)+'T'+date.slice(11, 16)+'">'+
                        '</div>'+
                        '<div class="date2">'+
                            '<h3>По</h3>'+
                            '<input class="end-datetime" type="datetime-local"  value="'+date.slice(25, 29)+'-'+date.slice(22, 24)+'-'+date.slice(19, 21)+'T'+date.slice(30, 35)+'">'+
                        '</div>'+
                    '</div>'+
                    '<textarea class="text" placeholder="Напишите тут свою цель">'+ text +'</textarea>'+
                    '<div class="form-buttons">'+
                        '<div class = "save"><p>Сохранить</p></div>'+
                        '<div class = "cancel"><p>Отмена</p></div>'+
                    '</div>'+
                '</div>'
            ));

            $('.end-datetime').attr('min', $('.start-datetime').val());

            $('.start-datetime').change(function(event){
                $('.end-datetime').prop('disabled', false);
                $('.end-datetime').attr('min', $('.start-datetime').val());

                if(Date.parse( $('.end-datetime').val()) < Date.parse( $('.start-datetime').val()) && new Date( $('.end-datetime').val()).getTime() < new Date( $('.start-datetime').val()).getTime()){
                    $('.end-datetime').val($('.start-datetime').val());
                }

            });

            $('.end-datetime').change(function(event){
                if(Date.parse( $('.end-datetime').val()) < Date.parse( $('.start-datetime').val()) && new Date( $('.end-datetime').val()).getTime() < new Date( $('.start-datetime').val()).getTime()){
                    $('.end-datetime').val($('.start-datetime').val());
                }
            });

            $('.save').click(function(){
                EditTarget();
            });

            $('.cancel').click(function(){
                check = !check;
                $('.target-form').remove();
                $('.up-target').toggleClass('blur');
                $('.target-contents').toggleClass('blur');
                $('.always-down').toggleClass('blur');
            });

            async function EditTarget(){

                dateTemp = new String($(".start-datetime").val().substr(0,10));
                timeStart = new String($(".start-datetime").val().substr(11));
                timeStart = timeStart + ':00'
                dateStart = dateTemp.slice(8, 10) + '.' + dateTemp.slice(5, 7) + '.' + dateTemp.slice(0, 4);

                datetime1 = dateStart + ' ' + timeStart;

                dateTemp = new String($(".end-datetime").val().substr(0,10));
                timeEnd = new String($(".end-datetime").val().substr(11));
                timeEnd = timeEnd + ':00'
                dateEnd = dateTemp.slice(8, 10) + '.' + dateTemp.slice(5, 7) + '.' + dateTemp.slice(0, 4);

                datetime2 = dateEnd + ' ' + timeEnd;

                text = $('.text').val();
                
                if($('.important').is(":checked")){
                    editImportant = "true";
                }
                else{
                    editImportant = "false";
                }

                if(text != "" && datetime1 != "" && datetime2 != ""){
                    const response = await fetch("/Target/EditTarget", {
                        method: "Post",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            text: text,
                            dateTimeStart: datetime1,
                            dateTimeEnd: datetime2,
                            id: id
                        })
                    });
                    if (response.ok === true) {
                        await LoadTargets();

                        check = !check;

                        $('.target-form').remove();
                        $('.up-target').toggleClass('blur');
                        $('.target-contents').toggleClass('blur');
                        $('.always-down').toggleClass('blur');
                    }
                }
                else{
                    alert("Запись не была добавленна! Проверьте все поля ввода!");
                }
            };
        }
      
    });

    
    $('.delete').click(function(){
        if(check){
            check = !check;
        
            $('.up-target').toggleClass('blur');
            $('.target-contents').toggleClass('blur');
            $('.always-down').toggleClass('blur');

            id = $(this).attr('id');
    
            $('.form').append($('<form class = "delete-form"></form>'));
            $('.delete-form').append($('<h2>Удаление цели</h2>'));
            $('.delete-form').append($('<p> Вы действительно хотите удалить цель?</p>'));
            $('.delete-form').append($('<div class = "form-buttons"></div>'));
            $('.form-buttons').append('<div class = "del"><p>Удалить</p></div>');
            $('.form-buttons').append('<div class = "cancel"><p>Отмена</p></div>');

            $('.del').click(function(){
                DeleteTarget();

                check = !check;
                $('.delete-form').remove();
                $('.up-target').toggleClass('blur');
                $('.target-contents').toggleClass('blur');
                $('.always-down').toggleClass('blur');
            });

            $('.cancel').click(function(){
                check = !check;
                $('.delete-form').remove();
                $('.up-target').toggleClass('blur');
                $('.target-contents').toggleClass('blur');
                $('.always-down').toggleClass('blur');
            });

            async function DeleteTarget(){

                const response = await fetch("/Target/DeleteTarget", {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: id
                    })
                });
                if (response.ok === true) { 
                    await LoadTargets();
                }
            };
        }
    });

    $('.button h2').click(function(){
        if(check){
            check = !check;

            $('.up-target').toggleClass('blur');
            $('.target-contents').toggleClass('blur');
            $('.always-down').toggleClass('blur');

            $('.form').append($(
                '<div class="target-form">'+
                    '<h2>Добавление цели</h2>'+
                    '<div class="date-pipckers">'+
                        '<div class="date1">'+
                            '<h3>&#160;С</h3>'+
                            '<input class="start-datetime" type="datetime-local">'+
                        '</div>'+
                        '<div class="date2">'+
                            '<h3>По</h3>'+
                            '<input class="end-datetime" type="datetime-local" disabled>'+
                        '</div>'+
                    '</div>'+
                    '<textarea class="text" placeholder="Напишите тут свою цель"></textarea>'+
                    '<div class="form-buttons">'+
                        '<div class = "add"><p>Добавить</p></div>'+
                        '<div class = "cancel"><p>Отмена</p></div>'+
                    '</div>'+
                '</div>'
            ));

            $('.start-datetime').change(function(event){
                $('.end-datetime').prop('disabled', false);
                $('.end-datetime').attr('min', $('.start-datetime').val());

                if(Date.parse( $('.end-datetime').val()) < Date.parse( $('.start-datetime').val()) && new Date( $('.end-datetime').val()).getTime() < new Date( $('.start-datetime').val()).getTime()){
                    $('.end-datetime').val($('.start-datetime').val());
                }

            });

            $('.end-datetime').change(function(event){
                if(Date.parse( $('.end-datetime').val()) < Date.parse( $('.start-datetime').val()) && new Date( $('.end-datetime').val()).getTime() < new Date( $('.start-datetime').val()).getTime()){
                    $('.end-datetime').val($('.start-datetime').val());
                }
            });

            $('.add').click( async function(){
                AddTarget();
            })

            $('.cancel').click(function(){
                check = !check;
                $('.target-form').remove();
                $('.up-target').toggleClass('blur');
                $('.target-contents').toggleClass('blur');
                $('.always-down').toggleClass('blur');
            });

            async function AddTarget(){

                dateTemp = new String($(".start-datetime").val().substr(0,10));
                timeStart = new String($(".start-datetime").val().substr(11));
                timeStart = timeStart + ':00'
                dateStart = dateTemp.slice(8, 10) + '.' + dateTemp.slice(5, 7) + '.' + dateTemp.slice(0, 4);

                datetime1 = dateStart + ' ' + timeStart;

                dateTemp = new String($(".end-datetime").val().substr(0,10));
                timeEnd = new String($(".end-datetime").val().substr(11));
                timeEnd = timeEnd + ':00'
                dateEnd = dateTemp.slice(8, 10) + '.' + dateTemp.slice(5, 7) + '.' + dateTemp.slice(0, 4);

                datetime2 = dateEnd + ' ' + timeEnd;

                text = $('.text').val();
    
                if(text != "" && datetime1 != "" && datetime2 != ""){
                    const response = await fetch("/Target/AddTarget", {
                        method: "Post",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            text: text,
                            dateTimeStart: datetime1,
                            dateTimeEnd: datetime2
                        })
                    });
                    if (response.ok === true) {
                        await LoadTargets();

                        check = !check;

                        $('.target-form').remove();
                        $('.up-target').toggleClass('blur');
                        $('.target-contents').toggleClass('blur');
                        $('.always-down').toggleClass('blur');
                    }
                }
                else{
                    alert("Запись не была добавленна! Проверьте все поля ввода!");
                }
            };
        }
    })
}

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