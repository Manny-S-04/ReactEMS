import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { URL_ENDPOINT } from "../assets/js/helpers";
import Header from "../components/Header";
import { useNavigate } from "react-router";

interface IEvent {
  eventid: number;
  name: string;
  startdate: string;
  enddate: string;
}

/*
 * on first load splash screen
 * make a create event page and edit event pag
 * delete event functionality
 */

function SelectEvent() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [presentEventList, setPresentEventList] = useState<JSX.Element[]>([]);
  const [futureEventList, setFutureEventList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    try {
      fetch(URL_ENDPOINT("select-event"))
        .then((response) => response.text())
        .then((eventsjson) => setEvents(JSON.parse(eventsjson)));
    } catch (error) {
      console.log("Error" + error);
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <>
        <Header>
          <h1>FAILED TO GET EVENTS</h1>
        </Header>
        <div className="eventsList-container">
          <div className="left">
            <h1 className="event-headers">Present Events</h1>
          </div>
          <div className="right">
            <h1 className="event-headers">Future Events</h1>
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    const today = new Date();
    const presentEvents: IEvent[] = events.filter((event) => {
      const startDate = new Date(event.startdate);
      const endDate = new Date(event.enddate);
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        return startDate <= today && endDate >= today;
      } else {
        return false;
      }
    });
    setPresentEventList(
      presentEvents.map((presentEvent) => (
        <li key={presentEvent.eventid}>
          <EventCard eventData={presentEvent} />
        </li>
      )),
    );
    const futureEvents: IEvent[] = events.filter((event) => {
      const startDate = new Date(event.startdate);
      const endDate = new Date(event.enddate);
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        return startDate >= today && endDate >= today;
      } else {
        return false;
      }
    });
    setFutureEventList(
      futureEvents.map((futureEvent) => (
        <li key={futureEvent.eventid}>
          <EventCard eventData={futureEvent} />
        </li>
      )),
    );
  }, [events]);

  return (
    <>
      <Header>
        <button
                    style={{position:"absolute", top:"0", left:"0"}}
          onClick={() => {
            navigate("/create-event");
          }}
          className="select-button"
        >
          Create Event
        </button>
        <h1>EVENTS LIST</h1>
      </Header>
      <div className="eventsList-container">
        <div className="left">
          <h1 className="event-headers">Present Events</h1>
          <ul>{presentEventList}</ul>
        </div>
        <div className="right">
          <h1 className="event-headers">Future Events</h1>
          <ul>{futureEventList}</ul>
        </div>
      </div>
    </>
  );
}

export default SelectEvent;
