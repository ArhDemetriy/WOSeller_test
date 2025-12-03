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

async function renderTabs() {
  const template = document.getElementById('tab-template') as HTMLTemplateElement;
  const container = document.querySelector('.tabs')!;
  const tags = await getTags();

  for (const tag of tags) {
    const courses = await getFilteredCourses(tag);
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const button = clone.querySelector('.tab')!;

    button.querySelector('.tab__label')!.textContent = tagLabels[tag] ?? tag;
    button.querySelector('.tab__count')!.textContent = String(courses.length);

    if (tag === getActiveTag()) {
      button.classList.add('tab--active');
    }

    button.addEventListener('click', () => {
      // Убираем активный класс у всех
      container.querySelectorAll('.tab').forEach((t: Element) => t.classList.remove('tab--active'));
      // Добавляем активный класс текущей
      button.classList.add('tab--active');
      setActiveTag(tag);
    });

    container.appendChild(clone);
  }
}

renderTabs();