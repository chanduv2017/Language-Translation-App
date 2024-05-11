async function translateText(inputText, sourceLang, targetLang) {
  const apiUrl = "http://127.0.0.1:5000/translate";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputText: inputText,
        sourceLang: sourceLang,
        targetLang: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
module.exports =translateText;

