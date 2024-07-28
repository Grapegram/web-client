import type { FC, ReactNode } from "react";

interface PageContainerProps {
	children: ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
	return (
		<section className="h-screen flex justify-center items-center">
			{children}
		</section>
	);
};
