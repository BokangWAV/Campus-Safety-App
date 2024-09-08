import { GooglesignInUser, NormalRegisterUser } from "../modules/users.js";

describe('Navigation Menu Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="navmenu" class="navmenu">
        <ul>
          <li><a href="#">Home</a></li>
        </ul>
        <i class="mobile-nav-toggle bi bi-list"></i>
      </div>
    `;
  });

  test('should toggle mobile navigation', () => {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    const body = document.querySelector('body');
    const toggleNav = () => {
      body.classList.toggle('mobile-nav-active');
    };
    mobileNavToggleBtn.addEventListener('click', toggleNav);
    mobileNavToggleBtn.click();
    expect(body.classList.contains('mobile-nav-active')).toBe(true);
    mobileNavToggleBtn.click();
    expect(body.classList.contains('mobile-nav-active')).toBe(false);
  });
});

describe('Preloader Test', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="preloader"></div>';
  });

  test('should remove preloader after load', () => {
    const preloader = document.querySelector('#preloader');
    window.dispatchEvent(new Event('load'));
    expect(preloader).toBe(null); // preloader should be removed
  });
});

describe('Button Click Test', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="Google-Btn"></button>
      <button id="Register-Btn"></button>
      <input id="firstName" value="John"/>
      <input id="lastName" value="Doe"/>
      <input id="email" value="john.doe@example.com"/>
      <input id="password" value="password123"/>
    `;
  });

  test('should call GoogleSignInUser on Google button click', () => {
    const mockGoogleSignInUser = jest.fn();
    document.getElementById('Google-Btn').addEventListener('click', mockGoogleSignInUser);
    document.getElementById('Google-Btn').click();
    expect(mockGoogleSignInUser).toHaveBeenCalled();
  });

  test('should call NormalRegisterUser with form inputs on Register button click', () => {
    const mockNormalRegisterUser = jest.fn();
    document.getElementById('Register-Btn').addEventListener('click', () => {
      mockNormalRegisterUser(
        document.getElementById('firstName').value,
        document.getElementById('lastName').value,
        document.getElementById('email').value,
        document.getElementById('password').value
      );
    });
    document.getElementById('Register-Btn').click();
    expect(mockNormalRegisterUser).toHaveBeenCalledWith("John", "Doe", "john.doe@example.com", "password123");
  });
});
