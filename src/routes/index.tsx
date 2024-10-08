import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "@/core/hooks";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/core/utils";

import { privateRoutes, publicRoutes } from "./routesConfig";

const AppRoutes = () => {
	const { isAuth } = useAuth();

	return isAuth ? (
		<Routes>
			{privateRoutes.map(({ path, Component }) => (
				<Route key={path} path={path} element={<Component />} />
			))}
			<Route path="*" element={<Navigate to={HOME_ROUTE} />} />
		</Routes>
	) : (
		<Routes>
			{publicRoutes.map(({ path, Component }) => (
				<Route key={path} path={path} element={<Component />} />
			))}
			<Route path="*" element={<Navigate to={LOGIN_ROUTE} />} />
		</Routes>
	);
};

export default AppRoutes;
