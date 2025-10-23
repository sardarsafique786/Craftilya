function togglePassword(id, toggleElement) {
    const field = document.getElementById(id);
    if (field.type === "password") {
      field.type = "text";
      toggleElement.textContent = "Hide";
    } else {
      field.type = "password";
      toggleElement.textContent = "Show";
    }
  }
  
  function toggleForms() {
    document.getElementById("loginForm").classList.toggle("hidden");
    document.getElementById("signupForm").classList.toggle("hidden");
  }
  
  // Validation helpers
  function showError(input, message) {
    const error = input.parentElement.querySelector(".error");
    if (error) error.textContent = message;
  }
  function clearError(input) {
    const error = input.parentElement.querySelector(".error");
    if (error) error.textContent = "";
  }
  
  // Email validation
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // Password strength
  function checkStrength(password) {
    const bar = document.getElementById("strengthBar");
    bar.className = "";
    if (password.length < 8) return;
    let strength = 0;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
  
    if (strength <= 2) {
      bar.classList.add("fill-weak");
    } else if (strength === 3) {
      bar.classList.add("fill-medium");
    } else {
      bar.classList.add("fill-strong");
    }
  }
  
  // Attach events
  document.getElementById("signupPassword").addEventListener("input", (e) => {
    checkStrength(e.target.value);
  });
  
  document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
  
    const name = document.getElementById("fullName");
    const email = document.getElementById("signupEmail");
    const phone = document.getElementById("phoneNumber");
    const password = document.getElementById("signupPassword");
    const confirm = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");
  
    if (name.value.trim() === "") {
      showError(name, "Full name is required");
      valid = false;
    } else clearError(name);
  
    if (!isValidEmail(email.value)) {
      showError(email, "Enter a valid email");
      valid = false;
    } else clearError(email);
  
    if (!/^[0-9]{10}$/.test(phone.value)) {
      showError(phone, "Enter a valid 10-digit phone number");
      valid = false;
    } else clearError(phone);
  
    if (password.value.length < 8) {
      showError(password, "Password must be at least 8 characters");
      valid = false;
    } else clearError(password);
  
    if (password.value !== confirm.value) {
      showError(confirm, "Passwords do not match");
      valid = false;
    } else clearError(confirm);
  
    if (!terms.checked) {
      showError(terms, "You must agree to the terms");
      valid = false;
    } else clearError(terms);
  
    if (valid) {
      alert("Sign-up successful ✅ (Backend integration needed)");
    }
  });
  
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
  
    if (email.value.trim() === "" || password.value.trim() === "") {
      alert("Please fill in all fields");
      return;
    }
    alert("Login successful ✅ (Backend integration needed)");
  });
  
