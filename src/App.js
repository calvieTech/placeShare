import React, { useState, useCallback, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

const TestComponent = () => {
	useEffect(() => {
		fetch('https://calvietech.com:3000/test')
			.then(res => res.json())
			.then(data => console.log('FETCHING /TEST: data', data))
			.catch(err => console.log('ERROR FETCHING TEST:', err));
	}, [])

	return <div>HELLO</div>
}

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const login = useCallback(() => {
		setIsLoggedIn(true);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
	}, []);

	let routes;
	if (isLoggedIn) {
		routes = (
			<Routes>
				<Route path="/" exact element={<Users />} />
				<Route path="/kiki" exact element={<TestComponent />} />
				<Route path="/:userId/places" exact element={<UserPlaces />} />
				<Route path="/places/new" exact element={<NewPlace />} />
				<Route path="/places/:placeId" exact element={<UpdatePlace />} />
			</Routes>
		);
	} else {
		routes = (
			<Routes>
				<Route path="/" exact element={<Users />} />
				<Route path="/:userId/places" exact element={<UserPlaces />} />
				<Route path="/auth" element={<Auth />} />
			</Routes>
		);
	}

	return (
		<AuthContext.Provider
			value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
		>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
