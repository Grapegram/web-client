import type { HTMLAttributes, KeyboardEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/components/ui";

interface IChatComponentProps extends HTMLAttributes<HTMLDivElement> {
	chatId: number;
	title: string;
	avatar: string;
	lastMessage: string;
	lastMessageTimeStamp: string;
	isActive: boolean;
	setActive: (id: number) => void;
}

export const Chat = ({
	chatId,
	title,
	avatar,
	lastMessage,
	lastMessageTimeStamp,
	isActive,
	setActive,
}: IChatComponentProps) => {
	const handleClick = () => {
		setActive(chatId);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			setActive(chatId);
		}
	};

	return (
		<div
			className={`h-[75px] flex items-center gap-4 p-3 select-none transition-colors ${isActive && "bg-brand"}`}
			role="button"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex={0}
		>
			<Avatar className="h-full">
				<AvatarImage src={avatar} />
				<AvatarFallback>
					<Skeleton className="h-full w-full rounded-full" />
				</AvatarFallback>
			</Avatar>

			<div className="flex-grow flex flex-col overflow-hidden">
				<p className="font-bold truncate">{title}</p>
				<p className="truncate">{lastMessage}</p>
			</div>

			<div className="text-right whitespace-nowrap self-start">
				<p>{lastMessageTimeStamp}</p>
			</div>
		</div>
	);
};
