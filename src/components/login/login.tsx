import {
	Box,
	Button,
	Divider,
	Stack,
	Text,
} from '@chakra-ui/react';
import { SimAuthProvider, SimLogin } from 'src/student-information-management';
import { LoginProps } from './login.props';

const Login = (_props: LoginProps) => {
	const handleOneIdLogin = () => {
		const authUrl = new URL(process.env.NEXT_PUBLIC_ONEID_BASE_URL!);

		authUrl.searchParams.set('response_type', 'one_code');
		authUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_ONEID_CLIENT_ID!);
		authUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_ONEID_REDIRECT_URI!);
		authUrl.searchParams.set('scope', process.env.NEXT_PUBLIC_ONEID_SCOPE!);
		authUrl.searchParams.set('state', 'random_state');

		window.location.href = authUrl.toString();
	};

	return (
		<Stack spacing={5} w="full" maxW="md" mx="auto">
			<Button
				w="full"
				h={12}
				colorScheme="teal"
				variant="outline"
				fontWeight="medium"
				onClick={handleOneIdLogin}
			>
				OneID orqali kirish
			</Button>

			<Box position="relative" py={1}>
				<Divider borderColor="gray.200" />
				<Text
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
					bg="white"
					px={4}
					color="gray.400"
					fontSize="xs"
					fontWeight="medium"
				>
					yoki
				</Text>
			</Box>

			<SimAuthProvider>
				<SimLogin />
			</SimAuthProvider>
		</Stack>
	);
};
export default Login;