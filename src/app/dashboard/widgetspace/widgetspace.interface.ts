import { ChartOptions, ChartType } from "chart.js";

// Interface for TS for our database transactions
export interface dbConfig {
    project:    string,
    run:        string,
    label:      string
}

export interface FirestoreChartPreferences {
    backgroundColor:    string,
    chartOptions:       ChartOptions,
    chartType:          ChartType,
    color:              string,
    dataRef:            firebase.default.firestore.DocumentReference,
    delimiter:          number,
    order:              number,
    dataCollection:     string
}

// because I need an interface to not get an error saying
// 'charts doesn't exist on type'
export interface RawFirestoreChartPreferences {
    charts: [FirestoreChartPreferences]
}