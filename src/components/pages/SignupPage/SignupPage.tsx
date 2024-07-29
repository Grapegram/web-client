import { Signup } from "@/components/interface";
import { AuthPageLayout } from "@/components/layout";

import { avatar2 } from "@/assets";

export const SignupPage = () => {
	return (
		<AuthPageLayout
			avatar={avatar2}
			title="Sign up to Grapegram"
			description="Please place your credentials to create an account."
		>
			<Signup />
		</AuthPageLayout>
	);
};
