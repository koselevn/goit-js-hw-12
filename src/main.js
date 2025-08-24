import { getImagesByQuery } from './js/pixabay-api.js';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import {
  clearGallery, createGallery,
  hideLoader, showLoader,
  showLoadMoreButton, hideLoadMoreButton
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('#load-more');

hideLoadMoreButton();

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  currentQuery = event.target.elements['search-text'].value.trim();
  currentPage = 1;

  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term!',
      position: 'topRight'
    });
    return;
  }

  try {
    showLoader();
    hideLoadMoreButton(); 
    clearGallery();

    const result = await getImagesByQuery(currentQuery, currentPage);

    if (typeof result === 'string') {
      iziToast.error({ title: 'Error', message: result, position: 'topRight' });
      return;
    }

    createGallery(result);
    iziToast.success({
      title: 'Success',
      message: `Found ${result.length} images in this batch`,
      position: 'topRight'
    });

    if (result.length === PER_PAGE) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of search results.",
        position: 'topRight'
      });
    }
  } catch (e) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight'
    });
    console.error(e);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  try {
    showLoader();
    hideLoadMoreButton();

    const result = await getImagesByQuery(currentQuery, currentPage);

    if (typeof result === 'string' || result.length === 0) {
      iziToast.info({
        title: 'Info',
        message: "No more images available.",
        position: 'topRight'
      });
      return;
    }

    createGallery(result);

    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

    if (result.length === PER_PAGE) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of search results.",
        position: 'topRight'
      });
    }
  } catch (e) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight'
    });
    console.error(e);
  } finally {
    hideLoader();
  }
});