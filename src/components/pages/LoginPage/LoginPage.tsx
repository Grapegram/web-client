import { Login } from "@/components/interface";
import { AuthPageLayout } from "@/components/layout";

import { avatar } from "@/assets";

export const LoginPage = () => {
	return (
		<AuthPageLayout
			avatar={avatar}
			title="Log in to Grapegram"
			description="Please place your credentials in the appropriate fields."
		>
			<Login />
		</AuthPageLayout>
	);
};
