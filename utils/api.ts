export const apiRequest = async (endpoint: string, method = "GET", body?: any) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
  
    const response = await fetch(`http://localhost:8080/api/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    });
  
    if (response.status === 401) {
      localStorage.removeItem("token"); // Remove expired token
      window.location.href = "/login"; // Redirect to login
    }
  
    return response.json();
  };
  