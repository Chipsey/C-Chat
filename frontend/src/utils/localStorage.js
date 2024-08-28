// localStorageService.js

const LOCAL_STORAGE_PREFIX = "xillica_";

// Helper function to create a prefixed key
const createKey = (key) => `${LOCAL_STORAGE_PREFIX}${key}`;

const localStorageService = {
  /**
   * Save an item to local storage
   * @param {string} key - The key to store the item under
   * @param {any} value - The value to store (will be stringified)
   */
  setItem(key, value) {
    try {
      localStorage.setItem(createKey(key), JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  },

  /**
   * Retrieve an item from local storage
   * @param {string} key - The key of the item to retrieve
   * @returns {any} The retrieved item (parsed from JSON)
   */
  getItem(key) {
    try {
      const item = localStorage.getItem(createKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error retrieving from local storage", error);
      return null;
    }
  },

  /**
   * Remove an item from local storage
   * @param {string} key - The key of the item to remove
   */
  removeItem(key) {
    try {
      localStorage.removeItem(createKey(key));
    } catch (error) {
      console.error("Error removing from local storage", error);
    }
  },

  /**
   * Clear all items from local storage
   */
  clear() {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing local storage", error);
    }
  },
};

export default localStorageService;
