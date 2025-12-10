import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withAdminLayout } from 'src/layouts/admin';
import AttendanceMessagesComponent from 'src/page-component/admin-page-component/attendance-messages-component';
import { getRoleFromToken } from 'src/helpers/token.helper';

const AttendanceMessages = () => {
	const router = useRouter();
	
	// ✅ SECURITY FIX: Role ni token dan o'qish (har safar backend dan)
	const userRole = getRoleFromToken();

	useEffect(() => {
		// Foydalanuvchi ma'lumotlari yuklangan bo'lsa va admin bo'lmasa
		if (userRole !== 'ADMIN') {
			router.push('/');
		}
	}, [userRole, router]);

	// Agar admin bo'lmasa, hech narsa ko'rsatmaslik
	if (userRole !== 'ADMIN') {
		return null;
	}

	return <AttendanceMessagesComponent />;
};

export default withAdminLayout(AttendanceMessages);

