import CreateBooking from "./CreateBooking";
import { createRoot } from "react-dom/client";
import "../assets/css/slot.css";
import { CREATE_BLUR, CREATE_BOOKING_CONTAINER } from "../assets/js/helpers";

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

/*
 * style each slot based on if available
 * code clean up
 * make blur component
 */

function SlotCard({ slotData }: { slotData: ISlot }) {
  let slotClass;
  switch (slotData.available) {
    case -1:
      slotClass = "available";
      break;
    case 0:
      slotClass = "booked";
      break;
    case 1:
      slotClass = "attended";
      break;
  }

  function undoTransformation(div: HTMLDivElement, button: HTMLButtonElement) {
    document.body.removeChild(document.getElementById("blur")!);
    document.getElementById("exitcontainer")!.style.opacity = "0";
    const form = document.getElementById("bookingform")!;
    while (form.hasChildNodes()) {
      form.removeChild(form.firstChild!);
    }
    const originalStyles = div.dataset.originalPosition
      ? JSON.parse(div.dataset.originalPosition)
      : null;

    if (originalStyles) {
      div.style.top = originalStyles.top;
      div.style.left = originalStyles.left;
      div.style.width = originalStyles.width;
      div.style.height = originalStyles.height;

      div.addEventListener(
        "transitionend",
        () => {
          div.remove();
          button.disabled = false;
        },
        { once: true },
      );
    }
  }

  function slotSelect(event: React.MouseEvent<HTMLButtonElement>) {
    CREATE_BLUR();
    const button = event.currentTarget;
    const div = CREATE_BOOKING_CONTAINER(button);
    div.ontransitionend = () => {
      const buttonstyle = {
        zIndex: "1001",
        backgroundColor: "var(--primary-background)",
        color: "var(--tertiary-background)",
        border: "none",
        cursor: "pointer",
        height: "3rem",
        width: "4rem",
        borderRadius: "0.5rem",
      };

      const exitButtonClick = () => undoTransformation(div, button);
      createRoot(div).render(
        <CreateBooking
          slotid={slotData.slotid}
          eventdayid={slotData.eventdayid}
          name={slotData.name}
          email={slotData.email}
          number={slotData.number}
        >
          <div>
            <button style={buttonstyle} onClick={exitButtonClick}>
              X
            </button>
          </div>
        </CreateBooking>,
      );
    };
  }

  return (
    <>
      <button onClick={slotSelect} className={slotClass}>
        <div>
          {slotData.starttime}
          <p style={{ fontSize: "9px" }}>{slotClass}</p>
        </div>
      </button>
    </>
  );
}
export default SlotCard;
