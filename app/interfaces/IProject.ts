export interface Bot {
  idBots: number;
  botName: string;
  isExecuting: number;
}

export interface Project {
  idProject: number;
  projectName: string;
  projectDescription: string;
  bots: Bot[];
}
