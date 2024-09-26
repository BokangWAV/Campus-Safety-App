

module.exports = {
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: 'coverage', // Ensure this is set correctly
    coverageReporters: ['json', 'lcov', 'text', 'clover'], // lcov is necessary for Codecov
    collectCoverageFrom: [
        'app/**/*.{js,jsx}', // Include source files from the 'app' folder
        'Backend/**/*.{js,jsx}', // Include source files from the 'Backend' folder
        '!app/fakenotifications.js', // Exclude 'fakenotifications.js'
        '!app/init.js', // Exclude 'init.js' from 'app'
        '!app/notifications.js', // Exclude 'notifications.js'
        '!app/script.js', // Exclude 'script.js'
        '!app/vscode.js', // Exclude 'vscode.js'
        '!app/scripts/ai.js',
        '!app/scripts/editprofile.js',
        '!app/scripts/form-submit.js',
        '!app/scripts/main.js',
        '!app/scripts/profiledata.js',
        '!app/scripts/dashboard.js',
        '!Backend/index.js', // Exclude 'index.js' from 'Backend'
        '!**/node_modules/**', // Exclude node_modules
        '!**/test/**', // Exclude test files if you want
        '!**/coverage/**', // Exclude coverage folder
      ],
    moduleNameMapper: {
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js$': '<rootDir>/app/__mocks__/firebase-app.js',
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js$': '<rootDir>/app/__mocks__/firebase-auth.js',
        '^https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js$': '<rootDir>/app/__mocks__/firebase-firestore.js',
        '^https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js$': '<rootDir>/app/__mocks__/firebase-storage.js',
        '^https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js$': '<rootDir>/app/__mocks__/firebase-app.js',
        '^https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js$': '<rootDir>/app/__mocks__/firebase-firestore.js',
        '^https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js$': '<rootDir>/app/__mocks__/firebase-auth.js',
    }
  };  