export const getVertexAI = jest.fn(() => ({
    generateContent: jest.fn(() => Promise.resolve({ response: { text: jest.fn(() => "Mock response text") } })),
}));