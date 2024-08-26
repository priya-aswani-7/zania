// This file provides a set of functions to interact with various endpoints of the API, such as fetching documents and updating documents on the server. The BASE_URL variable is used as the base URL for the API endpoints.

// Base URL for the API
const BASE_URL = "http://localhost:8000";

// Function to fetch documents from the server
export const fetchDocuments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/documents`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Function to update a document on the server
export const updateDocument = async (document) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/${document.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error updating document:", error);
  }
};
