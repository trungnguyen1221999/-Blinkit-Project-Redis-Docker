const saveUserLocalStorage = (userData: Record<string, any>) => {
  try {
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

export default saveUserLocalStorage;
