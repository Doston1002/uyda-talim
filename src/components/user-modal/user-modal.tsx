import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminService } from 'src/services/admin.service';
import { UserType } from 'src/interfaces/user.interface';
import ErrorAlert from '../error-alert/error-alert';

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	userValue?: UserType | null;
	onSuccess: () => void;
}

const UserModal: FC<UserModalProps> = ({ isOpen, onClose, userValue, onSuccess }): JSX.Element => {
	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'ADMIN' | 'INSTRUCTOR' | 'USER'>('USER');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const toast = useToast();
	const { t } = useTranslation();

	useEffect(() => {
		if (userValue) {
			setEmail(userValue.email || '');
			setFullName(userValue.fullName || '');
			setRole(userValue.role || 'USER');
			setPassword('');
		} else {
			setEmail('');
			setFullName('');
			setPassword('');
			setRole('USER');
		}
		setError('');
	}, [userValue, isOpen]);

	const handleSubmit = async () => {
		setError('');
		
		if (!email || !fullName) {
			setError(t('please_fill_all_fields', { ns: 'admin' }) as string);
			return;
		}

		if (!userValue && !password) {
			setError(t('password_is_required', { ns: 'global' }) as string);
			return;
		}

		try {
			setIsLoading(true);
			
			if (userValue) {
				// Update existing user
				await AdminService.updateUser(
					userValue.id,
					email,
					fullName,
					password || undefined,
					role
				);
				
				toast({
					title: t('successfully_edited', { ns: 'global' }),
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top-right',
				});
			} else {
				// Create new user
				await AdminService.createUser(email, fullName, password, role);
				
				toast({
					title: t('successfully_created_user', { ns: 'admin' }),
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top-right',
				});
			}
			
			onSuccess();
			onClose();
		} catch (err: any) {
			const errorMessage = err?.response?.data?.message || '';
			
			// Email mavjud bo'lsa maxsus xabar
			if (errorMessage.includes('already exists') || errorMessage.includes('Email already exists')) {
				setError(t('email_already_exists', { ns: 'admin' }) as string);
			} else {
				setError(errorMessage || t('error_occurred', { ns: 'global' }));
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					{userValue ? t('edit_user', { ns: 'admin' }) : t('add_user', { ns: 'admin' })}
				</ModalHeader>
				<ModalCloseButton />
				
				<ModalBody>
					{error && <ErrorAlert title={error} clearHandler={() => setError('')} />}
					
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>{t('email', { ns: 'instructor' })}</FormLabel>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="example@mail.com"
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>{t('full_name', { ns: 'instructor' })}</FormLabel>
							<Input
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder={t('full_name', { ns: 'instructor' }) || ''}
							/>
						</FormControl>

						<FormControl isRequired={!userValue}>
							<FormLabel>
								{t('password', { ns: 'global' })}
								{userValue && ` (${t('leave_empty_to_keep', { ns: 'admin' })})`}
							</FormLabel>
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={userValue ? '********' : ''}
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>{t('role', { ns: 'admin' })}</FormLabel>
							<Select value={role} onChange={(e) => setRole(e.target.value as any)}>
								<option value="USER">USER</option>
								<option value="INSTRUCTOR">INSTRUCTOR</option>
								<option value="ADMIN">ADMIN</option>
							</Select>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						{t('cancel', { ns: 'admin' })}
					</Button>
					<Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
						{userValue ? t('save_changes', { ns: 'admin' }) : t('add_user', { ns: 'admin' })}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UserModal;

