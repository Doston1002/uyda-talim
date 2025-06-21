import {
	Box,
	Button,
	Flex,
	Grid,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineDownload } from 'react-icons/ai';
import SectionTitle from 'src/components/section-title/section-title';

// Sinflar ro‘yxati
const SINFLAR = [
	'1-sinf',
	'2-sinf',
	'3-sinf',
	'4-sinf',
	'5-sinf',
	'6-sinf',
	'7-sinf',
	'8-sinf',
	'9-sinf',
	'10-sinf',
	'11-sinf',
];

// Har bir kitob uchun haqiqiy title va file ko‘rsatiladi
const booksData = [
	// 1-sinf
	{ id: '1-sinf', title: 'Alifbe', file: '/books/1-sinf/1-sinf.pdf' },
	{ id: '1-sinf', title: 'Matematika', file: '/books/1-sinf/matematika.pdf' },
	{ id: '1-sinf', title: 'Ona tili', file: '/books/1-sinf/ona-tili.pdf' },
	{ id: '1-sinf', title: 'Tabiat', file: '/books/1-sinf/tabiat.pdf' },
	{ id: '1-sinf', title: 'Texnologiya', file: '/books/1-sinf/texnologiya.pdf' },
	{ id: '1-sinf', title: 'Ingliz tili', file: '/books/1-sinf/ingliz-tili.pdf' },
	{ id: '1-sinf', title: 'Rus tili', file: '/books/1-sinf/rus-tili.pdf' },
	{ id: '1-sinf', title: 'Tasviriy san\'at', file: '/books/1-sinf/tasviriy-sanat.pdf' },
	{ id: '1-sinf', title: 'Jismoniy tarbiya', file: '/books/1-sinf/jismoniy-tarbiya.pdf' },
	{ id: '1-sinf', title: 'Musiqa', file: '/books/1-sinf/musiqa.pdf' },

	// 2-sinf
	{ id: '2-sinf', title: 'Informatika', file: '/books/2-sinf/2-sinf-informatika.pdf' },
	{ id: '2-sinf', title: "O'qish savodxonligi (2-mashq daftari)", file: "/books/2-sinf/2_sinf_o'qish_savodxonligi_2_mashq_daftari.pdf" },
	{ id: '2-sinf', title: 'Ona tili (1-qism)', file: '/books/2-sinf/2-sinf-Ona-tili-1-qism.pdf' },
	{ id: '2-sinf', title: 'Ona tili (2-qism)', file: '/books/2-sinf/2-sinf-Ona-tili-2-qism.pdf' },
	{ id: '2-sinf', title: 'Ona tili (3-qism)', file: '/books/2-sinf/2-sinf-Ona-tili-3-qism.pdf' },
	{ id: '2-sinf', title: 'Ona tili (4-qism)', file: '/books/2-sinf/2-sinf-Ona-tili-4-qism.pdf' },
	{ id: '2-sinf', title: "O'qish savodxonligi (1-qism)", file: "/books/2-sinf/2-sinf-O'qish-savodxonligi-1-qism.pdf" },
	{ id: '2-sinf', title: "O'qish savodxonligi (2-qism)", file: "/books/2-sinf/2-sinf-O'qish-savodxonligi-2-qism.pdf" },
	{ id: '2-sinf', title: "O'qish savodxonligi (3-qism)", file: "/books/2-sinf/2-sinf-O'qish-savodxonligi-3-qism.pdf" },
	{ id: '2-sinf', title: "O'qish savodxonligi (4-qism)", file: "/books/2-sinf/2-sinf-O'qish-savodxonligi-4-qism.pdf" },
	{ id: '2-sinf', title: 'Matematika (1-qism)', file: '/books/2-sinf/2-sinf-Matematika-1-qism.pdf' },
	{ id: '2-sinf', title: 'Matematika (2-qism)', file: '/books/2-sinf/2-sinf-Matematika-2-qism.pdf' },
	{ id: '2-sinf', title: 'Matematika (3-qism)', file: '/books/2-sinf/2-sinf-Matematika-3-qism.pdf' },
	{ id: '2-sinf', title: 'Matematika (4-qism)', file: '/books/2-sinf/2-sinf-Matematika-4-qism.pdf' },
	{ id: '2-sinf', title: 'Jismoniy tarbiya (Ish daftari)', file: '/books/2-sinf/2-sinf-Jismoniy-tarbiya-Ish-daftari.pdf' },
	{ id: '2-sinf', title: 'Rus tili', file: '/books/2-sinf/2-klass-rus-tili.pdf' },
	{ id: '2-sinf', title: 'Tarbiya', file: '/books/2-sinf/2-sinf-Tarbiya.pdf' },
	{ id: '2-sinf', title: 'Musiqiy savodxonlik', file: '/books/2-sinf/2-sinf-Musiqiy-savodxonlik.pdf' },
	{ id: '2-sinf', title: 'Texnologiya', file: '/books/2-sinf/2-sinf-Texnalogiya.pdf' },
	{ id: '2-sinf', title: 'Tabiiy fanlar (1-qism)', file: '/books/2-sinf/2-sinf-Tabiy-fanlar-1-qism.pdf' },
	{ id: '2-sinf', title: 'Tasviriy san\'at', file: '/books/2-sinf/2-sinf-Tasviriy-sanat.pdf' },
	{ id: '2-sinf', title: 'Tabiiy fanlar (2-qism)', file: '/books/2-sinf/2-sinf-Tabiiy-fanlar-2-qism.pdf' },

	// ... boshqa sinflar va kitoblar shu tarzda davom etadi
];

const BooksPageComponent = () => {
	const [filter, setFilter] = useState<string>('1-sinf');
	const backgroundColor = useColorModeValue('gray.200', 'gray.900');
	const { t } = useTranslation();

	const filteredBooks = booksData.filter((book) => book.id === filter);

	return (
		<Box mb={20}>
			<SectionTitle
				title={t('title', { ns: 'books' })}
				subtitle={t('description', { ns: 'books' })}
				textAlign={'center'}
				pt={4}
			/>
			<Flex justify={'center'} mt={5} flexWrap={'wrap'}>
				{SINFLAR.map((sinf, idx) => (
					<Button
						key={sinf}
						colorScheme={'gray'}
						variant={filter === sinf ? 'solid' : 'outline'}
						borderRadius={0}
						borderLeftRadius={0}
						borderRightRadius={idx === SINFLAR.length - 1 ? 'md' : 0}
						onClick={() => setFilter(sinf)}
					>
						{sinf}
					</Button>
				))}
			</Flex>

			<Grid
				gridTemplateColumns={{
					base: 'repeat(1, 1fr)',
					md: 'repeat(2, 1fr)',
					lg: 'repeat(3, 1fr)',
				}}
				rowGap={8}
				gap={4}
				mt={5}
			>
				{filteredBooks.map((book, idx) => (
					<Box
						key={book.id + book.title}
						p={4}
						bg={backgroundColor}
						borderRadius="md"
						boxShadow="md"
						display="flex"
						alignItems="center"
						justifyContent="space-between"
					>
						<Text fontWeight="bold">{book.title}</Text>
						<a href={book.file} download>
							<Button
								colorScheme="blue"
								leftIcon={<AiOutlineDownload />}
								variant="solid"
							>
								Yuklab olish
							</Button>
						</a>
					</Box>
				))}
			</Grid>
		</Box>
	);
};

export default BooksPageComponent;