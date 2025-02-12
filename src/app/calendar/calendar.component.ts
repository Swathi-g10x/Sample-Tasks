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
    eventDate: new FormControl('', Validators.required)
  });

  events: { title: string; date: string }[] = [];
  viewMode: 'day' | 'week' | 'month' = 'day';
  currentDate = new Date();

  constructor() {
    this.loadEvents();
  }

  /** Add Event **/
  addEvent() {
    if (this.eventForm.invalid) return;
    const newEvent = this.eventForm.value;
    this.events.push({ title: newEvent.eventTitle!, date: newEvent.eventDate! });
    this.saveEvents();
    this.eventForm.reset();
  }

  /** Delete Event **/
  deleteEvent(eventToDelete: { title: string; date: string }) {
    this.events = this.events.filter(event => !(event.title === eventToDelete.title && event.date === eventToDelete.date));
    this.saveEvents(); // Save updated events to local storage
  }
  

  /** Save & Load Events **/
  saveEvents() {
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  loadEvents() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
    }
  }

  /** Navigate Between Months **/
  goToPreviousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDate = new Date(this.currentDate);
  }

  goToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = new Date(this.currentDate);
  }

  /** Generate the Full Month Calendar Grid **/
  getMonthDays(): { date: string; day: number | null; events: { title: string; date: string }[] }[] {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ...

    const monthDays = [];

    // Add empty slots before the first day of the month
    for (let i = 0; i < firstDayIndex; i++) {
      monthDays.push({ date: '', day: null, events: [] });
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dateStr = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);

        const dayEvents = this.events.filter(event => event.date === dateStr);
        monthDays.push({ date: dateStr, day, events: dayEvents });
    }

    return monthDays;
}

  /** Day, Week, Month Views **/
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getEventsByDay() {
    const today = this.getTodayDate();
    return this.events.filter(event => event.date === today);
  }

  getEventsByWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
  }

  getEventsByMonth() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  }
}
