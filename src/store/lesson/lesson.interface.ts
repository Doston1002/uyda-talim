import { LessonType } from 'src/interfaces/instructor.interface';

export interface LessonInitialStateType {
	isLoading: boolean;
	lesson: LessonType;
	error: string | null | unknown;
}

export interface LessonBodyType {
	callback: () => void;
	courseId?: string;
	sectionId?: string;
	lessonId?: string;
    // lesson payload fields
    name?: string;
    material?: string;
    embedVideo?: string;
    hour?: number;
    minute?: number;
    second?: number;
}
