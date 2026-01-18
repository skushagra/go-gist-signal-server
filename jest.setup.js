// Jest setup file
// Add any global test setup here

// Mock crypto.randomUUID for tests
if (typeof crypto === "undefined") {
  global.crypto = {
    randomUUID: () => "test-uuid-" + Math.random().toString(36).substr(2, 9),
  };
}
