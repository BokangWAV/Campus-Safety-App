

module.exports = {
  coverageThreshold: {
      global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
      },
    },
    setupFiles: ['<rootDir>/jest.setup.js'], // Add your setup file here
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: 'coverage', // Ensure this is set correctly
    coverageReporters: ['json', 'lcov', 'text', 'clover'], // lcov is necessary for Codecov
    collectCoverageFrom: [
        'app/**/*.{js,jsx}', // Include source files from the 'app' folder
        'Backend/**/*.{js,jsx}', // Include source files from the 'Backend' folder
        '!app/modules/AI-init.js',
        '!app/modules/users.js',
        '!app/scripts/main.js',
        '!app/scripts/profiledata.js',
        '!app/scripts/script.js',
        '!app/scripts/ai.js',
        '!app/scripts/form-submit.js',
        '!app/scripts/summary.js',
        '!app/scripts/notification.js',
        '!app/scripts/dashboard.js',
        '!app/scripts/faqManager.js',
        '!app/scripts/realtimenotification.js',
        '!app/scripts/AlertProcess.js',
        '!app/scripts/ShowIncidents.js',
        '!app/scripts/faq.js',
        '!app/scripts/announcement.js',
        '!app/scripts/article.js',
        '!app/scripts/create.js',
        '!app/scripts/request.js',
        '!Backend/modules/FAQ.js',
        '!Backend/modules/alert.js',
        '!Backend/index.js',
        '!Backend/modules/notification.js',
        '!Backend/modules/article.js',
        '!Backend/modules/users.js',
        '!Backend/modules/report.js',
        '!**/node_modules/**', // Exclude node_modules
        '!**/test/**', // Exclude test files if you want
        '!**/coverage/**', // Exclude coverage folder
      ],
    moduleNameMapper: {
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js$': '<rootDir>/app/__mocks__/firebase-app.js',
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js$': '<rootDir>/app/__mocks__/firebase-auth.js',
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js$': '<rootDir>/app/__mocks__/firebase-firestore.js',
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js$': '<rootDir>/app/__mocks__/firebase-storage.js',
        '^https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js$': '<rootDir>/app/__mocks__/firebase-app.js',
        '^https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js$': '<rootDir>/app/__mocks__/firebase-firestore.js',
        '^https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js$': '<rootDir>/app/__mocks__/firebase-auth.js',
        '^https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js$': '<rootDir>/app/__mocks__/firebase-storage.js',
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-vertexai-preview.js$': '<rootDir>/app/__mocks__/firebase.js',

    }
  };  