// API base URL ni to'g'ridan-to'g'ri o'rnatish
const API_BASE_URL = 'https://api.uydatalim.uzedu.uz';

export const loadImage = (imageURL?: string) => {
	if (!imageURL) return '';
	
	// Agar imageURL allaqachon to'liq URL bo'lsa, uni qaytarish
	if (imageURL.startsWith('http')) {
		return imageURL;
	}
	
	// Agar imageURL /uploads bilan boshlansa, api subdomain qo'shish
	if (imageURL.startsWith('/uploads')) {
		return `${API_BASE_URL}${imageURL}`;
	}
	
	// Boshqa holatda, oddiy qo'shish
	return `${API_BASE_URL}${imageURL}`;
};
