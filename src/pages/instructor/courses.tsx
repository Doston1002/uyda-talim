import { GetServerSideProps, NextPage } from 'next';
import { CourseType } from 'src/interfaces/course.interface';
import { withInstructorLayout } from 'src/layouts/instructor';
import { InstructorCoursesPageComponent } from 'src/page-component';
import { InstructorService } from 'src/services/instructor.service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const Courses: NextPage<CoursesPageType> = () => {
	const router = useRouter();
	const { user } = useTypedSelector(state => state.user);

	useEffect(() => {
		// Foydalanuvchi ma'lumotlari yuklangan bo'lsa va instructor bo'lmasa
		if (user && user.role !== 'INSTRUCTOR') {
			router.push('/');
		}
	}, [user, router]);

	// Agar instructor bo'lmasa, hech narsa ko'rsatmaslik
	if (user && user.role !== 'INSTRUCTOR') {
		return null;
	}

	return <InstructorCoursesPageComponent />;
};

export default withInstructorLayout(Courses);

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

		const courses = await InstructorService.getAllCourses(token);

		return {
			props: { courses },
		};
	} catch (error) {
		console.error('Instructor access error:', error);
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
