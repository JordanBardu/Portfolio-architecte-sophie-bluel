document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  logIn();
});

const handleConnection = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  } catch (error) {
    handleLoginErrors(error.message);
  }
};

const handleLoginErrors = (error) => {
  const formContainer = document.querySelector(".form-container");
  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");

  if (error === "401") {
    errorMessage.textContent = "Mot de passe incorrect";
  } else if (error === "404") {
    errorMessage.textContent = "Email incorrect";
  }

  formContainer.appendChild(errorMessage);
};

const logIn = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("password").value;

  const result = await handleConnection(email, password);

  if (result) {
    localStorage.setItem("token", result.token);
    window.location.href = "index.html";
  }
};
