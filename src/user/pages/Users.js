import React, { useEffect, useState } from "react";
import { fetchOptions } from "./Auth";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { redirect } from "react-router-dom";

const Users = () => {
	const [loadedUsers, setLoadedUsers] = useState(null);
	const { error, isLoading, sendRequest, clearError } = useHttpClient();
	const url = `http://${window.location.hostname}:3001/api/users`;
	let usersData;

	useEffect(() => {
		const fetchUsers = async (url) => {
			try {
				usersData = await sendRequest(url);
				if (!usersData.ok) {
					throw new Error(usersData.message);
				}
			} catch (err) {
				// console.log(`Error occurred in http-client.js`);
			}
			setLoadedUsers(usersData.users);
		};
		fetchUsers(url);
	}, [sendRequest]);

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
		</>
	);
};

export default Users;
