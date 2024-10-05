import { fetchData, postFAQ, addCard, disableButton, enableButton } from '../scripts/faq'; // Adjust the import path accordingly

describe('FAQ Functions', () => {
    beforeEach(() => {
        document.body.innerHTML = ''; // Clear the DOM before each test
        jest.resetAllMocks(); // Reset mocks before each test
    });

    describe('fetchData function', () => {
        test('should fetch data successfully', async () => {
            // Mocking the fetch API
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ question: 'What is safety?', answer: 'Safety is important.', status: 'display' }]),
                })
            );

            const data = await fetchData('https://example.com/faq');

            expect(data).toEqual([{ question: 'What is safety?', answer: 'Safety is important.', status: 'display' }]);
            expect(fetch).toHaveBeenCalledWith('https://example.com/faq'); // Check if fetch was called with correct URL
        });

        test('should handle fetch error', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 404,
                })
            );

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Mock console.error
            const data = await fetchData('https://example.com/faq');

            expect(data).toBeUndefined(); // Expect fetchData to return undefined on error
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error)); // Ensure an error is logged
            consoleSpy.mockRestore(); // Restore the original console.error
        });
    });

    describe('addCard function', () => {
        test('should add a FAQ card to the DOM', () => {
            const question = 'What is safety?';
            const answer = 'Safety is important.';
            const index = 0;

            addCard(question, answer, index);

            const card = document.querySelector('#card');
            expect(card).toBeInTheDocument(); // Check if the card is added to the document
            expect(card.innerHTML).toContain(question); // Check if the question is displayed
            expect(card.innerHTML).toContain(answer); // Check if the answer is displayed
        });
    });

    describe('postFAQ function', () => {
        test('should post FAQ successfully', async () => {
            const data = { question: 'What is safety?' };
            const userUID = 'user123';

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                })
            );

            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(); // Mock window.alert
            await postFAQ(data, userUID);

            expect(fetch).toHaveBeenCalledWith(`https://sdp-campus-safety.azurewebsites.net/FAQ`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }); // Check if fetch was called with correct arguments
            expect(alertSpy).toHaveBeenCalledWith("FAQ posted!"); // Check if alert was called
            alertSpy.mockRestore(); // Restore the original alert
        });

        test('should handle post error', async () => {
            const data = { question: 'What is safety?' };
            const userUID = 'user123';

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                })
            );

            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(); // Mock window.alert
            await postFAQ(data, userUID);

            expect(alertSpy).toHaveBeenCalledWith("Error posting FAQ. Please try again."); // Check if alert for error was called
            alertSpy.mockRestore(); // Restore the original alert
        });
    });

    describe('Button State Functions', () => {
        test('disableButton should disable the button', () => {
            const button = document.createElement('button');
            button.id = 'submission';
            document.body.appendChild(button);

            disableButton();

            expect(button.disabled).toBe(true); // Check if button is disabled
            expect(button.innerHTML).toBe("Posted!"); // Check if button text is changed
        });

        test('enableButton should enable the button', () => {
            const button = document.createElement('button');
            button.id = 'submission';
            button.disabled = true; // Initially disable the button
            document.body.appendChild(button);

            enableButton();

            expect(button.disabled).toBe(false); // Check if button is enabled
            expect(button.innerHTML).toBe("Submit FAQ"); // Check if button text is reset
        });
    });
});
