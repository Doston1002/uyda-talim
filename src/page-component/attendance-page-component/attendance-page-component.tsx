import { 
  Button, 
  Card, 
  CardBody, 
  Checkbox, 
  Flex, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Radio, 
  RadioGroup, 
  Select, 
  Stack, 
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AttendancePageComponent = () => {
  const { t } = useTranslation();

  // Regions data
  const regions = [
    { id: 1, name: "Qoraqalpog'iston Respublikasi" },
    { id: 2, name: "Andijon viloyati" },
    { id: 3, name: "Buxoro viloyati" },
    { id: 4, name: "Farg'ona viloyati" },
    { id: 5, name: "Jizzax viloyati" },
    { id: 6, name: "Namangan viloyati" },
    { id: 7, name: "Navoiy viloyati" },
    { id: 8, name: "Samarqand viloyati" },
    { id: 9, name: "Sirdaryo viloyati" },
    { id: 10, name: "Surxondaryo viloyati" },
    { id: 11, name: "Toshkent viloyati" },
    { id: 12, name: "Xorazm viloyati" },
    { id: 13, name: "Toshkent shahri" },
  ];

  // Sample districts data
  const districtsData = {
    1: ["Nukus shahar","Amudaryo tumani", "Beruniy tumani", "Bozatov tumani", "Chimboy tumani", "Ellikqal’a tumani", "Kegeyli tumani", "Mo‘ynoq tumani", "Nukus tumani", "Qonliko‘l tumani", "Qo‘ng‘irot tumani", "Qorao‘zak tumani", "Shumanay tumani", "Taxtako‘pir tumani", "Taqiyatosh tumani", "To‘rtko‘l tumani", "Xo‘jayli tumani"],
    2: ["Andijon tumani", "Asaka tumani", "Baliqchi tumani", "Bo‘z tumani", "Buloqboshi tumani", "Jalolquduq tumani", "Izboskan tumani", "Qo‘rg‘ontepa tumani", "Marhamat tumani", "Oltinko‘l tumani", "Paxtaobod tumani", "Shahrixon tumani", "Ulug‘nor tumani", "Xo‘jaobod tumani"],
    3:["Buxoro tumani", "G‘ijduvon tumani", "Jondor tumani", "Kogon tumani", "Olot tumani", "Peshku tumani", "Qorako‘l tumani", "Qorovulbozor tumani", "Romitan tumani", "Shofirkon tumani", "Vobkent tumani"],
    4:["Arnasoy tumani", "Baxmal tumani", "Do‘stlik tumani", "Forish tumani", "G‘allaorol tumani", "Mirzacho‘l tumani", "Paxtakor tumani", "Sharof Rashidov tumani", "Yangiobod tumani", "Zafarobod tumani", "Zarbdor tumani", "Zomin tumani"],
  };

  // Sample schools data
  const schoolsData = {
    "Nukus shahar":[
  "1-maktab", "2-maktab", "3-maktab", "4-maktab", "5-maktab", "6-maktab", "7-maktab",
  "8-maktab", "9-maktab", "10-maktab", "11-maktab", "12-maktab", "13-maktab", "14-maktab",
  "15-maktab", "16-maktab", "17-maktab", "18-maktab", "19-maktab", "20-maktab", "21-maktab",
  "22-maktab", "23-maktab", "24-maktab", "25-maktab", "26-maktab", "27-maktab", "28-maktab",
  "29-maktab", "30-maktab", "31-maktab", "32-maktab", "33-maktab", "34-maktab", "35-maktab",
  "36-maktab", "37-maktab", "38-maktab", "39-maktab", "40-maktab", "41-maktab", "42-maktab",
  "43-maktab", "44-maktab", "45-maktab", "46-maktab", "47-maktab", "48-maktab", "49-maktab",
  "50-maktab", "51-maktab", "52-maktab", "53-maktab", "54-maktab"
],
  "Amudaryo tumani": [
  "1-maktab", "2-maktab", "3-maktab", "4-maktab", "5-maktab", "6-maktab", "7-maktab", "8-maktab", "9-maktab",
  "10-maktab", "11-maktab", "12-maktab", "13-maktab", "14-maktab", "15-maktab", "16-IDUM", "17-maktab", "18-maktab",
  "19-maktab", "20-maktab", "21-maktab", "22-maktab", "23-maktab", "24-maktab", "25-maktab", "26-maktab", "27-maktab",
  "28-maktab", "29-maktab", "30-maktab", "31-maktab", "32-maktab", "33-maktab", "34-maktab", "35-maktab", "36-maktab",
  "37-maktab", "38-maktab", "39-maktab", "40-maktab", "41-maktab", "42-maktab", "43-maktab", "44-maktab", "45-maktab",
  "46-maktab", "47-maktab", "48-maktab", "49-maktab", "50-maktab", "51-maktab", "52-maktab", "53-maktab", "54-maktab",
  "55-maktab", "56-maktab", "57-maktab", "58-maktab", "59-maktab", "60-maktab", "61-maktab", "62-maktab", "63-maktab",
  "64-maktab", "65-maktab", "66-maktab", "67-maktab", "68-maktab", "69-maktab", "70-maktab", "71-maktab", "72-maktab",
  "73-maktab", "74-maktab", "75-maktab", "76-maktab", "77-maktab", "78-maktab", "79-maktab", "80-maktab", 
  "82-maktab", "83-maktab", "84-maktab", "85-maktab", "86-maktab", "8-IDUM"
],
  "Beruniy tumani": [
  "1-maktab", "2-maktab", "3-maktab", "4-maktab", "5-maktab", "6-maktab", "7-maktab", "8-maktab", "9-maktab",
  "10-maktab", "11-maktab", "12-maktab", "13-maktab", "14-maktab", "15-maktab", "16-maktab", "17-maktab", "18-maktab",
  "19-maktab", "20-maktab", "21-maktab", "22-maktab", "23-maktab", "24-maktab", "25-maktab", "26-maktab", "27-maktab",
  "28-maktab", "29-maktab", "30-maktab", "31-maktab", "32-maktab", "33-maktab", "34-maktab",
  "36-maktab", "37-maktab", "38-maktab", "39-maktab", "40-maktab", "41-maktab", "42-maktab", "43-maktab",
  "44-maktab", "45-maktab", "46-maktab", "47-maktab", "48-maktab", "49-maktab", "50-maktab", "51-maktab",
  "52-maktab", "53-maktab", "54-maktab", "55-maktab", "56-maktab", "57-maktab", "58-maktab", "59-maktab",
  "60-maktab", "61-maktab", "62-maktab", "63-maktab", "64-maktab", "65-maktab", "66-maktab", "67-maktab",
  "68-maktab", "69-maktab", "70-maktab", "71-maktab", "72-maktab"
],
    // Add schools for other districts similarly
  };

  // School classes data
  const schoolClasses = [
    { id: 1, name: "1-sinf" },
    { id: 2, name: "2-sinf" },
    { id: 3, name: "3-sinf" },
    { id: 4, name: "4-sinf" },
    { id: 5, name: "5-sinf" },
    { id: 6, name: "6-sinf" },
    { id: 7, name: "7-sinf" },
    { id: 8, name: "8-sinf" },
    { id: 9, name: "9-sinf" },
    { id: 10, name: "10-sinf" },
    { id: 11, name: "11-sinf" }
  ];

  // Subjects data by class
  const subjectsByClass = {
  "1-sinf": [
  "Ona tili va adabiyot",
  "Chet tili",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "2-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "3-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "4-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "5-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "6-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Matematika",
  "Tabiiy fan (Science)",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "7-sinf":  [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Tasviriy san’at va chizmachilik"
],
    "8-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "9-sinf": [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Tasviriy san’at va chizmachilik",
  "Texnologiya"
],
    "10-sinf":  [
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Tarbiya",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Texnologiya"
],
    "11-sinf":[
  "Ona tili va adabiyot",
  "O‘zbek tili/rus tili",
  "Chet tili",
  "Tarix",
  "Davlat va huquq asoslari",
  "Tarbiya",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Geografiya va iqtisodiyot",
  "Texnologiya"
],
  };

  // Form state
  const [formData, setFormData] = useState({ 
    fullName: '',
    teacherName: '', 
    message: '',
    isAbsent: false,
    teachingMethod: '',
    region: '',
    district: '',
    school: '',
    schoolClass: '',
    subject: ''
  });

  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Handle region change
  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setFormData(prev => ({ ...prev, region: regionId, district: '', school: '' }));
    setDistricts(districtsData[regionId] || []);
    setSchools([]);
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData(prev => ({ ...prev, district: districtName, school: '' }));
    setSchools(schoolsData[districtName] || []);
  };

  // Handle class change
  const handleClassChange = (e) => {
    const className = e.target.value;
    setFormData(prev => ({ ...prev, schoolClass: className, subject: '' }));
    setSubjects(subjectsByClass[className] || []);
  };

  // Handle radio group change
  const handleTeachingMethodChange = (value) => {
    setFormData((prev) => ({ ...prev, teachingMethod: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { 
      fullName, 
      teacherName,
      isAbsent, 
      teachingMethod,
      region,
      district,
      school,
      schoolClass,
      subject
    } = formData;

    if (!fullName || !teacherName || !region || !district || !school || !schoolClass || !subject) {
      alert(t('Ma\'lumotlarni to\'liq to\'ldiring', { ns: 'global' }));
      return;
    }

    // now date
    const now = new Date();
    const dateTimeString = now.toLocaleString(); 
    
    const text = `
    <b>Yangi Murojaat:</b> \n
    <b>Sana va vaqt:</b> ${dateTimeString}\n
    <b>Ismi:</b> ${fullName}\n
    <b>O'qituvchi ismi:</b> ${teacherName}\n
    <b>Hudud:</b> ${regions.find(r => r.id.toString() === region)?.name}\n
    <b>Tuman/Shahar:</b> ${district}\n
    <b>Maktab:</b> ${school}\n
    <b>Sinf:</b> ${schoolClass}\n
    <b>Fan:</b> ${subject}\n
    ${isAbsent ? '<b>Holat:</b> O\'qituvchi darsga kelmadi' : ''}
    <b>Dars olib borishi:</b> ${teachingMethod || 'Mavjud emas'}\n
    `;

    const token = "8127037042:AAHlzOvruTi3H22cxXTK--svT6OZnQVTlkY";
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
        alert(t('yuborgan ma\'lumotlaringiz uchun raxmat', { ns: 'global' }));
        setFormData({ 
          fullName: '', 
          teacherName: '', 
          message: '',
          isAbsent: false,
          teachingMethod: '',
          region: '',
          district: '',
          school: '',
          schoolClass: '',
          subject: ''
        });
        setDistricts([]);
        setSchools([]);
        setSubjects([]);
      } else {
        alert(t('contact_error', { ns: 'global' }));
      }
    } catch (error) {
      console.error(error);
      alert(t('contact_error', { ns: 'global' }));
    }
  };

  return (
    <Flex h={'auto'} minH={'90vh'} justify={'flex-start'} direction={{ base: 'column', lg: 'row' }} align={'center'} gap={'4'}>
      <Card w={{ base: '100%', lg: '100%' }}>
        <CardBody>
          <Heading fontSize={'2xl'}>{t('contact_heading', { ns: 'global' })}</Heading>
          <Text fontSize={'lg'} mt={4}>
            {t('contact_text', { ns: 'global' })}
          </Text>
          <Stack spacing={4} mt={5}>
            {/* Personal Information */}
            <Flex justify={'flex-start'} direction={{ base: 'column', lg: 'row' }} align={'center'} gap={'4'}>
              <FormControl isRequired>
                <FormLabel>{t('full_name', { ns: 'global' })}</FormLabel>
                <Input
                  name="fullName"
                  type="text"
                  placeholder="Ismingizni kiriting"
                  h={14}
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('teacher_name', { ns: 'global' })}</FormLabel>
                <Input
                  name="teacherName"
                  type="text"
                  placeholder="O'qituvchini ismini kiriting"
                  h={14}
                  value={formData.teacherName}
                  onChange={handleChange}
                />
              </FormControl>
            </Flex>

            {/* Region, District, School Selection */}
            <FormControl isRequired>
              <FormLabel>{t('region', { ns: 'global' })}</FormLabel>
              <Select 
                placeholder='Tanlang'
                name="region"
                value={formData.region}
                onChange={handleRegionChange}
              >
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('district', { ns: 'global' })}</FormLabel>
              <Select 
                placeholder='Tanlang'
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                isDisabled={!formData.region}
              >
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t('school', { ns: 'global' })}</FormLabel>
              <Select 
                placeholder='Tanlang'
                name="school"
                value={formData.school}
                onChange={handleChange}
                isDisabled={!formData.district}
              >
                {schools.map((school, index) => (
                  <option key={index} value={school}>{school}</option>
                ))}
              </Select>
            </FormControl>

            {/* School Class and Subject Selection */}
            <Flex justify={'flex-start'} direction={{ base: 'column', lg: 'row' }} align={'center'} gap={'4'}>
              <FormControl isRequired>
                <FormLabel>{t('school_class', { ns: 'global' })}</FormLabel>
                <Select 
                  placeholder='Tanlang'
                  name="schoolClass"
                  value={formData.schoolClass}
                  onChange={handleClassChange}
                >
                  {schoolClasses.map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('subject', { ns: 'global' })}</FormLabel>
                <Select 
                  placeholder='Tanlang'
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  isDisabled={!formData.schoolClass}
                >
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>{t('teaching_method', { ns: 'global' })}</FormLabel>
              <RadioGroup 
                onChange={handleTeachingMethodChange} 
                value={formData.teachingMethod}
              >
                <Stack direction="row">
                  <Radio value="Alo">{t('excellent', { ns: 'global' })}</Radio>
                  <Radio value="Ortra">{t('average', { ns: 'global' })}</Radio>
                  <Radio value="Contransiz">{t('unsatisfactory', { ns: 'global' })}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* Attendance and Teaching Method */}
            <FormControl>
              <Checkbox
                name="isAbsent"
                isChecked={formData.isAbsent}
                onChange={handleChange}
                colorScheme="red"
              >
                {t('teacher_absent', { ns: 'global' })}
              </Checkbox>
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

export default AttendancePageComponent;