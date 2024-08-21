import { useState } from "react";

import { ScrollArea } from "@/components/ui";

import { chats } from "@/core/utils/constants";

import { Chat } from "../Chat/Chat";

export const ChatsPanel = () => {
	const [active, setActive] = useState<number | null>(null);

	return (
		<ScrollArea className="h-full">
			{chats.map((chat) => (
				<Chat
					key={chat.id}
					chatId={chat.id}
					title={chat.title}
					avatar={chat.avatar}
					lastMessage={chat.lastMessage}
					lastMessageTimeStamp={chat.lastMessageTimeStamp}
					isActive={chat.id === active}
					setActive={setActive}
				/>
			))}
		</ScrollArea>
	);
};
