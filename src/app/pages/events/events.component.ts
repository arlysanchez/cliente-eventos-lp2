import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IEvent } from '../../interfaces/event.interface';
import { EventService } from '../../services/event.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-events',
  standalone: true,
imports: [CommonModule,FormsModule, RouterLink],
   templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{
  public searchEventName = '';
   public selectedEventForModal: IEvent | null = null;
  private imageModal: any; // Variable para mantener la instancia del modal

  public allEvents: IEvent[] = [];
  public filteredEvents: IEvent[] = [];
  private eventService = inject(EventService);
  private router = inject(Router);

ngOnInit(): void {
    this.loadEvents();
  }
   ngAfterViewInit(): void {
    const modalElement = document.getElementById('imagePreviewModal');
    if (modalElement) {
      this.imageModal = new bootstrap.Modal(modalElement);
    }
  }
   loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.filteredEvents = events; 
        console.log('Eventos cargados:', this.allEvents);
      },
      error: (err) => {
        console.error('Error al cargar los eventos:', err);
      }
    });
  }
  searchEvent(): void {
    if (!this.searchEventName) {
      this.filteredEvents = this.allEvents; // Si la búsqueda está vacía, muestra todos
      return;
    }

    this.filteredEvents = this.allEvents.filter(event =>
      event.name.toLowerCase().includes(this.searchEventName.toLowerCase())
    );
  }

  goToNewEvent(): void {
    this.router.navigate(['/event/new']);

  }
     
    //metodo para subir imagenes
    onFileSelected(event: Event, eventId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file.name, 'para el evento ID:', eventId);

      this.eventService.uploadEventImage(eventId, file).subscribe({
        next: (updatedEvent) => {
          console.log('Imagen subida con éxito. Evento actualizado:', updatedEvent);
          
          // Actualizamos la lista de eventos para que la nueva imagen se muestre al instante
          const index = this.allEvents.findIndex(e => e.id === eventId);
          if (index !== -1) {
            this.allEvents[index] = updatedEvent;
            // Forzamos la actualización de la lista filtrada
            this.searchEvent(); 
          }
        },
        error: (err) => {
          console.error('Error al subir la imagen:', err);
          // Aquí podrías mostrar una notificación de error al usuario
        }
      });
    }
  }
  openImageModal(event: IEvent): void {
    this.selectedEventForModal = event; // Guarda el evento seleccionado
    if (this.imageModal) {
      this.imageModal.show(); // Muestra el modal
    }
  }

  //metodo para eliminar un evento
  deleteEvent(eventId: number, eventName: string): void {
    // 1. Usar SweetAlert2 para la confirmación.
    Swal.fire({
      title: '¿Estás seguro?',
      text: `No podrás revertir la eliminación del evento "${eventName}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // 2. Si el usuario confirma, procede con la eliminación.
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe({
          next: () => {
            // 3. Actualiza la UI.
            this.allEvents = this.allEvents.filter(event => event.id !== eventId);
            this.filteredEvents = this.filteredEvents.filter(event => event.id !== eventId);

            // 4. Muestra una alerta de éxito.
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El evento ha sido eliminado.',
              icon: 'success',
              timer: 1500, // Cierra automáticamente después de 1.5 segundos
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error(`Error al eliminar el evento con ID ${eventId}:`, err);
            // 5. Muestra una alerta de error.
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el evento. Por favor, inténtalo de nuevo.',
              icon: 'error'
            });
          }
        });
      }
    });
  }
  

}