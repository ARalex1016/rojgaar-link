// Password validator using regex
export const passwordValidator = (password) => {
  // Regular expression to check password strength
  // At least one lowercase letter, one uppercase letter, one digit, and between 8-20 characters
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  return passwordRegex.test(password);
};

// Email validator using regex
export const emailValidator = (email) => {
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

// Validation function
export const handlePasswordValidation = (userData, setMessage) => {
  const { name, email, password, confirmPassword } = userData;

  if (!name) {
    setMessage("Name is required");
    return false;
  }

  if (!email) {
    setMessage("Email is required");
    return false;
  }

  if (!password) {
    setMessage("Password is required");
    return false;
  }

  if (password.length < 8) {
    setMessage("Password must be at least 8 characters");
    return false;
  }

  if (password.length > 20) {
    setMessage("Password mustn't be more than 20 characters");
    return false;
  }

  if (!passwordValidator(password)) {
    setMessage(
      "Password must include at least one lowercase letter, one uppercase letter, and one digit"
    );
    return false;
  }

  if (!confirmPassword) {
    setMessage("Confirm Password is required");
    return false;
  }

  if (password !== confirmPassword) {
    setMessage("Password does not match");
    return false;
  }

  setMessage(""); // Clear the message if validation passes
  return true;
};

export const capitalize = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
