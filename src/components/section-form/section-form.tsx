import { Box, Button, Flex, useColorModeValue, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikValues } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActions } from 'src/hooks/useActions';
import { useTypedSelector } from 'src/hooks/useTypedSelector';
import { CourseValidation } from 'src/validations/course.validation';
import ErrorAlert from '../error-alert/error-alert';
import TextFiled from '../text-filed/text-filed';
import TextAreaField from '../text-area-field/text-area-field';
import { SectionFormProps } from './section-form.props';
import dynamic from 'next/dynamic';
import { editLessonModules } from 'src/config/editor.config';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const SectionForm = ({ onClose, values }: SectionFormProps) => {
	const [initialValues, setInitialValues] = useState<{ title: string }>({ title: '' });

	const { createSection, clearSectionError, editSection } = useActions();
	const { error, isLoading } = useTypedSelector(state => state.section);
	const { course } = useTypedSelector(state => state.instructor);
	const { t } = useTranslation();
	const toast = useToast();

	const onSubmit = (formValues: FormikValues) => {
    if (values) {
			editSection({
				sectionId: values.id,
				title: formValues.title,
				callback: () => {
					toast({
						title: t('successfully_edited', { ns: 'instructor' }),
						position: 'top-right',
						isClosable: true,
					});
					onClose();
				},
			});
    } else {
			createSection({
        title: formValues.title,
				courseId: course?._id as string,
        name: formValues.name,
        embedVideo: formValues.embedVideo,
        hour: Number(formValues.hour || 0),
        minute: Number(formValues.minute || 0),
        second: Number(formValues.second || 0),
        material: formValues.material,
				callback: () => {
					toast({
						title: t('successfully_created_course', { ns: 'instructor' }),
						position: 'top-right',
						isClosable: true,
					});
					onClose();
				},
			});
		}
	};

	useEffect(() => {
		setInitialValues({ title: values?.title as string });
	}, [values]);

	return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues as any}
      validationSchema={values ? CourseValidation.section() : CourseValidation.lesson()}
      enableReinitialize
    >
      {formik => (
        <Form>
          <>{error && <ErrorAlert title={error as string} clearHandler={clearSectionError} />}</>
          {/* Sarlovha */}
          <TextFiled name='title' label={t('title', { ns: 'instructor' })} />

          {/* Faqat yaratishda: Ism, Video, Vaqt, Material */}
          {!values && (
            <>
              <TextFiled name='name' label={t('name', { ns: 'instructor' })} />
              <TextAreaField
                name='embedVideo'
                label={t('embed_video', { ns: 'instructor' }) || 'Embed video'}
              />
              <Flex gap={3}>
                <TextFiled name='hour' label={t('hour', { ns: 'instructor' })} type='number' />
                <TextFiled name='minute' label={t('minute', { ns: 'instructor' })} type='number' />
                <TextFiled name='second' label={t('second', { ns: 'instructor' })} type='number' />
              </Flex>
              <Box>
                <ReactQuill
                  modules={editLessonModules}
                  onChange={data => formik.setFieldValue('material', data)}
                  value={(formik.values as any)?.material}
                />
              </Box>
            </>
          )}

          <Button
            h={14}
            mt={4}
            w={'full'}
            type={'submit'}
            isLoading={isLoading}
            loadingText={`${t('loading', { ns: 'global' })}`}
          >
            {t('search_input_btn', { ns: 'courses' })}
          </Button>
        </Form>
      )}
    </Formik>
	);
};

export default SectionForm;
