import { getActiveTag, setActiveTag, getTags, getFilteredCourses } from './data';

// Маппинг тегов на читаемые названия
const tagLabels: Record<string, string> = {
  all: 'All',
  marketing: 'Marketing',
  management: 'Management',
  hr: 'HR & Recruiting',
  design: 'Design',
  development: 'Development',
};

// Элементы DOM
const tabsContainer = document.querySelector('.tabs')!;
const gridContainer = document.querySelector('.grid')!;
const searchInput = document.querySelector('.filters__search') as HTMLInputElement;
const tabTemplate = document.getElementById('tab-template') as HTMLTemplateElement;
const cardTemplate = document.getElementById('card-template') as HTMLTemplateElement;

async function renderTabs() {
  const tags = await getTags();

  for (const tag of tags) {
    const courses = await getFilteredCourses(tag);
    const clone = tabTemplate.content.cloneNode(true) as DocumentFragment;
    const button = clone.querySelector('.tab')!;

    button.querySelector('.tab__label')!.textContent = tagLabels[tag] ?? tag;
    button.querySelector('.tab__count')!.textContent = String(courses.length);

    if (tag === getActiveTag()) {
      button.classList.add('tab--active');
    }

    button.addEventListener(
      'click',
      () => {
        if (tag === getActiveTag()) return;
        // Убираем активный класс у всех
        tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
        // Добавляем активный класс текущей
        button.classList.add('tab--active');
        setActiveTag(tag);
        // Перерисовываем карточки
        void renderCards(tag);
      },
      { passive: true }
    );

    tabsContainer.appendChild(clone);
  }
}

async function renderCards(tag: ReturnType<typeof getActiveTag>, search?: string) {
  const courses = await getFilteredCourses(tag, search);

  // Очищаем контейнер
  gridContainer.innerHTML = '';

  for (const course of courses) {
    const clone = cardTemplate.content.cloneNode(true) as DocumentFragment;
    const card = clone.querySelector('.card')!;

    // Изображение
    const image = card.querySelector('.card__image') as HTMLImageElement;
    image.src = course.image.src;
    image.alt = course.image.alt;

    // Бейдж с модификатором категории
    const badge = card.querySelector('.card__badge')!;
    badge.textContent = tagLabels[course.tag] ?? course.tag;
    badge.classList.add(`card__badge--${course.tag}`);

    // Заголовок
    card.querySelector('.card__title')!.textContent = course.title;

    // Цена
    card.querySelector('.card__price')!.textContent = course.price;

    // Автор
    card.querySelector('.card__author')!.textContent = course.description;

    gridContainer.appendChild(clone);
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const SEARCH_DEBOUNCE_MS = 200;
function onSearchChange() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const searchValue = searchInput.value.trim();
    void renderCards(getActiveTag(), searchValue || undefined);
  }, SEARCH_DEBOUNCE_MS);
}

function init() {
  void renderTabs();
  void renderCards(getActiveTag());

  // Привязываем обработчик к инпуту
  searchInput.addEventListener('input', onSearchChange);
}
init();
