import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEvent } from '../interfaces/event.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http= inject(HttpClient);
  private apiUrl = '/api/v1/events';

  constructor() { }
   
  //servicio para obtener la lista de eventos desde el backend
   getEvents():Observable<IEvent[]>{
    return this.http.get<IEvent[]>(this.apiUrl);
   }
   //Crear un nuevo evento
   createEvent(eventData:Partial<IEvent>):Observable<IEvent>{
    return this.http.post<IEvent>(this.apiUrl,eventData);
   }
    //Eliminar un evento por su ID
   deleteEvent(eventId:number):Observable<void>{
   return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
   }
  //Actualizar un evento existente
   updateEvent(eventId:number, eventData:Partial<IEvent>)
   :Observable<IEvent>{
    return this.http.put<IEvent>(`${this.apiUrl}/${eventId}`, eventData);
   }

   uploadEventImage(eventId:number, file:File):Observable<IEvent>{
    const formData = new FormData();
    formData.append('file', file);  // La clave 'file' debe coincidir con @RequestParam("file") en el backend
    return this.http.post<IEvent>
    (`${this.apiUrl}/${eventId}/upload-image`, formData);
  }
   
   getEventById(eventId: number): Observable<IEvent> {
    return this.http.get<IEvent>(`${this.apiUrl}/${eventId}`);
  }
}
