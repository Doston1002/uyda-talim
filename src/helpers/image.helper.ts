export const loadImage = (imageURL?: string) => {
	if (!imageURL) return '';
	const baseURL = process.env.NEXT_PUBLIC_API_SERVICE || 'https://api.uydatalim.uzedu.uz';
	return `${baseURL}${imageURL}`;
};

// Reyting raqamini bitta o'nlik raqamgacha qisqartirish
export const formatRating = (rating: number | undefined): string => {
	if (rating === undefined || rating === null) return '0';
	return Number(rating).toFixed(1);
};