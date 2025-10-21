import { GetServerSideProps, NextPage } from 'next';
import { CourseType } from 'src/interfaces/course.interface';
import { withInstructorLayout } from 'src/layouts/instructor';
import { EditDetailedCoursePageComponent } from 'src/page-component';
import { InstructorService } from 'src/services/instructor.service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTypedSelector } from 'src/hooks/useTypedSelector';

const EditDetailedCourses: NextPage = () => {
	const router = useRouter();
	const { user } = useTypedSelector(state => state.user);

	useEffect(() => {
		if (user && user.role !== 'INSTRUCTOR') {
			router.push('/');
		}
	}, [user, router]);

	if (user && user.role !== 'INSTRUCTOR') {
		return null;
	}

	return <EditDetailedCoursePageComponent />;
};

export default withInstructorLayout(EditDetailedCourses);

export const getServerSideProps: GetServerSideProps<CoursesPageType> = async ({ req, query }) => {
	try {
		const token = req.cookies.refresh;
		
		if (!token) {
			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				},
			};
		}

		const course = await InstructorService.getDetailedCourse(
			token,
			query.slug as string
		);

		return {
			props: { course },
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
	course: CourseType;
}
