import type { FC, ReactNode } from "react";

import clsx from "clsx";

interface PageContainerProps {
	children: ReactNode;
	className?: string;
}

export const PageContainer: FC<PageContainerProps> = ({
	children,
	className,
}) => {
	const clazz = clsx(
		"h-screen flex flex-col justify-center items-center",
		className,
	);

	return <section className={clazz}>{children}</section>;
};
