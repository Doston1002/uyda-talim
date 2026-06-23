export type IllnessDurationType = '6_months' | 'academic_year' | '6_months_to_1_year';

export interface IllnessTypeOption {
  id: string;
  category: string;
  label: string;
  duration: IllnessDurationType;
  durationLabel: string;
}

export const ILLNESS_CATEGORIES = [
  'Somatik kasalliklar',
  'Psixonevrologik kasalliklar',
  'Xirurgik kasalliklar',
  'Teri kasalliklari',
] as const;

export const ILLNESS_TYPES: IllnessTypeOption[] = [
  // I. Somatik kasalliklar
  {
    id: 'somatik:biriktiruvchi_toqima',
    category: 'Somatik kasalliklar',
    label:
      'Biriktiruvchi toʻqimaning tizimli shikastlanishi (tizimli qizil yugurik, dermatopoliomiozit), yoshlar revmatoid artriti va tugunchali periarteritning ogʻir turlari',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:yurak_kasalligi',
    category: 'Somatik kasalliklar',
    label:
      'Yurak va qon aylanish tizimining tugʻma nuqsonlari (dekompensatsiya davri, turgʻun yurak va qon aylanishi yetishmovchiligining II va III darajasi)',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:tetrada_fallo',
    category: 'Somatik kasalliklar',
    label: 'Ogʻir darajadagi tetrada Fallo kasalligi',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:opka_bronx',
    category: 'Somatik kasalliklar',
    label:
      'Tugʻma va orttirilgan tusdagi oʻpka-bronx kasalliklarining II va III darajali turgʻun nafas yetishmovchiligi',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:asma',
    category: 'Somatik kasalliklar',
    label: 'Astmaning ogʻir darajasi (haftada bir necha marta yoki har kuni xuruj qilganda)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:glom',
    category: 'Somatik kasalliklar',
    label:
      'Surunkali glomerulonefrit (buyrak funksiyasi buzilishining yaqqol klinik koʻrinishida, qaytalash davridagi sitostatik va steiroid davo oʻtkazilgan davrida)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:piyelonefrit',
    category: 'Somatik kasalliklar',
    label:
      'Surunkali piyelonefrit va surunkali obstruktiv piyelonefrit (buyrak funksiyasi buzilishining yaqqol klinik koʻrinish davri)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:otkir_glom',
    category: 'Somatik kasalliklar',
    label:
      'Oʻtkir glomerulonefrit birlamchi davolashdan soʻng remissiya davrigacha, birlamchi va ikkilamchi nefrotik sindromi steroid va sitostatik davo oʻtkazilgan davrida',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:onkologiya',
    category: 'Somatik kasalliklar',
    label: 'Turli organlarning xavfli oʻsmalari',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:mukovissidoz',
    category: 'Somatik kasalliklar',
    label: 'Mukovissedozning ogʻir turi',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:seliakiya',
    category: 'Somatik kasalliklar',
    label: 'Seliakiyaning ogʻir turi (asoratlar bilan kechish davri)',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:yarali_kolit',
    category: 'Somatik kasalliklar',
    label: 'Nospetsifik yarali kolitning ogʻir turi (qaytalanuvchi kechishi)',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:kron',
    category: 'Somatik kasalliklar',
    label: 'Kron kasalligining ogʻir darajasi (asoratlar bilan kechish davri)',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:jigar_sirrozi',
    category: 'Somatik kasalliklar',
    label: 'Jigar sirrozining dekompensatsiya darajasi',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:oqsil_yetishmovchiligi',
    category: 'Somatik kasalliklar',
    label:
      'Nomaʼlum etiologiyali oqsil-energetik yetishmovchiligining ogʻir darajasi (vazn tanqisligi 30% va undan ortiq holatlarda)',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:leykoz',
    category: 'Somatik kasalliklar',
    label: 'Oʻtkir leykoz, aplastik kamqonliklar, irsiy gemolitik kamqonliklar',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'somatik:gemorragik',
    category: 'Somatik kasalliklar',
    label:
      'Ogʻir gemorragik kriz bilan kechuvchi doimo qaytalanib turuvchi surunkali trombotsitopatiya, trombotsitopenik purpura, gemofiliya, Villibrand va Glnsman kasalliklari',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'somatik:immun_tanqisligi',
    category: 'Somatik kasalliklar',
    label: 'Tugʻma va orttirilgan immun tanqisligi holatlari',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },

  // II. Psixonevrologik kasalliklar
  {
    id: 'psix:ruhiy',
    category: 'Psixonevrologik kasalliklar',
    label: 'Ruhiy holati buzilganligi (shizofreniya, psixozning zoʻraygan davri)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:nevroz',
    category: 'Psixonevrologik kasalliklar',
    label:
      'Ogʻir nevrozlar (nevrasteniya, psixoasteniya), nevroz holatlarining zoʻraygan davri, shu jumladan, enkoprez, kunduzgi turgʻun enurez, dekompensatsiya davridagi duduqlanish',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:ensefaloastenik',
    category: 'Psixonevrologik kasalliklar',
    label: 'Turli etiologiyali yaqqol koʻrinadigan ensefaloastenik holatlar (travmatik, yuqumli, somatik)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:psixopatiya',
    category: 'Psixonevrologik kasalliklar',
    label: 'Psixopatiyalar, dekompensatsiya davridagi psixopatik holatlar',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:epilepsiya',
    category: 'Psixonevrologik kasalliklar',
    label: 'Epilepsiyaning zoʻraygan davrida',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:harakat_buzilishi',
    category: 'Psixonevrologik kasalliklar',
    label: 'Mustaqil harakat qila olmaslikka olib kelgan tayanch-harakat aʼzolarining buzilishi',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:serebral_falaj',
    category: 'Psixonevrologik kasalliklar',
    label: 'Bolalar serebral falaji va uning asoratlari (yengil turi)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:avtizm',
    category: 'Psixonevrologik kasalliklar',
    label:
      'Bolalar autizmi (xulq-atvor buzilishlari bilan, oʻz-oʻzini boshqara olmaydigan harakatlar sindromi)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:miopatiya',
    category: 'Psixonevrologik kasalliklar',
    label: 'Miopatiya. Miasteniyaning tarqalgan shakli',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'psix:demiyelin',
    category: 'Psixonevrologik kasalliklar',
    label: 'Asab tizimining demiyelinlashtiruvchi kasalliklari (yaqqol namoyon boʻlgan klinika davri)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },

  // III. Xirurgik kasalliklar
  {
    id: 'xir:orqa_miya',
    category: 'Xirurgik kasalliklar',
    label:
      'Tayanch aʼzolarining falaji va toz suyaklari faoliyatining buzilishi bilan bogʻlangan orqa miya churrasi',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'xir:siydik',
    category: 'Xirurgik kasalliklar',
    label:
      'Siydik tuta olmaslik, siydik pufagining ekstrofiyasi, siydik yoʻllarining atoniyasi dekompensatsiyalangan shakli. Najas tuta olmasligi',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'xir:atreziya',
    category: 'Xirurgik kasalliklar',
    label: 'Orqa chiqaruv yoʻllarining atreziyasi',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'xir:oyoqlar',
    category: 'Xirurgik kasalliklar',
    label: 'Turli kasalliklarda oyoqlarning falaji',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'xir:osteomiyelit',
    category: 'Xirurgik kasalliklar',
    label: 'Surunkali tayanch-harakat aʼzolari kasalligi (surunkali osteomiyelit suyak sili, osteoxondropatiya)',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'xir:bosh_miya',
    category: 'Xirurgik kasalliklar',
    label: 'Bosh miya operatsiyasidan keyingi asoratlangan holatlar',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'xir:reabilitatsiya',
    category: 'Xirurgik kasalliklar',
    label: 'Tayanch-harakat tizimida oʻtkazilgan operatsiyalardan keyingi reabilitativ davr',
    duration: '6_months_to_1_year',
    durationLabel: '6 oydan 1 yilgacha',
  },

  // IV. Teri kasalliklari
  {
    id: 'teri:epidermoliz',
    category: 'Teri kasalliklari',
    label: 'Tugʻma bullezepidermoliz',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
  {
    id: 'teri:ihtioz',
    category: 'Teri kasalliklari',
    label: 'Tugʻma ixtiozning zoʻraygan davri',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'teri:psoriaz_yiringli',
    category: 'Teri kasalliklari',
    label: 'Eritrodermiya psoriazining yiringli turi',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'teri:psoriaz_artropatik',
    category: 'Teri kasalliklari',
    label: 'Artropatik psoriazi',
    duration: '6_months',
    durationLabel: '6 oy',
  },
  {
    id: 'teri:teri_sil',
    category: 'Teri kasalliklari',
    label: 'Oʻtkir teri sil kasalligi',
    duration: 'academic_year',
    durationLabel: 'oʻquv yili',
  },
];

const illnessById = new Map(ILLNESS_TYPES.map(item => [item.id, item]));

export function getIllnessById(id: string): IllnessTypeOption | undefined {
  return illnessById.get(id);
}

export function getIllnessLabel(id: string): string {
  return illnessById.get(id)?.label ?? id;
}
