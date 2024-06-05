export interface IIncidences {
  idIncident?: number;
  incidentName: string;
  responsible: string;
  startDate: Date | null;
  endDate: Date | null;
  Project_idProject: number | null;
  status: number;
  description: string;
  progress: number | null;
}
