import { z } from "zod";

const LatestCovidByCountrySchema = z.object({
  iso_code: z.string(),
  location: z.string(),
  total_cases: z.string().nullable(),
  total_deaths: z.string().nullable(),
  total_vaccinations: z.string().nullable(),
  population: z.string(),
});

export type LatestCovidByCountry = z.infer<typeof LatestCovidByCountrySchema>;
