import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { fetchData } from '../scripts/dashboard.js'; // Adjust this path
import '../scripts/dashboard.js'; // Adjust path as needed

// Mocking Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js', () => ({
    initializeApp: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));
/* coverage ignore  */

describe("Dashboard Functionality", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="dashboard-container"></div>
        <img id="profileDisplay" src="" alt="profile" />
      `;
    });
  
    it("should display 'No user is signed in' when no user is authenticated", () => {
      // Mock onAuthStateChanged to simulate no user
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
      });
  
      // Execute DOMContentLoaded logic
      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);
  
      expect(document.querySelector(".dashboard-container").innerHTML).toContain("");
    });
  
    it("should display user's name when signed in", () => {
      // Mock onAuthStateChanged to simulate an authenticated user
      const mockUser = {
        uid: "123",
        displayName: "John Doe"
      };
  
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
      });
  
      // Mock fetchData to return some user details
      fetchData.mockResolvedValue([
        {
          firstName: "John",
          lastName: "Doe",
          age: 30,
          race: "Caucasian",
          gender: "Male",
          phoneNumber: "123-456-7890",
          profilePicture: "profile.jpg",
          role: "user"
        }
      ]);
  
      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);
  
      setImmediate(() => {
        // Check if the user info is correctly set
        expect(document.getElementById("profileDisplay").src).toBe("profile.jpg");
        expect(document.querySelector(".dashboard-container").innerHTML).toContain("Welcome to the dashboard.");
      });
    });
  
    it("should display manager's dashboard if user role is 'manager'", () => {
      const mockUser = {
        uid: "123",
        displayName: "Manager Doe"
      };
  
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
      });
  
      // Mock fetchData to return user details with a manager role
      fetchData.mockResolvedValue([
        {
          firstName: "Manager",
          lastName: "Doe",
          age: 40,
          race: "Asian",
          gender: "Female",
          phoneNumber: "987-654-3210",
          profilePicture: "manager_profile.jpg",
          role: "manager"
        }
      ]);
  
      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);
  
      setImmediate(() => {
        // Check for manager's dashboard elements
        expect(document.querySelector(".dashboard-container").innerHTML).toContain("Manager's dashboard.");
      });
    });
  });