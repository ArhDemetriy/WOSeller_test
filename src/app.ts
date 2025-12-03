// App entry point
import type { Course, CoursesResponse } from './types/course';

async function fetchCourses(): Promise<CoursesResponse> {
  const response = await fetch('/data/courses.json');

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status}`);
  }

  const data = (await response.json()) as CoursesResponse;
  return data;
}

async function init(): Promise<void> {
  try {
    const courses = await fetchCourses();
    console.log('Courses loaded:', courses);

    // TODO: render courses to DOM
    courses.forEach((course: Course) => {
      console.log(`${course.title} - ${course.tag} - ${course.price}`);
    });
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

init();
