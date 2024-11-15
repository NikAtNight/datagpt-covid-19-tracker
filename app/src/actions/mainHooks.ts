import axios from "axios";
import { useQuery } from "react-query";
import { LatestCovidByCountry } from "~covid/models/countries";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const useGetCountries = () => {
	return useQuery("countries", async () => {
		const { data } = await axios.get("/countries");
		return data.items as LatestCovidByCountry[];
	});
};

export { useGetCountries };
