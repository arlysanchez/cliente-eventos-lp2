import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { IEvent } from '../../interfaces/event.interface';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  private eventService=inject(EventService);
  private router = inject(Router);
  public allEvents: IEvent[] = [];
  public filteredEvents: IEvent[] = [];

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next:(events)=>{
        this.allEvents=events;
        this.filteredEvents=events;
        console.log('Eventos cargados:', this.allEvents);
      },
      error:(err)=>{
        console.error('Error al cargar los eventos:', err);
      }
    })
  }

}
