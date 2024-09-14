import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Button, Form, InputField } from "@/components/ui";

import { authValidationSchema } from "@/core/shemas";
import { SIGNUP_ROUTE } from "@/core/utils";

export const Login = () => {
	const form = useForm<z.infer<ReturnType<typeof authValidationSchema>>>({
		resolver: zodResolver(authValidationSchema(true, false)),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "all",
	});
	const { reset, formState, handleSubmit, control } = form;

	const onSubmit = (
		values: z.infer<ReturnType<typeof authValidationSchema>>,
	) => {
		console.log(values);
		reset();
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-8 w-full"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-2">
					<InputField
						control={control}
						name="email"
						label="Email:"
						type="email"
						autoComplete="email"
					/>
					<InputField
						control={control}
						name="password"
						label="Password:"
						type="password"
					/>
				</div>
				<div className="flex flex-col gap-4">
					<Button
						variant="secondary"
						type="submit"
						disabled={!formState.isValid}
					>
						Log in
					</Button>
					<Button variant="outline" asChild>
						<Link to={SIGNUP_ROUTE}> Don`t have an account? Signup</Link>
					</Button>
				</div>
			</form>
		</Form>
	);
};
