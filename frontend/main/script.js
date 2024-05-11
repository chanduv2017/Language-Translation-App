const apiUrl = "http://localhost:3000";

// Function to handle successful authentication and store the token
function logout() {
  
  sessionStorage.removeItem("token");
  
  window.location.href = "../login/login.html";
}

function translateText() {
  let inputText = document.getElementById("inputText").value;
  let sourceLang = document.getElementById("inputLanguage").value;
  let targetLang = document.getElementById("outputLanguage").value;
  // Make sure the user entered some text
  if (inputText.trim() === "") {
    alert("Please enter text to translate.");
    return;
  }

  const authToken = sessionStorage.getItem("token"); // Retrieve the token from sessionStorage

  // Check if the token exists
  if (!authToken) {
    alert("Authentication token not found. Please log in.");
    return;
  }

  fetch(apiUrl + "/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken, // Send the token in the Authorization header
    },
    body: JSON.stringify({
      inputText: inputText,
      sourceLang: sourceLang,
      targetLang: targetLang,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Assuming the response contains translated text in 'translated_text' field
      const translatedText = data.translatedText;

      // Display the translated text on the webpage
      const outputElement = document.getElementById("outputText");
      outputElement.textContent = translatedText;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while translating text.");
    });
}

function checkHistory() {
  const authToken = sessionStorage.getItem("token"); // Retrieve the token from sessionStorage
  console.log(authToken);
  // Check if the token exists
  if (!authToken) {
    alert("Authentication token not found. Please log in.");
    return;
  }
  fetch(apiUrl + "/checkHistory", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken, // Send the token in the Authorization header
    },
  })
    .then(async (response) => {
      // response=await response.json();
      //   if (!response.ok) {
      //     throw new Error("Network response was not ok");
      //   }
      return response.json();
    })
    .then((data) => {
      // Assuming the response contains translated text in 'translated_text' field
      const history = data.translationHistory;

      // Display the translated text on the webpage

      const translationsContainer = document.getElementById(
        "outputText"
      );
      translationsContainer.innerHTML = ""; // Clear previous content
      history.forEach((translation) => {
        const translationElement = document.createElement("div");
        translationElement.innerHTML = `
            <p>Input Text: ${translation.inputText}</p>
            <p>Translated Text: ${translation.translatedText}</p>
            <p>Source Language: ${translation.sourceLang}</p>
            <p>Target Language: ${translation.targetLang}</p>
            <p>Created At: ${new Date(
              translation.createdAt
            ).toLocaleString()}</p>
            <hr>
        `;
        translationsContainer.appendChild(translationElement);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while translating text.");
    });
}





let mediaRecorder;
let audioChunks = [];
let recordedAudioUrl;

const recordButton = document.getElementById("recordButton");
const stopButton = document.getElementById("stopButton");
const playButton = document.getElementById("playButton");
const sendButton = document.getElementById("sendButton");

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", playRecording);
sendButton.addEventListener("click", sendAudio);

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", function (event) {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", function () {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        recordedAudioUrl = URL.createObjectURL(audioBlob);

        // Enable stop, play, and send buttons
        stopButton.disabled = true;
        playButton.disabled = false;
        sendButton.disabled = false;
      });

      // Start recording
      mediaRecorder.start();

      // Disable record button, enable stop button
      recordButton.disabled = true;
      stopButton.disabled = false;
    })
    .catch(function (error) {
      console.error("Error accessing microphone:", error);
    });
}

function stopRecording() {
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
}

function playRecording() {
  const audio = new Audio(recordedAudioUrl);
  audio.play();
}

function sendAudio() {
  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
  const formData = new FormData();
  formData.append("audio", audioBlob);

  fetch("http://127.0.0.1:5000/speech-recognition", {  // Endpoint should match the backend route
      method: "POST",
      body: formData,
  })
  .then((response) => {
      // Check if response is successful
      if (response.ok) {
          return response.json(); // Parse response JSON
      } else {
          throw new Error("Audio upload failed");
      }
  })
  .then((data) => {
      console.log("Response:", data);
      
      // Reset recording
      audioChunks = [];
      recordedAudioUrl = null;
      playButton.disabled = true;
      sendButton.disabled = true;
      recordButton.disabled = false;
      outputText.innerHTML = "";
      let inputTextarea = document.getElementById("inputText");

      // Set the text content
      inputTextarea.value = data.inputText;
      translateText();
  })
  .catch((error) => console.error("Error:", error));
}
