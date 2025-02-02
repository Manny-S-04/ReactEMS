import { useNavigate } from "react-router";
import "../assets/css/events.css";
import { URL_ENDPOINT } from "../assets/js/helpers";

interface Event {
  eventid: number;
  name: string;
  startdate: string;
  enddate: string;
}

function EventCard({ eventData }: { eventData: Event }) {
  const navigate = useNavigate();

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(URL_ENDPOINT("get-event"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: eventData.name,
          startdate: startDate,
          enddate: endDate,
        }),
      });
      if (!response.ok) {
        return <></>;
      }

      const eventDays = await response.text();

      navigate("/event-day", { state: { eventDays:eventDays, eventDayName: eventData.name } });
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return <div>Error parsing event data.</div>;
    }
  };

  const startDate = new Date(eventData.startdate).toISOString().split("T")[0];
  const endDate = new Date(eventData.enddate).toISOString().split("T")[0];
  return (
    <>
      <form onSubmit={handleForm}>
        <div className="card-container">
          <h1 id="Name">Name: {eventData.name}</h1>
          <h3 id="StartDate">Start Date: {startDate}</h3>
          <h3 id="EndDate">End Date: {endDate}</h3>
          <button type="submit" className="select-button">
            Select
          </button>
        </div>
      </form>
    </>
  );
}

export default EventCard;
