

export function getInitials(fullName) {
    if (!fullName || typeof fullName !== "string") {
      return ""; // Return empty string if input is invalid
    }
  
    const names = fullName
      .trim() // Remove extra spaces
      .split(" ")
      .filter((name) => name); // Filter out empty strings caused by multiple spaces
  
    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
  
    return initials.join(""); // Join initials into a string
  }
  