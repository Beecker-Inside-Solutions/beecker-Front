  export interface IIncidences {
    idIncident: string;
    incidentName: string,
    responsible: string,
    startDate: Date | null,
    endDate: Date | null,
    projects: number | null,
    status: string,
    description: string
    progress: number | null
  }
