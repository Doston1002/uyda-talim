import { SimApp, SimAuthProvider } from 'src/student-information-management';
import Seo from 'src/layouts/seo/seo';

export default function StudentInformationManagementPage() {
  return (
    <Seo
      metaTitle="Inklyuziv Ta'lim | Boshqaruv paneli"
      metaDescription="Inklyuziv ta'lim tizimi — o'quvchilar va direktorlarni boshqarish"
    >
      <SimAuthProvider>
        <SimApp />
      </SimAuthProvider>
    </Seo>
  );
}
