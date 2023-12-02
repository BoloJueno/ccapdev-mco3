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


function relocate_usersResult()
{
    location.href = `user_results.html`;
}

var input = document.getElementById("searchInput");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchbtn").click();
    }
});