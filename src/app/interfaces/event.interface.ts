export interface IOrganizer {
   id: number;
   name: string;
   email: string;
   role:string
}

export interface IEvent {
    id: number;
    name: string;
    description: string;
    eventDate: string;
    location: string;
    budget: number;
    organizer: IOrganizer;
    imageUrl?: string;
}

