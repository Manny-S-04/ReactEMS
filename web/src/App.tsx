import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import SelectEvent from "./pages/SelectEvent";
import EventDaysList from "./pages/EventDaysList";
import CreateEvent from "./pages/CreateEvent";

/*
 *
 * change css to suit full screen
 * find a way to compile to single exe
 * make docker
 * push to azure services
 *
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectEvent />} />
        <Route path="/event-day" element={<EventDaysList />} />
        <Route
          path="/create-event"
          element={<CreateEvent eventData={null} />}
        />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
