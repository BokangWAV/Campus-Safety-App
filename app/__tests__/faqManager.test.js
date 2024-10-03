// faqManager.test.js

// Import the function that fetches FAQs
import { fetchData } from '../scripts/faqManager'; // Update the import path according to your setup

// Mock the global fetch function before each test
beforeEach(() => {
    jest.resetAllMocks();  // Clears mock data before each test
});

// Test: Successful fetchData function call
test('fetchData returns data on successful fetch', async () => {
    const mockData = [{ FAQID: 1, question: 'Test Question', answer: 'Test Answer', status: 'approved' }];
    
    // Mock the fetch response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
        })
    );

    // Call the fetchData function
    const data = await fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://sdp-campus-safety.azurewebsites.net/FAQs');
});

// Test: fetchData throws an error on failed fetch
test('fetchData throws an error on unsuccessful fetch', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        })
    );

    // Expect the fetchData function to throw an error
    await expect(fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs')).rejects.toThrow('HTTP error! Status: 404');
});

// Test: Displays FAQs based on status
test('displays FAQs based on status', async () => {
    const mockData = [
        { FAQID: 1, question: 'Pending Question 1', status: 'pending' },
        { FAQID: 2, question: 'Approved Question 1', answer: 'Approved Answer 1', status: 'approved' }
    ];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
        })
    );

    // Set up a basic DOM structure
    document.body.innerHTML = `
        <div class="main-container">
            <div class="pendingFAQ"></div>
            <div class="approvedCards"></div>
            <div id="preloader"></div>
        </div>
    `;

    // Fetch FAQs and render them (implement rendering logic in your code)
    const faqs = await fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs');
    faqs.forEach(faq => {
        if (faq.status === 'pending') {
            const pendingDiv = document.createElement('div');
            pendingDiv.textContent = faq.question;
            document.querySelector('.pendingFAQ').appendChild(pendingDiv);
        } else if (faq.status === 'approved') {
            const approvedDiv = document.createElement('div');
            approvedDiv.innerHTML = `<p>${faq.question}</p><p>${faq.answer}</p>`;
            document.querySelector('.approvedCards').appendChild(approvedDiv);
        }
    });

    // Test pending FAQ display
    const pendingFAQ = document.querySelector('.pendingFAQ');
    expect(pendingFAQ.children.length).toBe(1);
    expect(pendingFAQ.children[0].textContent).toBe('Pending Question 1');

    // Test approved FAQ display
    const approvedFAQ = document.querySelector('.approvedCards');
    expect(approvedFAQ.children.length).toBe(1);
    expect(approvedFAQ.children[0].querySelector('p').textContent).toBe('Approved Question 1');
    expect(approvedFAQ.children[0].querySelectorAll('p')[1].textContent).toBe('Approved Answer 1');
});

// Test: Handles delete button click
test('handles delete button click', async () => {
    const mockData = [{ FAQID: 1, question: 'Question to be deleted', status: 'approved', answer: 'Answer' }];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
        })
    );

    // Set up the DOM
    document.body.innerHTML = `
        <div class="approvedCards">
            <div class="faqCard" data-id="1">
                <p>Question to be deleted</p>
                <button id="delete">Delete</button>
            </div>
        </div>
    `;

    // Simulate loading of FAQs
    const faqs = await fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs');
    const faqCard = document.querySelector('.faqCard');
    faqCard.dataset.id = faqs[0].FAQID; // Set the data-id to the mock FAQ ID

    // Simulate delete button click
    const deleteButton = document.querySelector('#delete');
    deleteButton.addEventListener('click', async () => {
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ/${faqCard.dataset.id}`, { method: 'DELETE' });
        if (response.ok) {
            faqCard.remove(); // Remove from DOM on successful delete
        }
    });

    deleteButton.click(); // Trigger the delete action

    // Expect the delete fetch request to be made with the correct URL and method
    expect(fetch).toHaveBeenCalledWith('https://sdp-campus-safety.azurewebsites.net/FAQ/1', { method: 'DELETE' });
});

// Test: Handles approve button click
test('handles approve button click', async () => {
    const mockData = [{ FAQID: 1, question: 'Question to be approved', status: 'pending' }];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
        })
    );

    // Set up the DOM structure
    document.body.innerHTML = `
        <div class="pendingFAQ">
            <div class="faqCard" data-id="1">
                <p>Question to be approved</p>
                <button id="approve">Approve</button>
            </div>
        </div>
    `;

    // Simulate loading of FAQs
    const faqs = await fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs');
    const faqCard = document.querySelector('.faqCard');
    faqCard.dataset.id = faqs[0].FAQID; // Set the data-id to the mock FAQ ID

    // Simulate approve button click
    const approveButton = document.querySelector('#approve');
    approveButton.addEventListener('click', async () => {
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ/${faqCard.dataset.id}`, { method: 'PUT' });
        if (response.ok) {
            faqCard.querySelector('p').textContent += ' (Approved)'; // Change text to indicate approval
        }
    });

    approveButton.click(); // Trigger the approve action

    // Expect the approve fetch request to be made with the correct URL and method
    expect(fetch).toHaveBeenCalledWith('https://sdp-campus-safety.azurewebsites.net/FAQ/1', { method: 'PUT' });
});

// Test: Fetches FAQs but with empty response
test('handles empty FAQ list', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]), // No FAQs in response
        })
    );

    document.body.innerHTML = `
        <div class="main-container">
            <div class="pendingFAQ"></div>
            <div class="approvedCards"></div>
            <div id="preloader"></div>
        </div>
    `;

    // Call the function to fetch FAQs
    const faqs = await fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs');
    
    // No rendering logic since faqs is empty
    expect(faqs.length).toBe(0);
    expect(document.querySelector('.pendingFAQ').children.length).toBe(0);
    expect(document.querySelector('.approvedCards').children.length).toBe(0);
});
