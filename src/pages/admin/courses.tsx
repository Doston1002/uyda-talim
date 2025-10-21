import { GetServerSideProps } from 'next';
import { CourseType } from 'src/interfaces/course.interface';
import { withAdminLayout } from 'src/layouts/admin';
import { AdminCoursesPageComponent } from 'src/page-component';
import { AdminService } from 'src/services/admin.service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const Courses = () => {
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

	return (
		<>
			<AdminCoursesPageComponent />
		</>
	);
};

export default withAdminLayout(Courses);

export const getServerSideProps: GetServerSideProps<CoursesPageType> = async ({ req }) => {
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

		const courses = await AdminService.getAllCourses();

		return {
			props: { courses },
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

interface CoursesPageType extends Record<string, unknown> {
	courses: CourseType[];
}
