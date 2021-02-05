import { ChartOptions } from "chart.js";
import { Color } from "ng2-charts";

// Interface for TS for our database transactions
export interface dbConfig {
    project: String,
    run: String,
    label: String
}

// Interface for TS for the colletcion of preferences to build chart widgets
export interface UserPreferences {
    chartOptions: ChartOptions,
    chartColor: Color,
    databaseConfig: dbConfig
}