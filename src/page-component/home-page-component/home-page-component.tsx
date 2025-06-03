import { Stack } from '@chakra-ui/react';
import { Categories, Hero, HowItWorks, Newsletter, PopularCourses, Sposorship } from 'src/components';

const HomePageComponent = () => {
	return (
		<Stack spacing={10}>
			<Hero />
			<Categories />
			<PopularCourses />
			<HowItWorks />
			<Newsletter />
			<Sposorship />
		</Stack>
	);
};

export default HomePageComponent;
