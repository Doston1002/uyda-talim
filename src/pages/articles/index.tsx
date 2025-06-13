import { useTranslation } from 'react-i18next';
import { ArticleType } from 'src/interfaces/article.interface';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { ArticlePageComponent } from 'src/page-component';

interface ArticlesPageProps extends Record<string, unknown> {
	articles: ArticleType;
}

const ArticlePage = () => {
	const { t } = useTranslation();

	return (
		<Seo
			metaTitle={t('article_page_title', { ns: 'seo' }) || 'Articles'}
			metaDescription={t('article_page_description', { ns: 'seo' }) || 'Useful articles'}
		>
			<ArticlePageComponent/>
		</Seo>
	);
};

export default withLayout(ArticlePage);

