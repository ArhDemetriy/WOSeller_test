export type CourseTag = 'marketing' | 'management' | 'hr' | 'design' | 'development';

export interface CourseImage {
  src: string;
  alt: string;
  title: string;
}

export interface Course {
  id: number;
  image: CourseImage;
  tag: CourseTag;
  price: string;
  title: string;
  description: string;
}

export type CoursesResponse = Course[];

