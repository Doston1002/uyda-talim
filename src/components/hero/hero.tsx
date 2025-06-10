import { Button, Card, CardBody, Grid, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaJava } from 'react-icons/fa';
import { VscDebugStart } from 'react-icons/vsc';

const Hero = () => {
	const { t } = useTranslation();

	return (
		<Card mt={10}>
			<CardBody p={10}>
				<Grid
					minH={'50vh'}
					gridTemplateColumns={{ base: '100%', md: '50% 50%' }}
					gap={5}
					justifyContent={'center'}
					alignContent={'center'}
				>
					<Stack spacing={3}>
						<Heading>{t('hero_title', { ns: 'home' })}</Heading>
						<Text>{t('hero_description', { ns: 'home' })}</Text>
						<Grid gridTemplateColumns={{ base: '100%', md: '50% 50%' }} gap={3}>
							<Button h={14} colorScheme={'facebook'} variant={'outline'} rightIcon={<VscDebugStart />}>
								{t('hero_start_learning_btn', { ns: 'home' })}
							</Button>
						</Grid>
					</Stack>
					<Image src={'/images/uy.png'} alt={'home'} />
				
				</Grid>
			</CardBody>
		</Card>
	);
};

export default Hero;
