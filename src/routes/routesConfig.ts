import { HomePage, LoginPage, SignupPage } from "@/components/pages";

import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from "@/core/utils";

export const publicRoutes = [
	{ path: SIGNUP_ROUTE, Component: SignupPage },
	{ path: LOGIN_ROUTE, Component: LoginPage },
];

export const privateRoutes = [{ path: HOME_ROUTE, Component: HomePage }];
