import { GetServerSideProps } from 'next';
import { BooksType } from 'src/interfaces/books.interface';
import { withAdminLayout } from 'src/layouts/admin';
import { AdminBooksPageComponent } from 'src/page-component';
import { BooksService } from 'src/services/books.service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getRoleFromToken } from 'src/helpers/token.helper';

const Books = () => {
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

	return (
		<>
			<AdminBooksPageComponent />
		</>
	);
};

export default withAdminLayout(Books);

export const getServerSideProps: GetServerSideProps<BooksPageType> = async ({ req }) => {
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

		const books = await BooksService.get();

		return {
			props: { books },
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

interface BooksPageType extends Record<string, unknown> {
	books: BooksType[];
}
