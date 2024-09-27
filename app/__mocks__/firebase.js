// __mocks__/firebase.js
export const initializeApp = jest.fn();
export const getVertexAI = jest.fn(() => ({
    generateContent: jest.fn(() => Promise.resolve({
        response: {
            text: jest.fn(() => "Mock response text")
        }
    }))
}));
export const getGenerativeModel = jest.fn(() => ({
    generateContent: jest.fn(() => Promise.resolve({
        response: {
            text: jest.fn(() => "Mock response text")
        }
    }))
}));
