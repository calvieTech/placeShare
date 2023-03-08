import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, redirect } from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(false);

	const login = useCallback((uid) => {
		setIsLoggedIn(true);
		setUserId(uid);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
		setUserId(null);
	}, []);

	let routes;
	if (isLoggedIn) {
		routes = (
			<>
				<Route path="/" element={<Users />} />
				<Route path="/:userId/places" exact element={<UserPlaces />} />
				<Route path="/places/new" exact element={<NewPlace />} />
				<Route path="/places/:placeId" exact element={<UpdatePlace />} />
			</>
		);
	} else {
		routes = (
			<>
				<Route path="/" exact element={<Users />} />
				<Route path="/:userId/places" exact element={<UserPlaces />} />
				<Route path="/auth" element={<Auth />} />
			</>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: isLoggedIn,
				userId: userId,
				login: login,
				logout: logout,
			}}>
			<Router>
				<MainNavigation />
				<main>
					<Routes>{routes}</Routes>
				</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
