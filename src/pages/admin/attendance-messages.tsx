import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withAdminLayout } from 'src/layouts/admin';
import AttendanceMessagesComponent from 'src/page-component/admin-page-component/attendance-messages-component';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const AttendanceMessages = () => {
	const router = useRouter();
	const { user } = useTypedSelector(state => state.user);

	useEffect(() => {
		// Foydalanuvchi ma'lumotlari yuklangan bo'lsa va admin bo'lmasa
		if (user && user.role !== 'ADMIN') {
			router.push('/');
		}
	}, [user, router]);

	// Agar admin bo'lmasa, hech narsa ko'rsatmaslik
	if (user && user.role !== 'ADMIN') {
		return null;
	}

	return <AttendanceMessagesComponent />;
};

export default withAdminLayout(AttendanceMessages);

