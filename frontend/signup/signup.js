

document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const signupUsername = document.getElementById("signupUsername").value;
    const signupPassword = document.getElementById("signupPassword").value;

    try {
      let response = await fetch("http://localhost:3000/signup", {
        // Provide the relative URL for signup
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });
      response = await response.json();
      if (response.ok) {
        alert("Signup successful");
        // Optionally, you can automatically log in the user after signup
        handleSuccessfulAuthentication(response.token);
        window.location.href = "../login/login.html"; // Redirect to the dashboard upon successful signup
      } else {
        alert("Signup failed: " + response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while signing up");
    }
  });


  function handleSuccessfulAuthentication(token) {
    sessionStorage.setItem('token', token); // Store the token in sessionStorage
    console.log('Token stored successfully:', token);
}
