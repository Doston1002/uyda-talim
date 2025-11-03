import { SectionType } from 'src/interfaces/instructor.interface';

export interface SectionInitialStateType {
	isLoading: boolean;
	pendingSection: boolean;
	error: string | null | unknown;
	sections: SectionType[];
}

export interface SectionBodyType {
	title?: string;
	courseId?: string;
	sectionId?: string;
	sections?: string[];
	lessons?: string[];
    // optional initial lesson fields for combined create
    name?: string;
    embedVideo?: string;
    hour?: number;
    minute?: number;
    second?: number;
    material?: string;
	callback: () => void;
}
