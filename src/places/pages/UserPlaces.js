import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
	const [loadedPlaces, setLoadedPlaces] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const userId = useParams().userId;
	const url = `http://${window.location.hostname}:3001/api/places/user/${userId}`;

	useEffect(() => {
		const fetchPlaces = async (url) => {
			try {
				const responseData = await sendRequest(url);
				setLoadedPlaces(responseData.places);
			} catch (err) {}
		};
		fetchPlaces(url);
	}, [sendRequest, userId, url]);

	const placeDeletedHandler = (deletedPlaceId) => {
		const updatedPlaces = loadedPlaces.filter((prevPlace) => prevPlace !== deletedPlaceId);
		setLoadedPlaces(updatedPlaces);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedPlaces && (
				<PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
			)}
		</React.Fragment>
	);
};

export default UserPlaces;
