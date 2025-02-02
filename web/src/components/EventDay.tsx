import { useEffect, useState } from "react";
import SlotCard from "./SlotCard";
import "../assets/css/eventday.css";
import { useNavigate } from "react-router";
import { URL_ENDPOINT } from "../assets/js/helpers";

interface IEventDay {
  eventdayid: number;
  eventid: number;
  date: string;
  starttime: string;
  endtime: string;
  slotduration: number;
}

interface ISlot {
  slotid: number | null;
  eventdayid: number;
  starttime: string;
  duration: number;
  available: number;
  name: string | null;
  email: string | null;
  number: string | null;
}

function EventDay({ eventDayData }: { eventDayData: IEventDay }) {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [slots, setSlots] = useState<JSX.Element[]>([]);
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData("");
        const response = await fetch(
          URL_ENDPOINT(
            `get-slots?eventdate=${eventDayData.date.split("T")[0]}`,
          ),
        );
        const res = await response.text();
        setData(res);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    fetchData();
  }, [eventDayData.date]);

  if (error) {
    navigate("/");
  }

  useEffect(() => {
    const startDateTime = new Date(
      `${eventDayData.date.split("T")[0]}T${eventDayData.starttime}Z`,
    );
    const endDateTime = new Date(
      `${eventDayData.date.split("T")[0]}T${eventDayData.endtime}Z`,
    );

    const differenceInMilliseconds =
      endDateTime.getTime() - startDateTime.getTime();

    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    const noOfSlots = differenceInMinutes / eventDayData.slotduration;
    const slotData: ISlot[] = [];
    var slotsList: JSX.Element[] = [];

    let currentTime = startDateTime.getTime();

    for (let s = 0; s < noOfSlots; s++) {
      const slot: ISlot = {
        slotid: null,
        starttime: new Date(currentTime).toLocaleTimeString(),
        eventdayid: eventDayData.eventdayid,
        duration: eventDayData.slotduration,
        available: -1,
        name: null,
        email: null,
        number: null,
      };

      slotData[s] = slot;
      slotsList[s] = <SlotCard key={s} slotData={slot} />;

      currentTime += eventDayData.slotduration * 60 * 1000;
    }

    if (data || (data === "" && data.length !== 0)) {
      const slotsToFind = JSON.parse(data);

      if (slotsToFind) {
        slotsList = slotData.map((slot, i) => {
          const matchingSlot = slotsToFind.find(
            (s: ISlot) => s.starttime === slot.starttime,
          );

          if (matchingSlot) {
            return <SlotCard key={i} slotData={matchingSlot} />;
          }

          return <SlotCard key={i} slotData={slot} />;
        });
      }
    }
    setSlots(slotsList);
  }, [data]);

  return (
    <>
      <div className="eventday-container">
        <div>{slots}</div>
      </div>
    </>
  );
}

export default EventDay;
