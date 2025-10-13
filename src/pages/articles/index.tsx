import { useTranslation } from 'react-i18next';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { ArticlePageComponent } from 'src/page-component';


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

