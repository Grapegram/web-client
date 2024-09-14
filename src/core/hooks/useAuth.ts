import { useAppSelector } from "./reduxHooks";

export const useAuth = () => {
	const { email, token } = useAppSelector((state) => state.user);
	return { isAuth: !!email, email, token };
};
