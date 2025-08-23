import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const imgList = document.querySelector('.gallery')
const loader = document.querySelector('.loader')
const loadMoreBtn = document.querySelector('#load-more');

export function clearGallery() {
  imgList.innerHTML = '';
}

export function createGallery(images) {
  const markup = images
    .map(
      ({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => `
        <a class="gallery__link" href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p>Likes: ${likes}</p>
            <p>Views: ${views}</p>
            <p>Comments: ${comments}</p>
            <p>Downloads: ${downloads}</p>
          </div>
        </a>
      `
    )
    .join('');

  imgList.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

export function showLoader() {
  loader.classList.remove('hidden');
}

export function hideLoader() {
  loader.classList.add('hidden');
}


export function showLoadMoreButton() {
    loadMoreBtn.classList.remove('hidden');
}

export function hideLoadMoreButton() {
    loadMoreBtn.classList.add('hidden');
}