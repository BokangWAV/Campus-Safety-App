import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Mock Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js', () => ({
    initializeApp: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    getDocs: jest.fn(() => Promise.resolve({
        empty: false,
        forEach: (callback) => {
            // Mock data
            const mockData = [
                { id: '1', data: () => ({
                    title: 'Article 1',
                    name: 'John',
                    surname: 'Doe',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula.',
                    views: 100
                }) },
                { id: '2', data: () => ({
                    title: 'Article 2',
                    name: 'Jane',
                    surname: 'Smith',
                    content: 'Vestibulum et ultrices massa. Integer nec odio. Praesent libero.',
                    views: 200
                }) }
            ];
            mockData.forEach(doc => callback(doc));
        }
    }))
}));

// Import the script that contains the DOM manipulation and Firebase calls
import '../scripts/dashboard';  // Adjust the path as needed

describe('DOM and Firebase interactions', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should fetch articles and create DOM elements', async () => {
        const createArticles = require('../scripts/dashboard').createArticles;
        
        // Simulate DOMContentLoaded event
        document.dispatchEvent(new Event('DOMContentLoaded'));

        // Allow for async operations to complete
        await new Promise(process.nextTick);

        // Check if createArticles was called
        expect(createArticles).toHaveBeenCalledWith(
            expect.stringContaining('Article 1'),
            'John Doe',
            expect.stringContaining('Lorem ipsum dolor sit amet'),
            expect.stringContaining('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula.')
        );
        expect(createArticles).toHaveBeenCalledWith(
            expect.stringContaining('Article 2'),
            'Jane Smith',
            expect.stringContaining('Vestibulum et ultrices massa'),
            expect.stringContaining('Vestibulum et ultrices massa. Integer nec odio. Praesent libero.')
        );

        // Verify DOM content
        const dashboardContent = document.querySelector('.dashboard-content');
        expect(dashboardContent).not.toBeNull();
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        expect(dashboardCards).toHaveLength(2);
    });
});