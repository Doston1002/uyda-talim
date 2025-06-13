import {
	Card,
	CardBody,
	Center,
	Spinner,
	Tab,
	TabList,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { CourseType } from 'src/interfaces/course.interface';
import { AuthService } from 'src/services/auth.service';
import Account from './account';
import DangerZone from './danger-zone';
import MyCourses from './my-courses';
import Settings from './settings';

const DashboardPageComponent = () => {
	const [tabIndex, setTabIndex] = useState(0);
	const { user } = useTypedSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const [myCourses, setMyCourses] = useState<CourseType[]>([]);

	const tabHandler = async (idx: number) => {
		setIsLoading(true);
		setTabIndex(idx);
		try {
			 if (idx == 3 && !myCourses.length) {
				const response = await AuthService.getMyCourses();
				setMyCourses(response);
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Card>
				<CardBody>
					<Tabs
						isFitted
						variant='enclosed-colored'
						colorScheme={'facebook'}
						orientation={'vertical'}
						onChange={tabHandler}
						defaultValue={tabIndex}
					>
						<TabList mb='1em' h={'300'}>
							<Tab>Account</Tab>
							<Tab>Settings</Tab>
							<Tab>My Courses</Tab>
							<Tab>Danger Zone</Tab>
						</TabList>
						<TabPanels px={5}>
							{isLoading ? (
								<Center>
									<Spinner />
								</Center>
							) : (
								<>
									{tabIndex === 0 && user && <Account />}
									{tabIndex === 1 && <Settings />}
									{tabIndex === 2 && (
										<MyCourses myCourses={myCourses} />
									)}
									{tabIndex === 3 && <DangerZone />}
								</>
							)}
						</TabPanels>
					</Tabs>
				</CardBody>
			</Card>
		</>
	);
};

export default DashboardPageComponent;
