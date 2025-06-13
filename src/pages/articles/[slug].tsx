import { GetServerSideProps } from 'next';
import { ArticleType } from 'src/interfaces/article.interface';
import { Language } from 'src/interfaces/constants.interface';

interface ArticleDetailedPageProps extends Record<string, unknown> {
	article?: ArticleType;
}

const ArticleSlugPage = ({ article }: ArticleDetailedPageProps) => {
	// Hozircha redirect bo‘lgani uchun hech narsa qaytarmayapti
	return null;
};

export const getServerSideProps: GetServerSideProps<ArticleDetailedPageProps> = async ({ req }) => {
	const lng: Language = req.cookies.i18next as Language;

	return {
		redirect: {
			destination: '/articles',
			permanent: false,
		},
	};
};

export default ArticleSlugPage; // ✅ MUHIM: default export bo‘lishi kerak
