export const loadImage = (imageURL?: string) => `${process.env.NEXT_PUBLIC_API_SERVICE}${imageURL}`;

// Reyting raqamini bitta o'nlik raqamgacha qisqartirish
export const formatRating = (rating: number | undefined): string => {
	if (rating === undefined || rating === null) return '0';
	return Number(rating).toFixed(1);
};