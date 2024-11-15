import axios from "axios";
import { useQuery } from "react-query";
import { LatestCovidByCountry } from "~covid/models/countries";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const useGetCountriesStats = () => {
	return useQuery("countries", async () => {
		const { data } = await axios.get("/countries");
		return data.items as LatestCovidByCountry[];
	});
};

const useGetCountriesList = () => {
	return useQuery("countries-list", async () => {
		const { data } = await axios.get("/countries/list");
		return data.items as string[];
	});
};

export { useGetCountriesStats, useGetCountriesList };
