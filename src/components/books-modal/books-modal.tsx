import {
	Box,
	Button,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { Form, Formik, FormikValues } from 'formik';
import { FC, useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { FileService } from 'src/services/file.service';
import { BooksValidation } from 'src/validations/books.validation';
import ErrorAlert from '../error-alert/error-alert';
import SelectField from '../select-field/select-field';
import TextFiled from '../text-filed/text-filed';
import { BookModalProps } from './books-modal.props';
import { createBooksCategory } from 'src/config/constants';

const BooksModal: FC<BookModalProps> = ({ isOpen, onClose, booksValue }): JSX.Element => {
	const [values, setValues] = useState(data);
	const [pdfFile, setPdfFile] = useState<File | string | null>();
	const [errorPdfFile, setErrorPdfFile] = useState('');

	const { startCreateBooksLoading, createBooks, clearBooksError, updateBooks } = useActions();
	const { isLoading, error } = useTypedSelector(state => state.books);
	const toast = useToast();
	const { t } = useTranslation();

	const handlePdfChange = (file: File) => {
		setPdfFile(file);
	};

	const onSubmit = async (fomrikValues: FormikValues) => {
		if (!pdfFile) {
			setErrorPdfFile(t('pdf_is_requried', { ns: 'global' }) as string);
			return;
		}
		
		startCreateBooksLoading();

		// Upload PDF
		let pdfUrl = pdfFile;
		if (typeof pdfFile !== 'string') {
			const formData = new FormData();
			formData.append('image', pdfFile as File);
			const response = await FileService.fileUpload(formData, 'books');
			pdfUrl = response.url;
		}

		if (!booksValue) {
			createBooks({
				title: fomrikValues.title,
				pdf: pdfUrl as string,
				image: '', // Empty string for image
				category: fomrikValues.category,
				callback: () => {
					toast({
						title: t('successfully_created_course', { ns: 'instructor' }),
						position: 'top-right',
						isClosable: true,
						status: 'success',
					});
					setPdfFile(null);
					onClose();
				},
			});
		} else {
			updateBooks({
				title: fomrikValues.title,
				pdf: pdfUrl as string,
				_id: booksValue._id,
				category: fomrikValues.category,
				image: booksValue.image || '', // Keep existing image or empty
				callback: () => {
					toast({
						title: t('successfully_edited', { ns: 'instructor' }),
						position: 'top-right',
						isClosable: true,
						status: 'success',
					});
					setPdfFile(null);
					onClose();
				},
			});
		}
	};

	useEffect(() => {
		setErrorPdfFile('');
		if (booksValue) {
			setValues(booksValue);
			setPdfFile(booksValue.pdf);
		} else {
			setValues(data);
			setPdfFile(null);
		}
	}, [booksValue]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={'xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add books</ModalHeader>
				<ModalCloseButton />
				<Formik
					onSubmit={onSubmit}
					initialValues={values}
					validationSchema={BooksValidation.createBooks}
					enableReinitialize
				>
					<Form>
						<ModalBody>
							<>{error && <ErrorAlert title={error as string} clearHandler={clearBooksError} />}</>
							<VStack>
								<TextFiled
									name='title'
									label={t('title', { ns: 'instructor' })}
									placeholder={'Harry Poter'}
								/>
								<SelectField
									name='category'
									label={t('category', { ns: 'instructor' })}
									placeholder='-'
									arrOptions={createBooksCategory}
								/>

								{/* PDF File Upload */}
								<Box w={'full'}>
									<Text mb={2} fontSize='14px' fontWeight='bold'>
										{t('pdf_file', { ns: 'admin' })} *
									</Text>
									
									{pdfFile && (
										<Box 
											pos={'relative'} 
											w={'full'} 
											p={4} 
											mb={3}
											border='2px' 
											borderColor='green.500' 
											borderRadius='8px'
											bg='green.50'
										>
											<Text fontSize='14px' color='green.700'>
												📄 {typeof pdfFile === 'string' ? 'PDF yuklangan' : pdfFile.name}
											</Text>
											<Icon
												as={FaTimes}
												fontSize={20}
												pos={'absolute'}
												right={2}
												top={2}
												cursor={'pointer'}
												onClick={() => setPdfFile(null)}
											/>
										</Box>
									)}
									
									<Box>
										<FileUploader
											handleChange={handlePdfChange}
											name='pdfFile'
											types={['PDF']}
											style={{ minWidth: '100%' }}
										/>
										{errorPdfFile && (
											<Text mt={2} fontSize='14px' color='red.500'>
												{errorPdfFile}
											</Text>
										)}
									</Box>
								</Box>
							</VStack>
						</ModalBody>

						<ModalFooter>
							<Button type='submit' isLoading={isLoading} colorScheme='blue' mr={3}>
								{booksValue ? t('edit_book', { ns: 'admin' }) : t('add_book', { ns: 'admin' })}
							</Button>
						</ModalFooter>
					</Form>
				</Formik>
			</ModalContent>
		</Modal>
	);
};

export default BooksModal;

const data = {
	title: '',
	category: '',
};
