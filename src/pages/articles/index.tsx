import { GetServerSideProps } from 'next';
import { useTranslation } from 'react-i18next';
import { ArticleType } from 'src/interfaces/article.interface';
import { Language } from 'src/interfaces/constants.interface';
import { withLayout } from 'src/layouts/layout';
import Seo from 'src/layouts/seo/seo';
import { ArticlePageComponent } from 'src/page-component';
import { FC } from 'react';

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

