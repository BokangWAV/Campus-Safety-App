const mockSignInWithPopup = jest.fn();
const mockGoogleAuthProviderCredentialFromResult = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();

const GoogleAuthProvider = {
  credentialFromResult: mockGoogleAuthProviderCredentialFromResult,
  credential: jest.fn(), // Add implementation if needed
};

const auth = {};
const provider = {};

module.exports = {
  signInWithPopup: mockSignInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signOut: mockSignOut,
};