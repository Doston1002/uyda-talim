import {
	Box,
	Button,
	Checkbox,
	Heading,
	HStack,
	Icon,
	InputRightElement,
	Stack,
	Text,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { InterfaceEmailAndPassword } from 'src/store/user/user.interface';
import { AuthValidation } from 'src/validations/auth.validation';
import ErrorAlert from '../error-alert/error-alert';
import TextFiled from '../text-filed/text-filed';
import { LoginProps } from './login.props';

const Login = ({ onNavigateStateComponent }: LoginProps) => {
	const [show, setShow] = useState<boolean>(false);
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
	const recaptchaRef = useRef<ReCAPTCHA>(null);

	const { t } = useTranslation();
	const { login, clearError } = useActions();
	const { error, isLoading } = useTypedSelector(state => state.user);
	const router = useRouter();
	const toast = useToast();

	const toggleShow = () => setShow(prev => !prev);

	const handleRecaptchaChange = (token: string | null) => {
		setRecaptchaToken(token);
	};

	const onSubmit = (formData: InterfaceEmailAndPassword) => {
		if (!recaptchaToken) {
			toast({
				title: t('recaptcha_required', { ns: 'global' }) || 'Iltimos, reCAPTCHA ni to\'ldiring',
				status: 'error',
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		login({
			email: formData.email,
			password: formData.password,
			recaptchaToken,
			callback: () => {
				router.push('/');
				toast({
					title: `${t('successfully_logged', { ns: 'global' })}`,
					status: 'info',
					isClosable: true,
					position: 'top-right',
				});
				// reCAPTCHA ni reset qilish
				if (recaptchaRef.current) {
					recaptchaRef.current.reset();
					setRecaptchaToken(null);
				}
			},
		});
	};
	// // OneID login bosilganda
	const handleOneIdLogin = () => {
		const authUrl = new URL(process.env.NEXT_PUBLIC_ONEID_BASE_URL!);

		authUrl.searchParams.set('response_type', 'one_code');
		authUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_ONEID_CLIENT_ID!);
		authUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_ONEID_REDIRECT_URI!);
		authUrl.searchParams.set('scope', process.env.NEXT_PUBLIC_ONEID_SCOPE!);
		authUrl.searchParams.set('state', 'random_state'); // xavfsizlik uchun generate qiling

		window.location.href = authUrl.toString();
	};
	return (
		// <Stack >
		// 	{/* <Heading
		// 		color={useColorModeValue('gray.900', 'gray.200')}
		// 		lineHeight={1.1}
		// 		fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
		// 	>
		// 		{t('login_title', { ns: 'global' })}
		// 		<Text as={'span'} bgGradient='linear(to-r, gray.400,facebook.400)' bgClip='text'>
		// 			!
		// 		</Text>
		// 	</Heading>
		// 	<Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
		// 		{t('login_description', { ns: 'global' })}
		// 	</Text>
		// 	<>{error && <ErrorAlert title={error as string} clearHandler={clearError} />}</>
		// 	<Formik
		// 		onSubmit={onSubmit}
		// 		initialValues={{ email: '', password: '' }}
		// 		validationSchema={AuthValidation.login}
		// 	>
		// 		<Form>
		// 			<TextFiled
		// 				name='email'
		// 				type='text'
		// 				label={t('login_input_email_label', { ns: 'global' })}
		// 				placeholder={'info@gmail.com'}
		// 			/>
		// 			<TextFiled
		// 				name='password'
		// 				label={t('login_input_password_label', { ns: 'global' })}
		// 				type={!show ? 'password' : 'text'}
		// 				placeholder={'****'}
		// 			>
		// 				<InputRightElement pt={4}>
		// 					<Icon
		// 						as={!show ? AiOutlineEye : AiOutlineEyeInvisible}
		// 						cursor={'pointer'}
		// 						onClick={toggleShow}
		// 					/>
		// 				</InputRightElement>
		// 			</TextFiled>
		// 			<HStack my={4} justify={'space-between'}>
		// 				<Checkbox colorScheme={'gray'}>{t('auth_remember_me', { ns: 'global' })}</Checkbox>
		// 				<Box
		// 					as={'a'}
		// 					onClick={() => onNavigateStateComponent('account-recovery')}
		// 					cursor={'pointer'}
		// 					color={'teal.500'}
		// 					_hover={{ textDecoration: 'underline' }}
		// 				>
		// 					{t('auth_forgot_password', { ns: 'global' })}
		// 				</Box>
		// 			</HStack>
		// 			<Box my={4}>
		// 				<ReCAPTCHA
		// 					ref={recaptchaRef}
		// 					sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY }
		// 					onChange={handleRecaptchaChange}
		// 				/>
		// 			</Box>
		// 			<Button
		// 				w={'full'}
		// 				bgGradient='linear(to-r, facebook.400,gray.400)'
		// 				_hover={{ bgGradient: 'linear(to-r, facebook.500,gray.500)', boxShadow: 'xl' }}
		// 				h={14}
		// 				type={'submit'}
		// 				isLoading={isLoading}
		// 				loadingText={`${t('loading', { ns: 'global' })}`}
		// 				disabled={!recaptchaToken}
		// 			>
		// 				{t('login_btn', { ns: 'global' })}
		// 			</Button>
		// 		</Form>
		// 	</Formik>
		// 	<Text>
		// 		{t('login_not_account_yet', { ns: 'global' })}{' '}
		// 		<Box
		// 			as={'span'}
		// 			onClick={() => onNavigateStateComponent('register')}
		// 			color={'teal.500'}
		// 			cursor={'pointer'}
		// 			_hover={{ textDecoration: 'underline' }}
		// 		>
		// 			{t('login_redirect_to_register', { ns: 'global' })}
		// 		</Box>
		// 	</Text> */}
		// 	{/* 🔹 OneID orqali login tugmasi */}
		// </Stack>
			<Button
			w={'full'}
			colorScheme='teal'
			variant='outline'
			onClick={handleOneIdLogin}
			>
			OneID orqali kirish
			</Button>
	);
};
export default Login;