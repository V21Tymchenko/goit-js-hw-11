import { crateImageMarkUp } from './create-gallery/crate-mark-up';
import { searchImage } from './serach-image/search-image';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { formRefs, btnRefs, gallery, entText } from './refs/refs';
// import throttle from 'lodash.throttle';

// функция отрисовки карточек с картинками
function renderImage(arr) {
  const markUp = arr.map(item => crateImageMarkUp(item));
  gallery.insertAdjacentHTML('beforeend', markUp.join(''));
}

// подключения симпл-лайтбокс к карточкам

let lightbox = new SimpleLightbox('.photo-card a', {
  nav: true,
  close: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let totalImg = 0;
let inputValue = '';
let response = '';
// слушатель на сабмит формы
formRefs.addEventListener('submit', onSubmitSearch);

// ассинхронная функция при сабмит
function onSubmitSearch(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  totalImg = 40;

  // получаем значение веденное пользователем
  inputValue = event.currentTarget.elements.searchQuery.value.trim();

  if (!inputValue) {
    gallery.innerHTML = '';
    return;
  }
  renderMarkUp(inputValue);
  lightbox.refresh();
  // если пришел пустой массив обьектов выводим сообщение и выходим
}

async function renderMarkUp(value) {
  try {
    response = await searchImage(value, currentPage);
    entText.classList.add('is-hidden');
    if (response.data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

    renderImage(response.data.hits);
    lightbox.refresh();

    scrollOfSite();
  } catch (error) {
    console.error(error);
  }
}
// функция плавного скролла
function scrollOfSite() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * -50,
    behavior: 'smooth',
  });
}

//  бесконечный скролл страницы
window.addEventListener('scroll', infinityScroll);

// функция при скроле страницы
function infinityScroll() {
  const documentRef = document.documentElement.getBoundingClientRect();
  if (
    totalImg > 500 &&
    documentRef.bottom < document.documentElement.clientHeight + 300
  ) {
    entText.classList.remove('is-hidden');
    return;
  }
  if (documentRef.bottom < document.documentElement.clientHeight + 200) {
    currentPage += 1;

    totalImg += response.data.hits.length;
    renderMarkUp(inputValue);
    lightbox.refresh();
  }
}
