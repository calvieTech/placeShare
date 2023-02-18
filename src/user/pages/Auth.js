import React, { useState, useContext, useEffect } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const redirect = useNavigate();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: "",
				isValid: false,
			},
			password: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	const switchModeHandler = async () => {
		if (!isLoginMode) {
			await setFormData(
				{
					...formState.inputs,
					name: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			await setFormData(
				{
					...formState.inputs,
					name: {
						value: "",
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	const authSubmitHandler = async (event) => {
		event.preventDefault();
		const inputs = formState.inputs;
		let res;
		const url = isLoginMode
			? `http://${window.location.hostname}:3001/api/users/login`
			: `http://${window.location.hostname}:3001/api/users/signup`;

		if (isLoginMode) {
			try {
				await sendRequest(
					url,
					"POST",
					JSON.stringify({
						email: inputs.email.value,
						password: inputs.password.value,
					}),
					{ "Content-Type": "application/json" }
				);
			} catch (err) {
				throw new Error(err.message);
			}
			auth.login();
		} else {
			try {
				await sendRequest(
					url,
					"POST",
					JSON.stringify({
						name: inputs.name.value,
						email: inputs.email.value,
						password: inputs.password.value,
					}),
					{ "Content-Type": "application/json" }
				);
			} catch (err) {
				throw new Error(err.message);
			}
		}
		redirect("/", { replace: true });
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="Your Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter a name."
							onInput={inputHandler}
						/>
					)}
					<Input
						element="input"
						id="email"
						type="email"
						label="E-Mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>
					<Input
						element="input"
						id="password"
						type="password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid password, at least 5 characters."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? "LOGIN" : "SIGNUP"}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
