import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const UserPlaces = async () => {
	const userId = useParams().userId;
	let loadedPlaces;

	try {
		loadedPlaces = await fetch(`http://localhost:3001/api/${userId}/places`);
	} catch (err) {
		console.error(err.message);
	}
	return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
