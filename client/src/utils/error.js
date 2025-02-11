export const handleAPIError = (error) => {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        console.error('Authentication error:', error.message);
        break;
      case 404:
        console.error('Resource not found:', error.message);
        break;
      default:
        console.error(`API Error (${error.status}):`, error.message);
    }
  } else {
    console.error('Unexpected error:', error.message);
  }
  
  // Optional: Show user-friendly message
  alert(`Error: ${error.message}`);
}; 