import { Button, Card, CardBody, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactPageComponent = () => {
	const { t } = useTranslation();

	// Form state
	const [formData, setFormData] = useState({ fullName: '', phone: '', message: '' });

	// Handle form input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = async () => {
		const { fullName, phone, message } = formData;

		// Telefon raqam validatsiyasi
		const phoneRegex = /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/;

		if (!fullName || !phone || !message) {
			alert(t('contact_form_error', { ns: 'global' }));
			return;
		}

		if (!phoneRegex.test(phone)) {
			alert(t('contact_phone_invalid', { ns: 'global' }));
			return;
		}

		const text = `
<b>Yangi Murojaat:</b> \n
<b>Ism:</b> ${fullName}\n
<b>Phone:</b> ${phone}\n
<b>Xabar:</b> ${message}
`;

		const token = "7997799470:AAEg5oRtvteGcb_r6zAwzaiY3C51p1Q2KTA";
		const chat_id = "5531717864";

		const url = `https://api.telegram.org/bot${token}/sendMessage`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chat_id: chat_id,
					text: text,
					parse_mode: "HTML",
				}),
			});

			const data = await response.json();

			if (data.ok) {
				alert(t('habaringiz yuborildi tez orada aloqaga chiqamiz', { ns: 'global' }));
				setFormData({ fullName: '', phone: '', message: '' });
			} else {
				alert(t('contact_error', { ns: 'global' }));
			}
		} catch (error) {
			console.error(error);
			alert(t('contact_error', { ns: 'global' }));
		}
	};

	return (
		<Flex h={'90vh'} w={'90vw'} justify={'flex-start'} direction={{ base: 'column', lg: 'row' }} align={'center'} gap={'4'}>
			<Card w={{ base: '100%', lg: '60%' }}>
				<CardBody>
					<Heading fontSize={'2xl'}>{t('contact_heading', { ns: 'global' })}</Heading>
					<Text fontSize={'lg'} mt={4}>
						{t('contact_text', { ns: 'global' })}
					</Text>
					<Stack spacing={4} mt={5}>
						<FormControl>
							<FormLabel>{t('contact_name', { ns: 'global' })}</FormLabel>
							<Input
								name="fullName"
								type="text"
								placeholder="Ismingizni kiriting"
								h={14}
								value={formData.fullName}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>{t('contact_phone', { ns: 'global' })}</FormLabel>
							<Input
								name="phone"
								type="number"
								placeholder="+998 90 123 45 67"
								h={14}
								value={formData.phone}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>{t('contact_message', { ns: 'global' })}</FormLabel>
							<Textarea
								name="message"
								placeholder="Xabaringizni kiriting"
								height="150px"
								value={formData.message}
								onChange={handleChange}
							/>
						</FormControl>
						<Button w={'full'} h={14} colorScheme={'gray'} onClick={handleSubmit}>
							{t('contact_btn', { ns: 'global' })}
						</Button>
					</Stack>
				</CardBody>
			</Card>
		</Flex>
	);
};

export default ContactPageComponent;
