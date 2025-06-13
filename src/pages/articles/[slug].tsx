import { GetServerSideProps } from 'next';
import { ArticleType } from 'src/interfaces/article.interface';
import { Language } from 'src/interfaces/constants.interface';


export const getServerSideProps: GetServerSideProps<
	ArticleDetailedPageProps
> = async ({ req }) => {
	const lng: Language = req.cookies.i18next as Language;

	return {
		redirect: {
			destination: '/articles',
			permanent: false,
		},
	};
};

interface ArticleDetailedPageProps extends Record<string, unknown> {
	article?: ArticleType;
}