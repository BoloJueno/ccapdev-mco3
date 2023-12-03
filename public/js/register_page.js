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

document.getElementById('email').addEventListener("input", async function (e) {
  try {
      let emailValue = document.getElementById('email').value;
      console.log('Email changed. New value:', emailValue);

      $('#email').attr('class', 'form-input');
      $('#emailValidator').css('display', 'none');
      $('#emailValidator').css('cssText', 'display: none !important');
      $('#emailValidator2').css('display', 'none');
      $('#register-button').attr('class', 'btn btn-warning');

      const emailDomain = emailValue.split('@')[1];

      if (emailDomain && emailDomain.toLowerCase() !== 'dlsu.edu.ph') {
          console.log('Invalid DLSU email format.');

          $('#emailValidator2').css('display', 'block');
          $('#emailValidator2').css('cssText', 'display: block !important');
          $('#register-button').attr('class', 'btn btn-warning disabled');
      }

      const response = await fetch(`/checkemail?email=${emailValue}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      }).catch(error => console.error('Error during fetch:', error));

      console.log('Fetch request sent to the server.');

      if (response.ok) {
          const results = await response.json();
          console.log('Server response:', results);

          if (results.exists == '') {
              console.log('Email is available.');
              $('#email').attr('class', 'form-input');
              $('#emailValidator').css('display', 'none');
              $('#emailValidator').css('cssText', 'display: none !important');
          } else {
              console.log('Email is already taken.');
              $('#email').attr('class', 'form-input is-invalid');
              $('#emailValidator').css('display', 'block');
              $('#emailValidator').css('cssText', 'display: block !important');
              $('#register-button').attr('class', 'btn btn-warning disabled');
          }
      } else {
          console.error('Server returned an error:', response.status);
          console.error('Server response text:', await response.text());
      }
  } catch (error) {
      console.error('An error occurred:', error);
  }
});

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