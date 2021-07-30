import React from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createEventId } from "./event-utils";
import {
  getScheduleRequest,
  createScheduleRequest,
  updateScheduleRequest,
  removeScheduleRequest,
} from "./api";
const user_id = "1412";
export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    initialEvents: [],
  };

  render() {
    return (
      <div className="demo-app">
        {this.renderSidebar()}
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay,timeGridWeek,dayGridMonth,",
            }}
            initialView="dayGridMonth"
            events={this.getEvents}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            //     initialEvents={this.state.initialEvents} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventAdd={this.handleEventAdd}
            eventChange={this.handleEventChange}
            eventRemove={this.handleEventRemove}
            eventDataTransform={this.eventDataTransform}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    );
  }

  renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div className="demo-app-sidebar-section">
          <label>
            <input
              type="checkbox"
              checked={this.state.weekendsVisible}
              onChange={this.handleWeekendsToggle}
            />
            toggle weekends
          </label>
        </div>
        <div className="demo-app-sidebar-section">
          <h2>All Events ({this.state.currentEvents.length})</h2>
          <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = async (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        user_id,
      });
    }
  };

  getEvents = async () => {
    let res = await getScheduleRequest(user_id);
    res.map((data) => (data.id = data._id));
    return res;
  };

  handleEventClick = (clickInfo) => {
    if (
      prompt(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };

  handleEventAdd = async (changedInfo) => {
    let info = changedInfo.event;
    let res = await createScheduleRequest({
      title: info.title,
      start: info.startStr,
      end: info.endStr,
      allDay: info.allDay,
      user_id,
    });
    if (!res) {
      reportNetworkError();
      changedInfo.revert();
    }
  };

  handleEventChange = async (changedInfo) => {
    let info = changedInfo.event;
    let res = await updateScheduleRequest(info.id, {
      title: info.title,
      start: info.startStr,
      end: info.endStr,
      allDay: info.allDay,
      user_id,
    });
    if (!res) {
      reportNetworkError();
      changedInfo.revert();
    }
  };

  handleEventRemove = async (changedInfo) => {
    let info = changedInfo.event;
    let res = await removeScheduleRequest(info.id);
    if (!res) {
      reportNetworkError();
      changedInfo.revert();
    }
  };
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function reportNetworkError() {
  alert("This action could not be completed");
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}
