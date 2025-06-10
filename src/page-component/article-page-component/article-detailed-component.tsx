// import {
// 	Avatar,
// 	Box,
// 	Card,
// 	CardBody,
// 	Heading,
// 	HStack,
// 	Icon,
// 	Image,
// 	Stack,
// 	Text,
// 	useToast,
// } from '@chakra-ui/react';
// import { RichText } from '@graphcms/rich-text-react-renderer';
// import { format } from 'date-fns';
// import Cookies from 'js-cookie';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { AiFillPlayCircle } from 'react-icons/ai';
// import { BsFillStopCircleFill } from 'react-icons/bs';
// import { useSpeechSynthesis } from 'react-speech-kit';
// import { voiceLanguages } from 'src/config/constants';
// import { calculateEstimatedReadingTime } from 'src/helpers/time.helper';
// import { ArticleDetailedProps } from './article-page-component.props';

// const ArticleDetailedComponent = ({ article }: ArticleDetailedProps) => {
// 	const [myVoice, setMyVoice] = useState();

// 	const { t } = useTranslation();
// 	const toast = useToast();
// 	const router = useRouter();

// 	const onEnd = () => {
// 		toast({
// 			title: 'The End',
// 			status: 'info',
// 			position: 'top-right',
// 			isClosable: true,
// 		});
// 	};

// 	const { speak, voices, cancel, speaking, supported } = useSpeechSynthesis({
// 		onEnd,
// 	});

// 	useEffect(() => {
// 		const lng = Cookies.get('i18next');
// 		const currentLanguage = voiceLanguages.find(item => item.language === lng);
// 		const supportLanguage = voiceLanguages.map(c => c.voiceUrl);
// 		const allSuportVoices = voices.filter(item => supportLanguage.includes(item.voiceURI));
// 		const currentVoice = allSuportVoices.find(item => item.lang === currentLanguage?.codes);

// 		setMyVoice(currentVoice);
// 	}, [voices, router]);

// 	return (
// 		<>
			
// 		mentor
// 		</>
// 	);
// };

// export default ArticleDetailedComponent;

import React from 'react'

const ArticleDetailedComponent = () => {
  return (
	<div>ArticleDetailedComponent</div>
  )
}

export default ArticleDetailedComponent