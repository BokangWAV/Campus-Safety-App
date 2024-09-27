import { GooglesignInUser, NormalRegisterUser, NormalSignInUser } from '../modules/users';
import { 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    GoogleAuthProvider 
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import '../modules/users'

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

    // Unit Tests
    test('GooglesignInUser should handle successful sign in', async () => {
        const mockUser = {
            uid: '12345',
            displayName: 'John Doe',
            email: 'john@example.com'
        };
        signInWithPopup.mockResolvedValueOnce({ user: mockUser });
        GoogleAuthProvider.credentialFromResult.mockReturnValueOnce({ accessToken: 'token' });

        await GooglesignInUser();

        expect(fetch).toHaveBeenCalledWith(
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

        const pTag = { innerText: '', className: '' }; // Mock pTag for error messages
        const result = await NormalRegisterUser('John', 'Doe', 'john@example.com', 'password', pTag);

        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledWith(
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

        const pTag = { innerText: '', className: '' };
        const result = await NormalSignInUser('john@example.com', 'password', pTag);

        expect(result).toBe(true);
        expect(pTag.innerText).toBe('');
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

    // Integration Tests
    test('GooglesignInUser should integrate correctly with Firebase and fetch', async () => {
        const mockUser = {
            uid: '12345',
            displayName: 'John Doe',
            email: 'john@example.com'
        };
        signInWithPopup.mockResolvedValueOnce({ user: mockUser });
        GoogleAuthProvider.credentialFromResult.mockReturnValueOnce({ accessToken: 'token' });

        await GooglesignInUser();

        expect(signInWithPopup).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith(
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

    test('NormalRegisterUser should integrate correctly with Firebase and fetch', async () => {
        const mockUser = {
            uid: '12345',
            email: 'john@example.com'
        };
        createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

        const pTag = { innerText: '', className: '' }; // Mock pTag for error messages
        const result = await NormalRegisterUser('John', 'Doe', 'john@example.com', 'password', pTag);

        expect(result).toBe(true);
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'password');
        expect(fetch).toHaveBeenCalledWith(
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

    test('NormalSignInUser should integrate correctly with Firebase', async () => {
        const mockUser = {
            uid: '12345',
            email: 'john@example.com'
        };
        signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

        const pTag = { innerText: '', className: '' };
        const result = await NormalSignInUser('john@example.com', 'password', pTag);

        expect(result).toBe(true);
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'john@example.com', 'password');
    });
});