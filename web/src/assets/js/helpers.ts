import "../../components/MessageBox";

export const GET_URL = () => {
  return "http://localhost:8080/";
};
export const URL_ENDPOINT = (endpoint: string) => {
  return GET_URL() + endpoint;
};


export const CREATE_BLUR = () => {
  const blur = document.createElement("div");
  blur.id = "blur";
  Object.assign(blur.style, {
    position: "absolute",
    top: "0px",
    left: "0px",
    height: "100vh",
    width: "100vw",
    zIndex: "999",
  });
  blur.className = "acrylic";
  document.body.appendChild(blur);
  blur.offsetHeight;
};

export const CREATE_BOOKING_CONTAINER = (button: HTMLButtonElement) => {
  const rect: DOMRect = button.getBoundingClientRect();

  const div = document.createElement("div");

  div.dataset.originalPosition = JSON.stringify({
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });

  Object.assign(div.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    backgroundColor: "var(--tertiary-background)",
    transition: "all 0.5s ease",
    zIndex: "1000",
  });

  document.body.appendChild(div);

  div.offsetHeight;

  Object.assign(div.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "0",
    left: "0",
    width: "100vw",
    height: `${document.body.scrollHeight}px`,
  });

  button.disabled = true;


    return div;
};
