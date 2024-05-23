export interface IIncidences {
  idIncident?: number;
  incidentName: string;
  responsible: string;
  startDate: Date | null;
  endDate: Date | null;
  projectID: number | null;
  status: number;
  description: string;
  progress: number | null;
}
