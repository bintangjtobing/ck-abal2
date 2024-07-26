document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#nameForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.querySelector("#nameInput").value;

    try {
      const response = await fetch(`/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameInput }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      displayKhodamName(data.khodamName);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  function displayKhodamName(khodamName) {
    const resultDiv = document.querySelector("#result");
    resultDiv.innerHTML = `
      <p><strong>Nama:</strong> ${khodamName.nama}</p>
      <p><strong>Tipe:</strong> ${khodamName.tipe}</p>
      <p><strong>Asal:</strong> ${khodamName.asal}</p>
    `;
  }
});
