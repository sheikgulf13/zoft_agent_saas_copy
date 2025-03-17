export const downloadArrayAsTxt = (chatArray, filename = "chat_history.txt") => {
  // Function to replace <br> with new lines and remove other HTML tags
  const stripHtmlTags = (html) => {
    return new DOMParser()
      .parseFromString(html.replace(/<br\s*\/?>/gi, "\n"), "text/html") // Replace <br> with \n
      .body.textContent || "";
  };

  // Convert each chat object to a readable format
  const textContent = chatArray
    .map((chat) => `${chat.type.toUpperCase()}: ${stripHtmlTags(chat.message)}`)
    .join("\n\n"); // Adds spacing between messages

  // Create a Blob with text content
  const blob = new Blob([textContent], { type: "text/plain" });

  // Create a temporary anchor element
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;

  // Append, click, and remove the element to trigger download
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
  