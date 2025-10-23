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


}
