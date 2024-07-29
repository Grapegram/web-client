import { PageContainer } from "@/components/common";
import { Login } from "@/components/interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

import { avatar } from "@/assets";

export const LoginPage = () => {
	return (
		<PageContainer>
			<div className="w-[250px] flex flex-col justify-center items-center gap-8">
				<Avatar className="w-[150px] h-[150px]">
					<AvatarImage src={avatar} />
					<AvatarFallback>LOGO</AvatarFallback>
				</Avatar>
				<div className="flex flex-col justify-center items-center gap-6">
					<h4 className="font-bold text-2xl">Log in to Grapegram</h4>
					<p className="text-center">
						Please place your credentials in the appropriate fields.
					</p>
				</div>
				<Login />
			</div>
		</PageContainer>
	);
};
