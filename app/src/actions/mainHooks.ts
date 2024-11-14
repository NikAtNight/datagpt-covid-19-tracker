import axios from "axios";
import { useQuery } from "react-query";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const useGetCountries = () => {
	return useQuery("countries", async () => {
		const { data } = await axios.get("/countries");
		return data.items;
	});
};

export { useGetCountries };
