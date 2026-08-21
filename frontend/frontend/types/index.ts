export interface Farm {
  id: string;
  name: string;
  location: string;
  sizeHectares: number;
}

export interface Alert {
  id: string;
  farmId: string;
  message: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  farmId: string;
  message: string;
  createdAt: string;
}
