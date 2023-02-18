import { createContext } from "react";

export const AuthContext = createContext({
	isLoggedIn: false,
	login: () => {
		isLoggedIn = true;
	},
	logout: () => {
		isLoggedIn = false;
	},
});
