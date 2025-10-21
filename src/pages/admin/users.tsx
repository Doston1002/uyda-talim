import { GetServerSideProps } from 'next';
import { UserType } from 'src/interfaces/user.interface';
import { withAdminLayout } from 'src/layouts/admin';
import { UserPageComponent } from 'src/page-component';
import { AdminService } from 'src/services/admin.service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const Users = () => {
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

	return <UserPageComponent />;
};

export default withAdminLayout(Users);

export const getServerSideProps: GetServerSideProps<UserPageType> = async ({ req }) => {
	try {
		const token = req.cookies.refresh;
		
		// Token yo'q bo'lsa auth sahifasiga yo'naltirish
		if (!token) {
			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				},
			};
		}

		const users = await AdminService.getUsers('10', token);

		return {
			props: { users },
		};
	} catch (error) {
		console.error('Admin access error:', error);
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
};

interface UserPageType extends Record<string, unknown> {
	users: UserType[];
}