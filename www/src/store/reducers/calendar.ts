import { createSlice } from '@reduxjs/toolkit';

// third-party
import { EventInput } from '@fullcalendar/common';

// project import
import axios from 'utils/axios';
import { dispatch } from 'store';

// types
import { CalendarProps } from '../../types/calendar';
import { apiReqWithAuth } from 'lib/api';
import { CALENDAR_EVENTS, CALENDAR_EVENTS_POPULATE_SPEAKER } from 'lib/endpoints';

const reduceCreateEventAttrs = (data: { data }): EventInput => {
  const event = {
    id: data.data.id,
    ...data.data.attributes
  };

  console.log('reduceCreateEventAttrs', data);

  return event;
};
const reduceEventAttrs = (data: any): EventInput => {
  const event = {
    id: data.id,
    ...data.attributes
  };

  return event;
};

const reduceEventsAttrs = (payload: { data: any[] }): EventInput[] => {
  const events = [];

  for (let data of payload.data) {
    const event = reduceEventAttrs(data);

    events.push(event);
  }
  return events;
};

const updateEvents = (updatedEvent: EventInput, oldEvents: EventInput[]) => {
  for (let i = 0; i < oldEvents.length; i++) {
    const oldEvent = oldEvents[i];
    if (oldEvent.id === updatedEvent.id) {
      oldEvent[i] = updatedEvent;
    }
  }

  return oldEvents;
};

const initialState: CalendarProps = {
  calendarView: 'dayGridMonth',
  error: false,
  events: [],
  isLoader: false,
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null
};

// ==============================|| CALENDAR - SLICE ||============================== //

const calendar = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // loader
    loading(state) {
      state.isLoader = true;
    },

    // error
    hasError(state, action) {
      state.isLoader = false;
      state.error = action.payload;
    },

    // event list
    setEvents(state, action) {
      state.isLoader = false;
      const events = reduceEventsAttrs(action.payload);

      state.events = events;
    },

    // update calendar view
    updateCalendarView(state, action) {
      state.calendarView = action.payload;
    },

    // select event
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isModalOpen = true;

      state.selectedEventId = eventId;
    },

    // create event
    createEvent(state, action) {
      state.isLoader = false;
      state.isModalOpen = false;

      const newEvent = reduceCreateEventAttrs(action.payload);

      const newEvents = [...state.events, newEvent];
      state.events = newEvents;
    },

    // update event
    updateEvent(state, action) {
      state.isLoader = false;
      state.isModalOpen = false;
      state.selectedEventId = null;

      const updatedEvent = reduceEventAttrs(action.payload);
      const updatedEvents = updateEvents(updatedEvent, state.events);

      state.events = updatedEvents;
    },

    // delete event
    deleteEvent(state, action) {
      const { eventId } = action.payload;
      state.isModalOpen = false;
      state.events = state.events.filter((user) => user.id !== eventId);
    },

    // select date range
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isModalOpen = true;
      state.selectedRange = { start, end };
    },

    // modal toggle
    toggleModal(state) {
      state.isModalOpen = !state.isModalOpen;
      if (state.isModalOpen === false) {
        state.selectedEventId = null;
        state.selectedRange = null;
      }
    }
  }
});

export default calendar.reducer;

export const { selectEvent, toggleModal, updateCalendarView } = calendar.actions;

export function getEvents() {
  return async () => {
    dispatch(calendar.actions.loading());

    const res = await apiReqWithAuth({
      endpoint: CALENDAR_EVENTS_POPULATE_SPEAKER
    });

    if (res.error) {
      dispatch(calendar.actions.hasError(res.error));
    } else {
      dispatch(calendar.actions.setEvents(res.data));
    }
  };
}

export function createEvent(newEvent: Omit<EventInput, 'id'>) {
  return async () => {
    dispatch(calendar.actions.loading());

    const res = await apiReqWithAuth({
      endpoint: CALENDAR_EVENTS_POPULATE_SPEAKER,
      method: 'POST',
      data: { data: newEvent }
    });

    if (res.error) {
      dispatch(calendar.actions.hasError(res.error));
    } else {
      dispatch(calendar.actions.createEvent(res.data));
    }
  };
}

export function updateEvent(
  eventId: string,
  event: Partial<{
    allDay: boolean;
    start: Date | null;
    end: Date | null;
    title: string | null;
  }>
) {
  return async () => {
    dispatch(calendar.actions.loading());

    const res = await apiReqWithAuth({
      endpoint: `${CALENDAR_EVENTS}/${eventId}`,
      method: 'PUT',
      data: { data: event }
    });

    if (res.error) {
      dispatch(calendar.actions.hasError(res.error));
    } else {
      dispatch(calendar.actions.updateEvent(res.data));
    }
  };
}

export function deleteEvent(eventId: string) {
  return async () => {
    dispatch(calendar.actions.loading());

    const res = await apiReqWithAuth({
      endpoint: `${CALENDAR_EVENTS}/${eventId}`,
      method: 'DELETE'
    });

    if (res.error) {
      dispatch(calendar.actions.hasError(res.error));
    } else {
      dispatch(calendar.actions.deleteEvent({ eventId }));
    }
  };
}

export function selectRange(start: Date, end: Date) {
  return async () => {
    dispatch(
      calendar.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
}
