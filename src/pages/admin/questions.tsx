import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withAdminLayout } from 'src/layouts/admin';
import QuestionsPageComponent from 'src/page-component/admin-page-component/questions-page-component';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const QuestionsPage = () => {
	const router = useRouter();
	const { user } = useTypedSelector(state => state.user);

	useEffect(() => {
		if (user && user.role !== 'ADMIN') {
			router.push('/');
		}
	}, [user, router]);

	if (user && user.role !== 'ADMIN') {
		return null;
	}

	return <QuestionsPageComponent />;
};

export default withAdminLayout(QuestionsPage);

