import { GetServerSideProps } from 'next';
import { ArticleType } from 'src/interfaces/article.interface';
import { Language } from 'src/interfaces/constants.interface';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { ArticleDetailedComponent } from 'src/page-component';

const ArtcileDetailPage = ({ article }: ArticleDetailedPageProps) => {
	return (
		<Seo metaTitle={article.title} metaDescription={article.excerpt}>
			<ArticleDetailedComponent article={article} />
		</Seo>
	);
};

export default withLayout(ArtcileDetailPage);

export const getServerSideProps: GetServerSideProps<
	ArticleDetailedPageProps
> = async ({ query, req }) => {
	const lng: Language = req.cookies.i18next as Language;

	return {
		redirect: {
			destination: '/articles',
			permanent: false,
		},
	};
};

interface ArticleDetailedPageProps extends Record<string, unknown> {
	article: ArticleType;
}