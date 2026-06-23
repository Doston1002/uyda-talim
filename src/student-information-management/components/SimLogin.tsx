import { useState } from 'react';
import { useRouter } from 'next/router';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	FormControl,
	FormLabel,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useShowPassword } from 'src/hooks/useShowPassword';
import { useSimAuth } from '../contexts/SimAuthContext';
import { simBtnPrimary, simInput, simLabel } from '../sim-ui';

interface SimLoginProps {
	variant?: 'auth' | 'standalone';
}

export function SimLogin({ variant = 'standalone' }: SimLoginProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useSimAuth();
	const router = useRouter();
	const { show, toggleShow } = useShowPassword();

	const headingColor = useColorModeValue('gray.800', 'gray.100');
	const subColor = useColorModeValue('gray.500', 'gray.400');
	const accentColor = useColorModeValue('facebook.500', 'facebook.300');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const ok = await login(email, password);
			if (!ok) {
				setError("Email yoki parol noto'g'ri");
				return;
			}
			router.push('/student-information-management');
		} catch (err) {
			setError('Kirishda xatolik yuz berdi');
			console.error('SIM login error', err);
		} finally {
			setIsLoading(false);
		}
	};

	if (variant === 'auth') {
		return (
			<Box as="form" onSubmit={handleSubmit} w="full">
				<Stack spacing={4}>
					<Box textAlign="center" pb={1}>
						<Text
							fontSize="xs"
							fontWeight="semibold"
							textTransform="uppercase"
							letterSpacing="wider"
							color={accentColor}
						>
							Inklyuziv Ta&apos;lim
						</Text>
						<Text fontSize="md" fontWeight="semibold" color={headingColor} mt={1}>
							O&apos;quvchi ma&apos;lumotlari tizimi
						</Text>
					</Box>

					{error && (
						<Alert status="error" borderRadius="lg" fontSize="sm">
							<AlertIcon />
							{error}
						</Alert>
					)}

					<FormControl isRequired>
						<FormLabel fontSize="sm" fontWeight="medium" mb={1.5}>
							Email
						</FormLabel>
						<Input
							id="sim-email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="email@example.com"
							h={12}
							fontSize="md"
							borderRadius="lg"
							focusBorderColor="facebook.500"
							disabled={isLoading}
						/>
					</FormControl>

					<FormControl isRequired>
						<FormLabel fontSize="sm" fontWeight="medium" mb={1.5}>
							Parol
						</FormLabel>
						<InputGroup>
							<Input
								id="sim-password"
								type={show ? 'text' : 'password'}
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="••••••••"
								h={12}
								fontSize="md"
								borderRadius="lg"
								focusBorderColor="facebook.500"
								disabled={isLoading}
								pr="3rem"
							/>
							<InputRightElement h={12} w={12}>
								<Icon
									as={show ? AiOutlineEyeInvisible : AiOutlineEye}
									boxSize={5}
									color="gray.500"
									cursor="pointer"
									_hover={{ color: 'gray.700' }}
									onClick={toggleShow}
									aria-label={show ? 'Parolni yashirish' : "Parolni ko'rish"}
								/>
							</InputRightElement>
						</InputGroup>
					</FormControl>

					<Button
						type="submit"
						w="full"
						h={12}
						bgGradient="linear(to-r, facebook.400, gray.400)"
						color="white"
						_hover={{
							bgGradient: 'linear(to-r, facebook.500, gray.500)',
							boxShadow: 'md',
						}}
						_active={{
							bgGradient: 'linear(to-r, facebook.600, gray.600)',
						}}
						fontSize="md"
						fontWeight="semibold"
						borderRadius="lg"
						isLoading={isLoading}
						loadingText="Kutilmoqda..."
					>
						Kirish
					</Button>

					<Text fontSize="xs" color={subColor} textAlign="center" pt={1}>
						Admin yoki direktor hisobi bilan kiring
					</Text>
				</Stack>
			</Box>
		);
	}

	return (
		<div className="sim-app w-full">
			<div className="bg-white rounded-2xl border border-gray-200 p-7 sm:p-8 shadow-md">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
						<LogIn className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Inklyuziv Ta&apos;lim
					</h2>
					<p className="text-gray-500 text-base mt-2">Tizimga kirish</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-base">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
							<p>{error}</p>
						</div>
					)}

					<div>
						<label htmlFor="sim-email-standalone" className={simLabel}>
							Email
						</label>
						<input
							id="sim-email-standalone"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							className={simInput}
							placeholder="email@example.com"
							required
							disabled={isLoading}
						/>
					</div>

					<div>
						<label htmlFor="sim-password-standalone" className={simLabel}>
							Parol
						</label>
						<div className="relative">
							<input
								id="sim-password-standalone"
								type={show ? 'text' : 'password'}
								value={password}
								onChange={e => setPassword(e.target.value)}
								className={`${simInput} pr-12`}
								placeholder="••••••••"
								required
								disabled={isLoading}
							/>
							<button
								type="button"
								onClick={toggleShow}
								className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
								aria-label={show ? 'Parolni yashirish' : "Parolni ko'rish"}
								tabIndex={-1}
							>
								{show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className={`${simBtnPrimary} w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg`}
					>
						{isLoading ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<LogIn className="w-5 h-5" />
						)}
						{isLoading ? 'Kutilmoqda...' : 'Kirish'}
					</button>
				</form>
			</div>
		</div>
	);
}
// sssss