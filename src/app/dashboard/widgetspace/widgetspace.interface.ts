import { ChartOptions, ChartType } from "chart.js";
import { Color } from "ng2-charts";

// Interface for TS for our database transactions
export interface dbConfig {
    project:    string,
    run:        string,
    label:      string
}

// Interface for TS for the colletcion of preferences to build chart widgets
export interface UserPreferences {
    chartOptions:       ChartOptions,
    chartColor:         Color,
    chartType:          ChartType,
    databaseConfig:     dbConfig,
    dataDelimiter:      number,
}