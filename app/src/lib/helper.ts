export type DataSetLabel =
	| "Case Deaths"
	| "Excess Mortality"
	| "Vaccinations"
	| "Vaccinations by Age Group"
	| "Vaccinations by Manufacturer";

export const dataSets: { label: DataSetLabel; value: string }[] = [
	{ label: "Case Deaths", value: "covid_cases_deaths" },
	{ label: "Excess Mortality", value: "covid_excess_mortality" },
	{ label: "Vaccinations", value: "covid_vaccinations" },
	{ label: "Vaccinations by Age Group", value: "covid_vaccinations_age_group" },
	{ label: "Vaccinations by Manufacturer", value: "covid_vaccinations_by_manufacturer" },
];

export const endpoints: Record<DataSetLabel, string> = {
	"Case Deaths": "/cases-deaths",
	"Excess Mortality": "/excess-mortality",
	Vaccinations: "/vaccinations",
	"Vaccinations by Age Group": "/vaccinations-age-group",
	"Vaccinations by Manufacturer": "/vaccinations-manufacturer",
};

export const metrics: Record<DataSetLabel, { label: string; value: string }[]> = {
	"Case Deaths": [
		{ label: "New Cases", value: "new_cases" },
		{ label: "New Deaths", value: "new_deaths" },
		{ label: "Total Cases", value: "total_cases" },
		{ label: "Total Deaths", value: "total_deaths" },
		{ label: "Weekly Cases", value: "weekly_cases" },
		{ label: "Weekly Deaths", value: "weekly_deaths" },
		{ label: "Biweekly Cases", value: "biweekly_cases" },
		{ label: "Biweekly Deaths", value: "biweekly_deaths" },
	],
	"Excess Mortality": [
		{ label: "P-Score (All Ages)", value: "p_scores_all_ages" },
		{ label: "P-Score (15-64)", value: "p_scores_15_64" },
		{ label: "P-Score (65-74)", value: "p_scores_65_74" },
		{ label: "P-Score (75-84)", value: "p_scores_75_84" },
		{ label: "P-Score (85+)", value: "p_scores_85plus" },
		{ label: "Deaths 2020 (All Ages)", value: "deaths_2020_all_ages" },
		{ label: "Average Deaths 2015-2019", value: "average_deaths_2015_2019_all_ages" },
		{ label: "Deaths 2015", value: "deaths_2015_all_ages" },
		{ label: "Deaths 2016", value: "deaths_2016_all_ages" },
		{ label: "Deaths 2017", value: "deaths_2017_all_ages" },
		{ label: "Deaths 2018", value: "deaths_2018_all_ages" },
		{ label: "Deaths 2019", value: "deaths_2019_all_ages" },
		{ label: "Deaths 2010", value: "deaths_2010_all_ages" },
		{ label: "Deaths 2011", value: "deaths_2011_all_ages" },
		{ label: "Deaths 2012", value: "deaths_2012_all_ages" },
		{ label: "Deaths 2013", value: "deaths_2013_all_ages" },
		{ label: "Deaths 2014", value: "deaths_2014_all_ages" },
		{ label: "Deaths 2021", value: "deaths_2021_all_ages" },
		{ label: "P-Score (0-14)", value: "p_scores_0_14" },
		{ label: "Projected Deaths Since 2020", value: "projected_deaths_since_2020_all_ages" },
		{ label: "Excess Deaths Projection", value: "excess_proj_all_ages" },
		{ label: "Cumulative Excess Deaths Projection", value: "cum_excess_proj_all_ages" },
		{ label: "Cumulative Projected Deaths", value: "cum_proj_deaths_all_ages" },
		{ label: "Cumulative P-Score Projection", value: "cum_p_proj_all_ages" },
		{ label: "P-Score Projection (All Ages)", value: "p_proj_all_ages" },
		{ label: "P-Score Projection (0-14)", value: "p_proj_0_14" },
		{ label: "P-Score Projection (15-64)", value: "p_proj_15_64" },
		{ label: "P-Score Projection (65-74)", value: "p_proj_65_74" },
		{ label: "P-Score Projection (75-84)", value: "p_proj_75_84" },
		{ label: "P-Score Projection (85+)", value: "p_proj_85p" },
		{ label: "Cumulative Excess Per Million Projection", value: "cum_excess_per_million_proj_all_ages" },
		{ label: "Excess Per Million Projection", value: "excess_per_million_proj_all_ages" },
		{ label: "Deaths 2022", value: "deaths_2022_all_ages" },
		{ label: "Deaths 2023", value: "deaths_2023_all_ages" },
		{ label: "Deaths Since 2020", value: "deaths_since_2020_all_ages" },
	],
	Vaccinations: [
		{ label: "Total Vaccinations", value: "total_vaccinations" },
		{ label: "People Vaccinated", value: "people_vaccinated" },
		{ label: "People Fully Vaccinated", value: "people_fully_vaccinated" },
		{ label: "Total Boosters", value: "total_boosters" },
		{ label: "Daily Vaccinations (Raw)", value: "daily_vaccinations_raw" },
		{ label: "Daily Vaccinations", value: "daily_vaccinations" },
		{ label: "Total Vaccinations per Hundred", value: "total_vaccinations_per_hundred" },
		{ label: "People Vaccinated per Hundred", value: "people_vaccinated_per_hundred" },
		{ label: "People Fully Vaccinated per Hundred", value: "people_fully_vaccinated_per_hundred" },
		{ label: "Total Boosters per Hundred", value: "total_boosters_per_hundred" },
		{ label: "Daily Vaccinations per Million", value: "daily_vaccinations_per_million" },
		{ label: "Daily People Vaccinated", value: "daily_people_vaccinated" },
		{ label: "Daily People Vaccinated per Hundred", value: "daily_people_vaccinated_per_hundred" },
	],
	"Vaccinations by Age Group": [
		{ label: "Age Group", value: "age_group" },
		{ label: "People Vaccinated per Hundred", value: "people_vaccinated_per_hundred" },
		{ label: "People Fully Vaccinated per Hundred", value: "people_fully_vaccinated_per_hundred" },
		{ label: "People with Booster per Hundred", value: "people_with_booster_per_hundred" },
	],
	"Vaccinations by Manufacturer": [
		{ label: "Vaccine", value: "vaccine" },
		{ label: "Total Vaccinations", value: "total_vaccinations" },
	],
};
