// bookmarkService.js
const getBookmarkKey = (userId) => `bookmarks_${userId}`;

export const bookmarkService = {
  getUserBookmarks: (userId) => {
    try {
      const key = getBookmarkKey(userId);
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  saveUserBookmarks: (userId, bookmarks) => {
    try {
      const key = getBookmarkKey(userId);
      localStorage.setItem(key, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  },

  clearUserBookmarks: (userId) => {
    try {
      const key = getBookmarkKey(userId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
    }
  }
};