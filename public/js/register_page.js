function togglePass() {
    var input = document.getElementById("password");
    var toggleButton = document.getElementById("field-icon");

    if(input.type === "password") {
      input.type = "text";
      toggleButton.innerHTML = '<i class="fa fa-eye"></i>'
    } else {
      input.type = "password";
      toggleButton.innerHTML = '<i class="fa fa-eye-slash"></i>'
    }
  }

function togglePass2() {
    var input = document.getElementById("verifyPassword");
    var toggleButton = document.getElementById("field-icon2");

    if(input.type === "password") {
      input.type = "text";
    toggleButton.innerHTML = '<i class="fa fa-eye"></i>'
    } else {
    input.type = "password";
    toggleButton.innerHTML = '<i class="fa fa-eye-slash"></i>'
    }
}

var password = document.getElementById("password"), 
    confirm_password = document.getElementById("verifyPassword");

function validatePassword(){
  if(password.value != verifyPassword.value) {
    verifyPassword.setCustomValidity("Passwords Don't Match");
  } else {
    verifyPassword.setCustomValidity('');
  }
}

password.onchange = validatePassword;
verifyPassword.onkeyup = validatePassword;