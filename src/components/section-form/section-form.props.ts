export interface SectionFormProps {
	onClose: () => void;
	values?: {
		title: string;
		id: string;
        firstLesson?: {
            _id: string;
            name: string;
            embedVideo: string;
            hour: number;
            minute: number;
            second: number;
            material: string;
        } | null;
	} | null;
}
