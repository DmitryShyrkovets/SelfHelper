let loginform = document.querySelector('form.login-form')
let regform = document.querySelector('form.registration-form')
let recoveryform = document.querySelector('form.recovery-form')
let check

document.addEventListener("DOMContentLoaded", function () {
    check = document.querySelector('ul')
    if (check != null) {
        if (loginform != null) {
            loginform.style.height = '380px';
        }
        else if(regform != null) {
            regform.style.height = '445px';
        }
        else {
            recoveryform.style.height = '290px';
        }
    }
});