import { ChatsPanel } from "@/components/interface";
import { PageContainer } from "@/components/layout";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui";

export const HomePage = () => {
	return (
		<PageContainer>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel
					collapsible
					collapsedSize={6}
					minSize={15}
					defaultSize={25}
				>
					<ChatsPanel />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel minSize={50}>Chat messages</ResizablePanel>
			</ResizablePanelGroup>
		</PageContainer>
	);
};
