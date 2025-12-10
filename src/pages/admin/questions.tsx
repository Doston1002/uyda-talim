import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withAdminLayout } from 'src/layouts/admin';
import QuestionsPageComponent from 'src/page-component/admin-page-component/questions-page-component';
import { getRoleFromToken } from 'src/helpers/token.helper';

const QuestionsPage = () => {
	const router = useRouter();
	
	// ✅ SECURITY FIX: Role ni token dan o'qish (har safar backend dan)
	const userRole = getRoleFromToken();

	useEffect(() => {
		if (userRole !== 'ADMIN') {
			router.push('/');
		}
	}, [userRole, router]);

	if (userRole !== 'ADMIN') {
		return null;
	}

	return <QuestionsPageComponent />;
};

export default withAdminLayout(QuestionsPage);

