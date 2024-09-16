import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from 'firebase-firestore';
import { getAuth, onAuthStateChanged } from 'firebase-auth';

// Import the actual implementation
import '../scripts/create'; // Adjust the path to the file containing your Firebase code

// Mock Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js', () => ({
    initializeApp: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js', () => ({
    getAuth: jest.fn(() => ({})),
    GoogleAuthProvider: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));

describe('Firebase Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('postArticles should add a document to Firestore', async () => {
    // Mock Firestore functions
    const mockAddDoc = addDoc.mockResolvedValue({ id: 'mockId' });
    const mockCollection = collection.mockReturnValue({});

    const data = {
      content: 'Sample content',
      title: 'Sample title',
      likes: 0,
      name: 'John',
      surname: 'Doe'
    };

    await postArticles(data);

    expect(collection).toHaveBeenCalledWith(db, 'articles');
    expect(addDoc).toHaveBeenCalledWith({}, data);
    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(mockAddDoc).resolves.toEqual({ id: 'mockId' });
  });

  test('onAuthStateChanged should set currentUserName and currentUserSurname correctly', () => {
    const mockOnAuthStateChanged = onAuthStateChanged.mockImplementation((auth, callback) => {
      const mockUser = {
        uid: '12345',
        email: 'john.doe@example.com',
        displayName: 'John Doe'
      };
      callback(mockUser);
    });

    require('../scripts/create'); // Re-import to trigger onAuthStateChanged

    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
    expect(currentUserName).toBe('John');
    expect(currentUserSurname).toBe('Doe');
  });

  test('onAuthStateChanged should handle case with no user signed in', () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    require('../scripts/create'); // Re-import to trigger onAuthStateChanged

    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
    expect(currentUserName).toBe('Unknown');
    expect(currentUserSurname).toBe('Unknown');
  });
});
