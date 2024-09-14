import { Login } from "@/components/interface";
import { AuthPageLayout } from "@/components/layout";

import { logo } from "@/assets";

export const LoginPage = () => {
	return (
		<AuthPageLayout
			avatar={logo}
			title="Log in to Grapegram"
			description="Please place your credentials in the appropriate fields."
		>
			<Login />
		</AuthPageLayout>
	);
};
