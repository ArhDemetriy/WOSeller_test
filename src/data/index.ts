type CourseTags = 'marketing' | 'management' | 'hr' | 'design' | 'development';

type Course<T extends CourseTags = CourseTags> = Readonly<{
  id: number;
  image: Readonly<{
    src: string;
    alt: string;
    title: string;
  }>;
  tag: T;
  price: string;
  title: string;
  description: string;
}>;

type ButtonTag = CourseTags | 'all';

const buttonsPromise = (async () => {
  try {
    const response = await fetch('/data/courses.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    return (await response.json()) as ReadonlyArray<Course>;
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
})().then(courses => {
  const buttons = { all: { tag: 'all', courses } } as {
    [k in ButtonTag]?: k extends CourseTags
      ? { tag: k; courses: ReadonlyArray<Course<k>> }
      : { tag: k; courses: ReadonlyArray<Course> };
  };

  for (const course of courses) {
    const { tag } = course;
    if (!buttons[tag]) {
      // ts мешает писать в undefined поле
      (buttons[tag] as unknown as { tag: CourseTags; courses: ReadonlyArray<Course> }) = {
        tag,
        courses: [],
      };
    }
    (buttons[tag]!.courses as Course[]).push(course);
  }

  return buttons;
});

export async function getFilteredCourses<T extends ButtonTag>(
  fromTag: T,
  search?: string
): Promise<NonNullable<Awaited<typeof buttonsPromise>[T]>['courses']> {
  const buttons = await buttonsPromise;
  const courses = buttons[fromTag]?.courses ?? [];
  if (!search) return courses;

  const lowerSearch = search.toLowerCase();
  return courses.filter(
    c =>
      c.title.toLowerCase().includes(lowerSearch) ||
      c.description.toLowerCase().includes(lowerSearch)
  );
}

let activeTag: ButtonTag = 'all';
export const getActiveTag = () => activeTag;
export const setActiveTag = (tag: ButtonTag) => (activeTag = tag);
export const getTags = () => buttonsPromise.then(buttons => Object.keys(buttons) as ButtonTag[]);
