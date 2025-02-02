import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import EventDay from "../components/EventDay";
import "../assets/css/styles.css";
import Header from "../components/Header";

interface IEventDay {
  eventdayid: number;
  eventid: number;
  date: string;
  starttime: string;
  endtime: string;
  slotduration: number;
}


function EventDaysList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);
  const [eventDays, setEventDays] = useState<IEventDay[]>([]);
  const [currentPages, setCurrentPages] = useState<JSX.Element[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (location.state?.eventDays) {
      const parsedEventDays = JSON.parse(location.state.eventDays);

      setEventDays(parsedEventDays);
    } else {
      setError(true);
    }
  }, [location.state?.eventDays]);

  if (error) {
    return (
      <Header>
        <h1>FAILED TO GET EVENTDAYS</h1>
      </Header>
    );
  }

  useEffect(() => {
    const pages = eventDays.map((day) => <EventDay eventDayData={day} />);
    setCurrentPages(pages);
  }, [eventDays]);

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  const nextPage = () => {
    if (page < currentPages.length - 1) {
      setPage(page + 1);
    }
  };

  return (
    <>
      <Header>
        <div className="changepagebuttons-container">
          <button
            className="page-button"
            onClick={prevPage}
            style={{ opacity: page === 0 ? "0" : "1" }}
          >
            PREV
          </button>
          <div style={{ transform: "scale(0.8)" }}>
            <h1>{location.state.eventDayName}</h1>
            <h1>{eventDays[page]?.date.split("T")[0] || ""}</h1>
          </div>
          <button
            className="page-button"
            onClick={nextPage}
            style={{ opacity: page === currentPages.length - 1 ? "0" : "1" }}
          >
            NEXT
          </button>
        </div>
      </Header>
      <>{currentPages[page]}</>
      <button
        className="page-button"
        style={{ width: "100dvw" }}
        onClick={() => {
          navigate("/");
        }}
      >
        Return to Events
      </button>
    </>
  );
}
export default EventDaysList;
