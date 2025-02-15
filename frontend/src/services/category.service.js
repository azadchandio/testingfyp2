// services/category.service.js

const API_URL = 'http://127.0.0.1:8000/api';

export const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/categories/`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getCategoryDetail: async (slug) => {
        try {
            const response = await fetch(`${API_URL}/categories/${slug}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch category details');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getSubCategories: async (categorySlug) => {
        try {
            const response = await fetch(`${API_URL}/categories/${categorySlug}/subcategories/`);
            if (!response.ok) {
                throw new Error('Failed to fetch subcategories');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};