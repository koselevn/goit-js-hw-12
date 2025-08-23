import axios from 'axios';

const API_KEY = '51915811-ff4e89c2eae9a908c3a29b564'; 
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

const DEFAULT_PARAMS = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: PER_PAGE,
};

export const getImagesByQuery = async (query, page = 1) => {
    const params = { ...DEFAULT_PARAMS };
    params.q = query;
    params.page = page;

    try {
        const response = await axios.get(BASE_URL, { params });

        if (response.data.hits.length === 0) {
            return 'Sorry, there are no images matching your search query. Please try again!';
        }

        return response.data.hits;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};