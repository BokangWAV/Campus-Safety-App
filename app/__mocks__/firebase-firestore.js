// __mocks__/firebase-firestore.js
export const getFirestore = jest.fn(() => ({
    // Mock any properties or methods if needed
  }));
  
  export const collection = jest.fn(() => ({}));

  export const getDocs = jest.fn(() =>
      Promise.resolve({
          empty: false,
          forEach: (callback) => {
              const articles = [
                  {
                      data: () => ({
                          title: 'Article A',
                          name: 'John',
                          surname: 'Doe',
                          content: 'Content A',
                          likes: 10,
                      }),
                  },
                  {
                      data: () => ({
                          title: 'Article B',
                          name: 'Jane',
                          surname: 'Smith',
                          content: 'Content B',
                          likes: 5,
                      }),
                  },
              ];
              articles.forEach(callback);
          },
      })
  );
  export const doc = jest.fn();
  export const setDoc = jest.fn();
  export const getDoc = jest.fn();
  export const query = jest.fn();
  export const where = jest.fn();
  