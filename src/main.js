import { getImagesByQuery } from './js/pixabay-api.js';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import {
  clearGallery, createGallery,
  hideLoader, showLoader,
  showLoadMoreButton, hideLoadMoreButton
} from './js/render-functions.js';

const form = document.querySelector('.form');

// 🔒 сховати на старті (на випадок якщо стилі/markup ще не підвантажені)
hideLoadMoreButton();

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15; // має збігатися з тим, що в pixabay-api.js

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  currentQuery = event.target.elements['search-text'].value.trim();
  currentPage = 1;
  if (!currentQuery) {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search term!', position: 'topRight' });
    return;
  }

  try {
    showLoader();
    hideLoadMoreButton(); // перед запитом завжди ховаємо

    const result = await getImagesByQuery(currentQuery, currentPage);

    if (typeof result === 'string') {
      iziToast.error({ title: 'Error', message: result, position: 'topRight' });
      clearGallery();
      return;
    }

    clearGallery();
    createGallery(result);
    iziToast.success({ title: 'Success', message: `Found ${result.length} images`, position: 'topRight' });

    // показуємо кнопку тільки якщо є ще сторінки (прийшло рівно PER_PAGE)
    if (result.length === PER_PAGE) {
      showLoadMoreButton();
    }
  } catch (e) {
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later.', position: 'topRight' });
    console.error(e);
  } finally {
    hideLoader();
  }
});

// Обробник на "Load more" (якщо ще не додав)
document.querySelector('#load-more').addEventListener('click', async () => {
  currentPage += 1;
  try {
    showLoader();
    const result = await getImagesByQuery(currentQuery, currentPage);
    if (typeof result === 'string' || result.length === 0) {
      hideLoadMoreButton();
      return;
    }
    createGallery(result);
    // якщо прийшло менше PER_PAGE — більше сторінок немає
    if (result.length < PER_PAGE) hideLoadMoreButton();
  } catch (e) {
    iziToast.error({ title: 'Error', message: 'Failed to load more images.', position: 'topRight' });
    console.error(e);
  } finally {
    hideLoader();
  }
});