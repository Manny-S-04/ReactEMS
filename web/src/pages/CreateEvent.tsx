import { useRef, useState } from "react";
import "../assets/css/createevent.css";
import Header from "../components/Header";
import { URL_ENDPOINT } from "../assets/js/helpers";
import { useNavigate } from "react-router";

interface IEvent {
  eventid: number;
  name: string;
  startdate: string;
  enddate: string;
}

function CreateEvent({ eventData }: { eventData: IEvent | null }) {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const formRef = useRef(null);

  let header = "Create";

  if (eventData) {
    header = "Edit";
    setEventName(eventData.name);
    setStartDate(eventData.startdate);
    setEndDate(eventData.enddate);
  }

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (eventName === "" || startDate === "" || endDate === "") {
      navigate("/create-event");
      return <></>;
    }

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      let formObj: {
        eventid: number | null;
        [key: string]: string | number | null | File;
      } = { eventid: 0 };

      if (eventData) {
        formObj = { eventid: eventData.eventid };
      }
      for (let [key, value] of formData.entries()) {
        formObj[key] = value;
      }
      const jsonString = JSON.stringify(formObj);

      fetch(URL_ENDPOINT("create-event"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      })
        .then((_) => console.log("SUCCESS", jsonString))
        .catch((err) => console.error("ERROR", err));
    }
  };

  return (
    <>
      <Header>
        <button
          style={{ position: "absolute", top: "0", left: "0", height:"auto" }}
          className="select-button"
          onClick={() => {
            navigate("/");
          }}
        >
          Return To Events
        </button>
        <h1>{header} Event</h1>
      </Header>
      <div className="create-container">
        <form
          className="form"
          ref={formRef}
          onSubmit={handleForm}
          style={{ gap: "1rem" }}
        >
          <label htmlFor="name">Event Name</label>
          <input
            className="input"
            value={eventName}
            id="eventName"
            name="name"
            onChange={(e) => {
              setEventName(e.target.value);
            }}
          />
          <label htmlFor="StartDate">StartDate</label>
          <input
            id="startDate"
            value={startDate}
            name="startdate"
            type="date"
            onChange={(e) => {
              const newStartDate = e.target.value;
              if (newStartDate <= endDate || !endDate) {
                setStartDate(newStartDate);
              } else {
                alert("Start Date must be before or equal to End Date");
              }
            }}
          />
          <label htmlFor="EndDate">EndDate</label>
          <input
            id="endDate"
            value={endDate}
            name="enddate"
            type="date"
            onChange={(e) => {
              const newEndDate = e.target.value;
              if (newEndDate >= startDate || !startDate) {
                setEndDate(newEndDate);
              } else {
                alert("End Date must be after or equal to Start Date");
              }
            }}
          />

          <button type="submit" className="select-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateEvent;
