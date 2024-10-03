import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

// Import the actual implementation
import '../scripts/create'; // Adjust the path to the file containing your Firebase code

// Mock Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js', () => ({
    initializeApp: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    addDoc: jest.fn(() => Promise.resolve({ id: 'mockId' })),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
    getAuth: jest.fn(() => ({})),
    onAuthStateChanged: jest.fn(),
}));

describe('Firebase Functions', () => {
    let currentUserName, currentUserSurname, userUID;

    beforeEach(() => {
        jest.clearAllMocks();
        currentUserName = '';
        currentUserSurname = '';
        userUID = 0;
    });

    test('postArticles should add a document to Firestore', async () => {
        const mockAddDoc = addDoc.mockResolvedValue({ id: 'mockId' });
        const mockCollection = collection.mockReturnValue({});

        const data = {
            content: 'Sample content',
            title: 'Sample title',
            likes: 0,
            name: 'John',
            surname: 'Doe'
        };

        await postArticles(data.content, data.title, data.name, data.surname, userUID);

        expect(collection).toHaveBeenCalled();
        expect(addDoc).toHaveBeenCalledWith({}, data);
        expect(addDoc).toHaveBeenCalledTimes(1);
        await expect(mockAddDoc).resolves.toEqual({ id: 'mockId' });
    });

    test('onAuthStateChanged should set currentUserName and currentUserSurname correctly', () => {
        const mockUser = {
            uid: '12345',
            email: 'john.doe@example.com',
            displayName: 'John Doe'
        };

        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockUser);
        });

        require('../scripts/create'); // Re-import to trigger onAuthStateChanged

        expect(onAuthStateChanged).toHaveBeenCalledWith(getAuth(), expect.any(Function));
        expect(currentUserName).toBe('John');
        expect(currentUserSurname).toBe('Doe');
    });

    test('onAuthStateChanged should handle case with no user signed in', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(null);
        });

        require('../scripts/create'); // Re-import to trigger onAuthStateChanged

        expect(onAuthStateChanged).toHaveBeenCalledWith(getAuth(), expect.any(Function));
        expect(currentUserName).toBe('Unknown');
        expect(currentUserSurname).toBe('Unknown');
    });

    test('DOMContentLoaded should handle article submission when user is logged in', async () => {
        document.body.innerHTML = `
            <form id="articleForm">
                <input id="articleTitle" value="Sample Title" />
                <textarea id="articleContent">Sample Content</textarea>
                <button id="post">Post</button>
            </form>
        `;

        currentUserName = 'John';
        currentUserSurname = 'Doe';
        userUID = '12345';

        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
        });

        global.fetch = mockFetch;

        require('../scripts/create'); // Re-import to trigger event listener

        const form = document.getElementById('articleForm');
        await form.dispatchEvent(new Event('submit'));

        expect(mockFetch).toHaveBeenCalledWith(`https://sdp-campus-safety.azurewebsites.net/articles/${userUID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: 'Sample Content',
                surname: 'Doe',
                name: 'John',
                title: 'Sample Title'
            })
        });
        expect(alert).toHaveBeenCalledWith("Article successfully posted!!!");
    });

    test('DOMContentLoaded should alert user if not logged in', async () => {
        document.body.innerHTML = `
            <form id="articleForm">
                <input id="articleTitle" value="Sample Title" />
                <textarea id="articleContent">Sample Content</textarea>
                <button id="post">Post</button>
            </form>
        `;

        currentUserName = '';
        currentUserSurname = 'Doe';
        userUID = 0;

        require('../scripts/create'); // Re-import to trigger event listener

        const form = document.getElementById('articleForm');
        await form.dispatchEvent(new Event('submit'));

        expect(alert).toHaveBeenCalledWith("You must be logged in to post an article.");
    });

    test('postArticles should handle fetch errors', async () => {
        const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
        global.fetch = mockFetch;

        await expect(postArticles('Sample Content', 'Sample Title', 'John', 'Doe', userUID)).rejects.toThrow('Network error');
    });
});
