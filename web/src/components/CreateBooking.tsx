import { useRef, useState } from "react";
import "../assets/css/form.css";
import { URL_ENDPOINT } from "../assets/js/helpers";

/*
 * receive confirmation
 * return to slots page
 * */

function CreateBooking({
  children,
  slotid,
  eventdayid,
  name,
  email,
  number,
}: {
  children: React.ReactNode;
  slotid: number | null;
  eventdayid: number;
  name: string | null;
  email: string | null;
  number: string | null;
}) {
  const formRef = useRef(null);

  const [inputName, setInputName] = useState(name ?? "");
  const [inputEmail, setInputEmail] = useState(email ?? "");
  const [inputNumber, setInputNumber] = useState(number ?? "");

  function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      let formObj: {
        slotid: number | null;
        id: number;
        [key: string]: string | number | null | File;
      } = {
        slotid: slotid,
        id: eventdayid,
      };

      for (let [key, value] of formData.entries()) {
        formObj[key] = value;
      }

      const jsonString = JSON.stringify(formObj);

      fetch(URL_ENDPOINT("create-booking"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      })
        .then((_) => console.log("SUCCESS", jsonString))
        .catch((err) => console.error("ERROR", err));
    }
  }

  return (
    <>
      <div
        id="exitcontainer"
        style={{ position: "absolute", top: "0", left: "0" }}>
        {children}
      </div>
      <div id="bookingform" style={{ height: "50%", width: "80%" }}>
        <form className="form" onSubmit={handleForm} ref={formRef}>
          <h1>{inputName === "" ? "Create Booking" : "Edit Booking"}</h1>
          <input
            className="input"
            value={inputName}
            id="name"
            name="name"
            placeholder="Name"
            onChange={(e) => {
              setInputName(e.target.value);
            }}
          />
          <input
            className="input"
            id="email"
            value={inputEmail}
            onChange={(e) => {
              setInputEmail(e.target.value);
            }}
            name="email"
            placeholder="Email"
          />
          <input
            className="input"
            id="number"
            value={inputNumber}
            onChange={(e) => {
              setInputNumber(e.target.value);
            }}
            name="number"
            placeholder="Number"
          />
          <br />
          <button className="submit" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateBooking;
