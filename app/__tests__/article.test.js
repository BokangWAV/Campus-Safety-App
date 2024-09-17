import { fetchData } from '../scripts/article'; // Adjust the path accordingly
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Mock Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js', () => ({
    initializeApp: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js', () => ({
    getAuth: jest.fn(() => ({})),
    GoogleAuthProvider: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    getDocs: jest.fn(() => Promise.resolve({
        empty: false,
        forEach: (callback) => {
            // Mock data for Firestore
            const mockData = [
                { id: '1', data: () => ({ title: 'Article 1', likes: 5 }) },
                { id: '2', data: () => ({ title: 'Article 2', likes: 10 }) }
            ];
            mockData.forEach(doc => callback(doc));
        }
    }))
}));

// Mock fetch for fetchData function
global.fetch = jest.fn(() => 
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ articles: [] }), // Simulate an empty article list
    })
);

describe('fetchData function', () => {
    test('should fetch data from the provided URL', async () => {
        const url = 'https://example.com/articles';
        const data = await fetchData(url);

        expect(fetch).toHaveBeenCalledWith(url);  // Check if fetch was called with the correct URL
        expect(data).toEqual({ articles: [] });  // Expect the mock response data
    });

    test('should handle fetch errors gracefully', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Fetch error'))
        );

        const url = 'https://example.com/articles';
        const data = await fetchData(url);

        expect(fetch).toHaveBeenCalledWith(url);
        expect(data).toBeUndefined();  // Should return undefined in case of an error
    });
});

describe('Firestore Articles Fetch', () => {
    test('should fetch articles from Firestore and sort them', async () => {
        const list = [];
        const articlesCollection = collection({}, "articles"); // Mock collection
        const querySnapshot = await getDocs(articlesCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            });
        }

        // Ensure articles are fetched and sorted correctly by likes
        expect(list).toHaveLength(2);
        expect(list[0].likes).toBeGreaterThanOrEqual(list[1].likes);  // Check if articles are sorted by likes
    });
});
