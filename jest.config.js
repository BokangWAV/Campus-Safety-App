module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage', // Ensure this is set correctly
    coverageReporters: ['json', 'lcov', 'text', 'clover'], // lcov is necessary for Codecov
    collectCoverageFrom: [
        'app/**/*.{js,jsx}', // Include source files from the 'app' folder
        'Backend/**/*.{js,jsx}', // Include source files from the 'Backend' folder
        '!**/node_modules/**', // Exclude node_modules
        '!**/test/**', // Exclude test files if you want
        '!**/coverage/**', // Exclude coverage folder
      ],
  };  