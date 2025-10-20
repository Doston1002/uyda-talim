import { Box, Button, Card, CardBody, Input, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../section-title/section-title';

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email) {
		setError(t('newsletter_error_empty', { ns: 'home' }) as string);

      return;
    }

    setError('');
    // Bu yerda API chaqiruvini amalga oshirish mumkin
    console.log('Email submitted:', email);

    setEmail('');
  };

  return (
    <Card mt={10}>
      <CardBody minH={'50vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Stack spacing={3}>
          <SectionTitle
            textAlign={'center'}
            maxW={'container.sm'}
            title={t('newsletter_title', { ns: 'home' })}
            subtitle={t('newsletter_description', { ns: 'home' })}
          />
          <Box pos={'relative'}>
            <Input
              h={14}
              w={'full'}
              bg={'white'}
              color={'gray.900'}
              placeholder={t('newsletter_placeholder', { ns: 'home' }) || ''}
              _placeholder={{ color: 'gray.500' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderColor={error ? 'red.500' : 'gray.200'}
            />
            <Button
              pos={'absolute'}
              right={2}
              top={2}
              colorScheme={'gray'}
              zIndex={999}
              onClick={handleSubmit}
            >
              {t('newsletter_submit', { ns: 'home' })}
            </Button>
            {error && <Text color="red.500" mt={1}>{error}</Text>}
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default Newsletter;
