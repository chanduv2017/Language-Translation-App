document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      let response = await fetch("http://localhost:3000/login", {
        // Provide the relative URL for login
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      response = await response.json();
      if (response.ok) {
        handleSuccessfulAuthentication(response.token)
        console.log(response.message)
        alert("Login successful");
        window.location.href = "../main/index.html"; // Redirect to the dashboard upon successful login
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in");
    }
  });

  function handleSuccessfulAuthentication(token) {
    sessionStorage.setItem('token', token); // Store the token in sessionStorage
    console.log('Token stored successfully:', token);
}


document.getElementById("signupButton").addEventListener("click", function() {
  window.location.href = "../signup/signup.html";
});
