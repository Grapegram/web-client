import { Signup } from "@/components/interface";
import { AuthPageLayout } from "@/components/layout";

import { logo } from "@/assets";

export const SignupPage = () => {
	return (
		<AuthPageLayout
			avatar={logo}
			title="Sign up to Grapegram"
			description="Please place your credentials to create an account."
		>
			<Signup />
		</AuthPageLayout>
	);
};
