import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
eventForm!:FormGroup;
isLoading=false;

//para editar
isEditMode=false;
private eventId:number | null = null;

private fb = inject(FormBuilder);
private eventService = inject(EventService);
private router = inject(Router);

//para editar
private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.initializeForm();
    this.checkMode();
  }

  checkMode():void{
    this.route.paramMap.subscribe(params=>{
     const id = params.get('id');
     if(id){
      this.isEditMode=true;
      this.eventId=+id;
      this.loadEventData(this.eventId);
     }
  });
  }

   initializeForm(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, 
        Validators.minLength(5)]],
      description: ['', Validators.required],
      eventDate: ['', Validators.required],
      location: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]]
    });
  }


  loadEventData(id:number):void{
   this.eventService.getEventById(id).subscribe({
   next:(event)=>{
    const formattedDate = 
    this.formatDateForInput(event.eventDate);
    this.eventForm.patchValue({
      name: event.name,
      description: event.description,
      eventDate: formattedDate,
      location: event.location,
      budget: event.budget
    });

   },error:(err)=>{
    console.error('Error al cargar los datos del evento:',
       err);
    Swal.fire('Error', 'No se pudieron cargar los datos del evento.',
       'error');
    this.router.navigate(['/events']);
   }

   });

  }

  // Función de ayuda para formatear la fecha
  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // Formato YYYY-MM-DDTHH:mm
    return date.toISOString().substring(0, 16);
  }

  private handleError(err: any): void {
    console.error('Error en la operación:', err);
    Swal.fire('Error', 'Ocurrió un error al guardar el evento.', 'error');
    this.isLoading = false;
  }

onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar errores
      return;
    }
    this.isLoading = true;
    const eventData = this.eventForm.value;

      if (this.isEditMode && this.eventId) {
      // --- LÓGICA DE ACTUALIZACIÓN ---
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: (updatedEvent) => {
          Swal.fire('¡Actualizado!', `El evento "${updatedEvent.name}" ha sido actualizado.`, 'success');
          this.router.navigate(['/events']);
        },
        error: (err) => this.handleError(err),
        complete: () => this.isLoading = false
      });
    } else {
      // --- LÓGICA DE CREACIÓN (existente) ---
      this.eventService.createEvent(eventData).subscribe({
        next: (createdEvent) => {
          Swal.fire('¡Creado!', `El evento "${createdEvent.name}" ha sido creado.`, 'success');
          this.router.navigate(['/events']);
        },
        error: (err) => this.handleError(err),
        complete: () => this.isLoading = false
      });
    }
  }
}
