import { createArticles, fetchData, likeArticle } from '../scripts/article'; // Adjust the import path accordingly

describe('Article Functions', () => {
    beforeEach(() => {
        document.body.innerHTML = ''; // Clear the DOM before each test
        jest.resetAllMocks(); // Reset mocks before each test
    });

    describe('createArticles function', () => {
        test('should create article elements correctly', () => {
            const title = "Test Article";
            const author = "John Doe";
            const subtext = "This is a short summary";
            const fullText = "This is the full content of the article.";
            const articleId = 1;

            createArticles(title, author, subtext, fullText, articleId);

            const dashboardContent = document.querySelector('.dashboard-content');
            expect(dashboardContent).toBeInTheDocument(); // Check if the content is created
            expect(dashboardContent.querySelector('h3').innerHTML).toBe(title); // Check the title
            expect(dashboardContent.querySelector('p').textContent).toBe(author); // Check the author
            expect(dashboardContent.querySelector('#read').textContent).toContain(subtext); // Check the subtext
        });

        test('should handle empty article data gracefully', () => {
            createArticles("", "", "", "", 1); // Pass empty strings

            const dashboardContent = document.querySelector('.dashboard-content');
            expect(dashboardContent).toBeInTheDocument(); // Ensure the content is created
            expect(dashboardContent.querySelector('h3').innerHTML).toBe(""); // Title should be empty
            expect(dashboardContent.querySelector('p').textContent).toBe(""); // Author should be empty
        });
    });

    describe('fetchData function', () => {
        test('should fetch articles and create them', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ title: 'Article 1', likes: 1, name: 'John', surname: 'Doe', content: 'Test content', articleID: 1 }]),
                })
            );

            await fetchData(); // Call fetchData to simulate fetching articles

            const articleElement = document.querySelector('.dashboard-content');
            expect(articleElement).toBeInTheDocument();
            expect(articleElement.querySelector('h3').innerHTML).toBe('Article 1');
        });

        test('should handle fetch error gracefully', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                })
            );

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Mock console.error
            await fetchData();

            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch articles'); // Check if the error message was logged
            consoleSpy.mockRestore(); // Restore the original console.error
        });
    });

    describe('likeArticle function', () => {
        test('should update the like button state on click', async () => {
            const articleId = 1;
            const likeButton = document.createElement('button');
            likeButton.id = 'like';
            likeButton.textContent = 'LIKE';
            likeButton.onclick = () => likeArticle(articleId, likeButton);
            document.body.appendChild(likeButton);

            // Mock the fetch response
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                })
            );

            likeButton.click(); // Simulate a click

            expect(likeButton.disabled).toBe(true); // Check if button is disabled
            expect(likeButton.textContent).toBe("LIKED"); // Check if the text has changed
            expect(likeButton.style.backgroundColor).toBe("rgb(238, 241, 0)"); // Check background color change
        });

        test('should handle like error gracefully', async () => {
            const articleId = 1;
            const likeButton = document.createElement('button');
            likeButton.id = 'like';
            likeButton.textContent = 'LIKE';
            likeButton.onclick = () => likeArticle(articleId, likeButton);
            document.body.appendChild(likeButton);

            // Mock the fetch response to simulate an error
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                })
            );

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Mock console.error
            likeButton.click(); // Simulate a click

            expect(consoleSpy).toHaveBeenCalledWith('Failed to like the article'); // Check if the error message was logged
            consoleSpy.mockRestore(); // Restore the original console.error
        });
    });

    describe('Auth state handling', () => {
        test('should create articles when user is authenticated', async () => {
            const user = { uid: "12345", email: "test@example.com", displayName: "John Doe" };

            onAuthStateChanged(auth, jest.fn((callback) => callback(user))); // Mock the user callback

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ title: 'Article 1', likes: 1, name: 'John', surname: 'Doe', content: 'Test content', articleID: 1 }]),
                })
            );

            await fetchData(); // Call fetchData to simulate fetching articles

            const articleElement = document.querySelector('.dashboard-content');
            expect(articleElement).toBeInTheDocument();
            expect(articleElement.querySelector('h3').innerHTML).toBe('Article 1');
        });

        test('should redirect to register page when no user is signed in', async () => {
            onAuthStateChanged(auth, jest.fn((callback) => callback(null))); // Mock no user

            // Call the function that checks auth state
            await someFunctionThatChecksAuthState(); // Replace with actual function that checks authentication

            expect(window.location.href).toBe("https://agreeable-forest-0b968ac03.5.azurestaticapps.net/register.html"); // Verify redirection
        });
    });
});
