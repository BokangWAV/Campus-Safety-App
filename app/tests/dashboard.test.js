import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Sample code to simulate the HTML structure
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>User Dashboard - Campus Safety App</title>
  <link href="/styles/dashboard.css" rel="stylesheet">
</head>
<body>
  <div class="header">
    <h2>Campus Safety</h2>
    <div class="mobile-nav-toggle" onclick="toggleMobileMenu()">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <ul id="headerMenu">
      <li><a class="active">Dashboard</a></li>
      <li><a href="alerts.html">Emergency Alerts</a></li>
      <li><a href="report.html">Report an Incident</a></li>
      <li><a href="article.html">Articles</a></li>
      <li><a href="request.html">Requests</a></li>
      <li><a href="contact.html">Contact Security</a></li>
    </ul>
    <div class="dropdown-menu" id="dropdownMenu">
      <ul>
        <li><a href="item1.html">Item 1</a></li>
        <li><a href="item2.html">Item 2</a></li>
        <li><a href="item3.html">Item 3</a></li>
      </ul>
    </div>
  </div>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Welcome to the Dashboard</h1>
      <p>Manage your safety and stay informed.</p>
    </div>
    <div class="dashboard-content">
      <div class="dashboard-card">
        <h3>Type 1 Alerts</h3>
        <p>Trigger immediate alerts for emergencies requiring attention.</p>
        <a href="#" onclick="triggerAlert('Type 1')">Trigger Alert</a>
      </div>
      <div class="dashboard-card">
        <h3>Type 2 Alerts</h3>
        <p>Notify users of location-based threats like fires and storms.</p>
        <a href="#" onclick="triggerAlert('Type 2')">Trigger Alert</a>
      </div>
      <div class="dashboard-card">
        <h3>Type 3 Alerts</h3>
        <p>Inform users about non-emergency safety issues.</p>
        <a href="#" onclick="triggerAlert('Type 3')">Trigger Alert</a>
      </div>
      <div class="dashboard-card">
        <h3>Emergency Alerts</h3>
        <p>Stay updated on campus alerts.</p>
        <a href="alerts.html">View Alerts</a>
      </div>
      <div class="dashboard-card">
        <h3>Report an Incident</h3>
        <p>Quickly report any safety issues.</p>
        <a href="report.html">Report Now</a>
      </div>
      <div class="dashboard-card">
        <h3>Safety Resources</h3>
        <p>Access emergency contacts and tips.</p>
        <a href="resources.html">View Resources</a>
      </div>
    </div>
  </div>
  <script>
    function toggleMobileMenu() {
        const menu = document.getElementById('headerMenu');
        menu.classList.toggle('active');
    }
    
    function toggleDropdown() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        dropdownMenu.classList.toggle('active');
    }
    
    function triggerAlert(type) {
        alert(type + " Alert triggered!");
    }
  </script>
</body>
</html>
`;

// A mock function for alert
global.alert = jest.fn();

describe('Dashboard Page Tests', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = htmlContent;
  });

  test('should toggle mobile navigation menu', () => {
    const mobileNavToggle = screen.getByText(/Campus Safety/i).closest('div.mobile-nav-toggle');
    fireEvent.click(mobileNavToggle);
    expect(document.getElementById('headerMenu')).toHaveClass('active');
    fireEvent.click(mobileNavToggle);
    expect(document.getElementById('headerMenu')).not.toHaveClass('active');
  });

  test('should trigger Type 1 alert', () => {
    const triggerButton = screen.getByText(/Trigger Alert/i, {selector: 'a'});
    fireEvent.click(triggerButton);
    expect(global.alert).toHaveBeenCalledWith('Type 1 Alert triggered!');
  });

  test('should trigger Type 2 alert', () => {
    const triggerButton = screen.getAllByText(/Trigger Alert/i)[1];
    fireEvent.click(triggerButton);
    expect(global.alert).toHaveBeenCalledWith('Type 2 Alert triggered!');
  });

  test('should trigger Type 3 alert', () => {
    const triggerButton = screen.getAllByText(/Trigger Alert/i)[2];
    fireEvent.click(triggerButton);
    expect(global.alert).toHaveBeenCalledWith('Type 3 Alert triggered!');
  });

  test('should remove preloader after load', () => {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    document.body.appendChild(preloader);

    // Simulate load event
    window.dispatchEvent(new Event('load'));

    expect(document.querySelector('#preloader')).toBe(null); // Adjust this line if your implementation removes the preloader differently
  });
});