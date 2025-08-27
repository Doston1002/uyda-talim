import { NextPage } from 'next';
import { withLayout } from 'src/layouts/layout';
import { useEffect, useState } from "react";
import { UserDashboardPageComponent } from 'src/page-component';

const Dashboard: NextPage = () => {
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
	  fetch("https://api.uydatalim.uzedu.uz/api/auth/me", {
		method: "GET",
		credentials: "include", // cookie yuboriladi
	  })
		.then((res) => res.json())
		.then((data) => setUser(data))
		.catch((err) => console.error("❌ Userni olishda xato:", err));
	}, []);
  
	if (!user) {
	  return <div style={{ padding: 40 }}>⏳ Yuklanmoqda...</div>;
	}
	return <>
	<UserDashboardPageComponent />;
	<div style={{ padding: 40 }}>
      <h1>👤 Salom, {user.full_name}!</h1>
      <p>PINFL: {user.pin}</p>
      <p>User ID: {user.user_id}</p>
    </div>
	</> 

};

export default withLayout(Dashboard);
