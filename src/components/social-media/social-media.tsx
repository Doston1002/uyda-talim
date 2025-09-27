import { Box, Button, Center, HStack, Text } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { FaGoogle } from 'react-icons/fa';

const SocialMedia = () => {
	const { t } = useTranslation();

	const gogole = () => {
		signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_CLIENT_DOMAIN}` });
	};

	return (
		<>
		
			
		</>
	);
};

export default SocialMedia;
