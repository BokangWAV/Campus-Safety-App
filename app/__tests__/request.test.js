// request.test.js
const { fetchData, addCard } = require('../scripts/request'); // Adjust the path as needed

// Mocking the fetch API
global.fetch = jest.fn();

describe('fetchData', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data successfully', async () => {
        const mockData = [{ title: 'Test Title', content: 'Test Content', articleID: '1', status: 'pending' }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockData)
        });

        const data = await fetchData('https://sdp-campus-safety.azurewebsites.net/articles');
        expect(data).toEqual(mockData);
    });

    it('should handle fetch error', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        console.error = jest.fn(); // Mock console.error
        const data = await fetchData('https://sdp-campus-safety.azurewebsites.net/articles');
        
        expect(console.error).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
        expect(data).toBeUndefined();
    });
});

describe('addCard', () => {
    it('should create a card element with the correct content', () => {
        const articleTitle = 'Sample Title';
        const articleContent = 'Sample Content';
        const articleID = '123';
        const articleStatus = 'pending';
        
        const card = addCard(articleTitle, articleContent, articleID, articleStatus);
        
        expect(card).toBeInstanceOf(HTMLElement);
        expect(card.querySelector('h3').textContent).toBe(articleTitle);
        expect(card.querySelector('p').textContent).toBe(articleContent);
        expect(card.querySelector('#btnDelete').dataset.articleID).toBe(articleID);
        expect(card.querySelector('#btnApprove').dataset.articleID).toBe(articleID);
    });

    it('should hide the approve button if the article is approved', () => {
        const card = addCard('Approved Title', 'Approved Content', '456', 'approved');
        
        expect(card.querySelector('#btnApprove').style.display).toBe('none');
    });

    it('should not hide the approve button if the article is pending', () => {
        const card = addCard('Pending Title', 'Pending Content', '789', 'pending');
        
        expect(card.querySelector('#btnApprove').style.display).not.toBe('none');
    });
});

// More tests can be added for event listeners and other functionalities
