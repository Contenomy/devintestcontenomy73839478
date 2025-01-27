import { useEffect, useState } from "react";

/**
 * 
 * @param endpoint endpoint of the remote server
 * @param initialData initial data for useState
 * @returns an array with the data and a boolean representing the request state
 * 
 * ```
 * false: request is pending
 * true: request is done
 * ```
 */
export default function useFetch<T>(endpoint: string, initialData: T): [T, boolean] {
    let [data, setData] = useState(initialData);
    let [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(endpoint, {
                    credentials: "include"
                });

                if (res.status >= 400) {
                    const msg = await res.text();
                    console.error(msg);
                    setData(initialData);
                    setLoaded(true);
                    return;
                }

                const parsedData = (await res.json()) as T;
                setData(parsedData);
                setLoaded(true);

            }
            catch (err) {
                console.error("Fetch error", err);
                setData(initialData);
                setLoaded(true);
            }
        }

        fetchData();
    }, [endpoint, initialData]);

    return [
        data,
        loaded
    ];
}
