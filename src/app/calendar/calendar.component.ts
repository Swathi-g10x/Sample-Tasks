import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  eventForm = new FormGroup({
    eventTitle: new FormControl('', Validators.required),
    eventDate: new FormControl('',Validators.required)
  });

  events: { title: string, date: string }[] = [];
  viewMode: 'day' | 'week' | 'month' = 'day';

  ngOnInit(){
    this.loadEvents();
  }

  addEvent() {
    const newEvent = this.eventForm.value;
    if (newEvent.eventTitle && newEvent.eventDate) {
      this.events.push({ title: newEvent.eventTitle, date: newEvent.eventDate });
      this.saveEvents();
      this.eventForm.reset();
    }
  }

  getEventsByDay() {
    const today = new Date().toISOString().split('T')[0];
    return this.events.filter(event => event.date === today);
  }

  getEventsByWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Get Sunday of this week
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Get Saturday of this week
    endOfWeek.setHours(23, 59, 59, 999);

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
  }

  getEventsByMonth() {
    const today = new Date();
    const currentMonth = today.getMonth(); // Get current month (0-11)
    const currentYear = today.getFullYear(); // Get current year

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  }
deleteEvent(index: number) {
  this.events.splice(index, 1); 
  this.saveEvents();
}

saveEvents() {
  localStorage.setItem('events', JSON.stringify(this.events));
}

loadEvents() {
  const storedEvents = localStorage.getItem('events');
  if (storedEvents) {
    this.events = JSON.parse(storedEvents);
  }
}
}
