export const passwordValidator = (password) => {
  // Regular expression to check the password criteria
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  // Test the password against the regex
  return passwordRegex.test(password);
};
