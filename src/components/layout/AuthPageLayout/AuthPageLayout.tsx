import type { FC, ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

import { PageContainer } from "../PageContainer/PageContainer";

interface AuthPageLayout {
	avatar: string;
	title: string;
	description: string;
	children: ReactNode;
}

export const AuthPageLayout: FC<AuthPageLayout> = ({
	avatar,
	title,
	description,
	children,
}) => {
	return (
		<PageContainer>
			<div className="w-[250px] flex flex-col justify-center items-center gap-8">
				<Avatar className="w-[150px] h-[150px]">
					<AvatarImage src={avatar} />
					<AvatarFallback>LOGO</AvatarFallback>
				</Avatar>
				<div className="flex flex-col justify-center items-center gap-6">
					<h4 className="font-bold text-2xl">{title}</h4>
					<p className="text-center">{description}</p>
				</div>
				{children}
			</div>
		</PageContainer>
	);
};
