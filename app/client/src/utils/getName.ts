export const getName = (name: string) => {
    // Replace underscores with spaces
    let formattedName = name.replaceAll("_", " ");
  
    // Add spaces before numbers
    formattedName = formattedName.replace(/(\d+)/g, " $1");
  
    // Remove any potential double spaces created
    formattedName = formattedName.replace(/\s+/g, " ").trim();
  
    // Capitalize first letter
    return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
  };
  