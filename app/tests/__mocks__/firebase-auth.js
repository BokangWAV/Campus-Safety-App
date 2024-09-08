export const getFirestore = jest.fn(() => ({
    collection: jest.fn(() => ({
      getDocs: jest.fn(() => Promise.resolve({
        forEach: jest.fn((callback) => {
          callback({ data: () => ({ name: "John", surname: "Doe" }) });
        }),
        empty: false,
      })),
    })),
  }));
  