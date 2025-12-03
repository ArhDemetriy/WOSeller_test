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
const tabTemplate = document.getElementById('tab-template') as HTMLTemplateElement;
const cardTemplate = document.getElementById('card-template') as HTMLTemplateElement;

// Генерация карточек курсов
async function renderCards() {
  const courses = await getFilteredCourses(getActiveTag());

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

// Генерация табов
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

    button.addEventListener('click', () => {
      // Убираем активный класс у всех
      tabsContainer.querySelectorAll('.tab').forEach((t: Element) => t.classList.remove('tab--active'));
      // Добавляем активный класс текущей
      button.classList.add('tab--active');
      setActiveTag(tag);
      // Перерисовываем карточки
      renderCards();
    });

    tabsContainer.appendChild(clone);
  }
}

// Инициализация
async function init() {
  await renderTabs();
  await renderCards();
}

init();