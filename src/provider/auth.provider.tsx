import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect } from 'react';
import { useActions } from 'src/hooks/useActions';
import { useAuth } from 'src/hooks/useAuth';

interface Props {
	children: ReactNode;
}

const AuthProvider: FC<Props> = ({ children }): JSX.Element => {
	const { user, isLoading } = useAuth();
	const { logout, checkAuth } = useActions();
	const { pathname } = useRouter();

	useEffect(() => {
		const refreshToken = Cookies.get('refresh');
		if (refreshToken) checkAuth();
	}, []);

	useEffect(() => {
		const refreshToken = Cookies.get('refresh');
		if (!refreshToken && user) logout();
	}, [pathname]);

	// Dashboard va boshqa himoyalangan routelar
	const protectedRoutes = ['/dashboard', '/admin', '/instructor'];
	const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

	useEffect(() => {
		if (!isLoading && isProtectedRoute && !user) {
			// Agar foydalanuvchi yo'q bo'lsa va himoyalangan route bo'lsa
			window.location.href = '/';
		}
	}, [user, isLoading, pathname, isProtectedRoute]);

	return <>{children}</>;
};

export default AuthProvider;
