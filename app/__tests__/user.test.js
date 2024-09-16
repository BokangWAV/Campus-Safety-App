import { GooglesignInUser, NormalRegisterUser, NormalSignInUser } from '../modules/users';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js', () => ({
  signInWithPopup: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: {
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
  }
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('Firebase Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('GooglesignInUser should handle successful sign in', async () => {
    const mockUser = {
      uid: '12345',
      displayName: 'John Doe',
      email: 'john@example.com'
    };
    signInWithPopup.mockResolvedValueOnce({ user: mockUser });
    GoogleAuthProvider.credentialFromResult.mockReturnValueOnce({ accessToken: 'token' });

    const fetchMock = jest.fn().mockResolvedValueOnce({});
    global.fetch = fetchMock;

    await GooglesignInUser();

    expect(fetchMock).toHaveBeenCalledWith(
      `http://sdp-campus-safety.azurewebsites.net/users/${mockUser.uid}`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: mockUser.email,
          firstName: 'John',
          lastName: 'Doe'
        }),
      })
    );
  });

  test('NormalRegisterUser should handle successful registration', async () => {
    const mockUser = {
      uid: '12345',
      email: 'john@example.com'
    };
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

    const fetchMock = jest.fn().mockResolvedValueOnce({});
    global.fetch = fetchMock;

    const result = await NormalRegisterUser('John', 'Doe', 'john@example.com', 'password', { innerText: '', className: '' });

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      `http://sdp-campus-safety.azurewebsites.net/users/${mockUser.uid}`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: mockUser.email,
          firstName: 'John',
          lastName: 'Doe'
        }),
      })
    );
  });

  test('NormalSignInUser should handle successful sign in', async () => {
    const mockUser = {
      uid: '12345',
      email: 'john@example.com'
    };
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

    const result = await NormalSignInUser('john@example.com', 'password', { innerText: '', className: '' });

    expect(result).toBe(true);
  });

  test('NormalRegisterUser should handle registration error', async () => {
    const errorMessage = 'Error registering user';
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage));

    const pTag = { innerText: '', className: '' };
    const result = await NormalRegisterUser('John', 'Doe', 'john@example.com', 'password', pTag);

    expect(result).toBe(false);
    expect(pTag.innerText).toBe('Invalid Details');
  });

  test('NormalSignInUser should handle sign-in error', async () => {
    const errorMessage = 'Error signing in';
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMessage));

    const pTag = { innerText: '', className: '' };
    const result = await NormalSignInUser('john@example.com', 'password', pTag);

    expect(result).toBe(false);
    expect(pTag.innerText).toBe('Invalid email/password');
  });
});
