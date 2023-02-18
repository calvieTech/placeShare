import React, { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	let activeHttpRequests = useRef([]);

	const sendRequest = useCallback(
		async (url, method = "GET", body = null, headers = {}, mode = "cors") => {
			let res, resData;
			const httpAbortCtrl = new AbortController();
			activeHttpRequests.current.push(httpAbortCtrl);
			setIsLoading(true);
			try {
				res = await fetch(url, {
					method,
					body,
					mode: "no-cors",
					headers,
					signal: httpAbortCtrl.signal,
				});

				resData = await res.json();

				activeHttpRequests.current = activeHttpRequests.current.filter(
					(reqCtrl) => reqCtrl !== httpAbortCtrl
				);

				if (!res.ok) {
					setError(err.message);
					throw new Error(resData.message);
				}
			} catch (err) {
				setError(err.message);
				setIsLoading(false);
				throw err;
			}
			setIsLoading(false);
			return resData;
		},
		[]
	);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
		};
	}, []);

	return { isLoading, setIsLoading, error, setError, sendRequest, clearError };
};
