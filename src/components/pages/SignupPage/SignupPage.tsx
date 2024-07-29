import { PageContainer } from "@/components/common";
import { Signup } from "@/components/interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

import { avatar2 } from "@/assets";

export const SignupPage = () => {
	return (
		<PageContainer>
			<PageContainer>
				<div className="w-[250px] flex flex-col justify-center items-center gap-8">
					<Avatar className="w-[150px] h-[150px]">
						<AvatarImage src={avatar2} />
						<AvatarFallback>LOGO</AvatarFallback>
					</Avatar>
					<div className="flex flex-col justify-center items-center gap-6">
						<h4 className="font-bold text-2xl">Sign up to Grapegram</h4>
						<p className="text-center">
							Please place your credentials to create an account.
						</p>
					</div>
					<Signup />
				</div>
			</PageContainer>
		</PageContainer>
	);
};
