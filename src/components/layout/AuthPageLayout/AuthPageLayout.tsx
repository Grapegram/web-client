import type { FC, ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/components/ui";

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
			<div className="w-[300px] flex flex-col justify-center items-center gap-8">
				<Avatar className="w-[120px] h-[120px]">
					<AvatarImage src={avatar} />
					<AvatarFallback>
						<Skeleton className="h-full w-full rounded-full" />
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col justify-center items-center gap-6">
					<h4 className="font-bold text-2xl">{title}</h4>
					<p className="text-base text-center">{description}</p>
				</div>
				{children}
			</div>
		</PageContainer>
	);
};
