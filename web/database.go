package web

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/glebarez/go-sqlite"
	"github.com/labstack/echo/v4"
)

type Database struct {
	DB *sql.DB
}

type Event struct {
	EventID   *int   `json:"eventid"`
	Name      string `json:"name"`
	StartDate string `json:"startdate"`
	EndDate   string `json:"enddate"`
}
type EventDay struct {
	EventDayID   int    `json:"eventdayid"`
	EventID      int    `json:"eventid"`
	Date         string `json:"date"`
	StartTime    string `json:"starttime"`
	EndTime      string `json:"endtime"`
	SlotDuration int    `json:"slotduration"`
}
type Slot struct {
	SlotID     int     `json:"slotid"`
	EventDayID int     `json:"eventdayid"`
	StartTime  string  `json:"starttime"`
	Duration   int     `json:"duration"`
	Available  int     `json:"available"`
	Name       *string `json:"name"`
	Email      *string `json:"email"`
	Number     *string `json:"number"`
}

func RegisterDatabase() Database {
	pathToDb := "/home/manny/WebProjects/ReactBAapp/web/database/events.db"
	db, err := sql.Open("sqlite", fmt.Sprintf("file:%s?cache=shared", pathToDb))
	if err != nil {
		panic(err)
	}
	if err = db.Ping(); err != nil {
		panic(err)
	}

	return Database{DB: db}
}

func (db Database) GetEvents() ([]Event, error) {
	stmt := "SELECT eventid, name, startdate, enddate FROM Events;"

	rows, err := db.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event

	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.EventID, &e.Name, &e.StartDate, &e.EndDate); err != nil {
			return nil, err
		}
		events = append(events, e)
	}

	return events, nil
}

func (db Database) GetEventDaysByEventName(eventName string) ([]EventDay, error) {
	stmt := `
	SELECT ed.eventdayid, ed.eventid, ed.date, ed.starttime, ed.endtime, ed.slotduration
	FROM EventDays ed
	JOIN Events e ON ed.eventid = e.eventid
	WHERE e.name = ?;`

	rows, err := db.DB.Query(stmt, eventName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var eventDays []EventDay

	for rows.Next() {
		var ed EventDay
		if err := rows.Scan(&ed.EventDayID, &ed.EventID, &ed.Date, &ed.StartTime, &ed.EndTime, &ed.SlotDuration); err != nil {
			return nil, err
		}
		eventDays = append(eventDays, ed)
	}

	return eventDays, nil
}

func (db Database) GetSlotsByEventDay(eventDayDate string, e *echo.Echo) ([]Slot, error) {
	stmt := `
    SELECT s.slotid, s.eventdayid, s.starttime, s.duration, s.available, s.name, s.email, s.number
    FROM Slots s
    JOIN Eventdays ed ON ed.eventdayid = s.eventdayid
    WHERE ed.date = ?;`

	rows, err := db.DB.Query(stmt, eventDayDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var slots []Slot

	for rows.Next() {
		var s Slot
		if err := rows.Scan(&s.SlotID, &s.EventDayID, &s.StartTime, &s.Duration, &s.Available, &s.Name, &s.Email, &s.Number); err != nil {
			return nil, err
		}
		slots = append(slots, s)
	}

	return slots, nil
}

func (db Database) CreateEvent(newEvent Event, e *echo.Echo) (int64, error) {

	stmt := `SELECT eventid FROM Events WHERE eventid = ?`

	row := db.DB.QueryRow(stmt, newEvent.EventID)

	id := ""
	_ = row.Scan(&id)
	if id != "" {
		stmt = `UPDATE Events SET name = ?, startdate = ?, enddate = ? WHERE eventid = ?`
		result, err := db.DB.Exec(stmt, newEvent.Name, newEvent.StartDate, newEvent.EndDate, newEvent.EventID)
		if err != nil {
			return 0, err
		}
		return result.RowsAffected()
	}

	stmt = `
    INSERT INTO Events (name, startdate, enddate)
    VALUES (?,?,?)
    `
	result, err := db.DB.Exec(stmt, newEvent.Name, newEvent.StartDate, newEvent.EndDate, newEvent.EventID)
	if err != nil {
		return 0, err
	}

	startDate, err := time.Parse("2006-01-02", newEvent.StartDate)
	if err != nil {
		return 0, err
	}

	endDate, err := time.Parse("2006-01-02", newEvent.EndDate)
	if err != nil {
		return 0, err
	}

	numberOfDays := int(endDate.Sub(startDate).Hours() / 24)
	if numberOfDays == 0 {
		return result.RowsAffected()
	}

	for i := 0; i < numberOfDays; i++ {
		newDate := startDate.AddDate(0, 0, i).Format("2006-01-02")
		stmt = `INSERT INTO EventDays (eventid, date, starttime, endtime) VALUES (?,?,?,?)`
		result, err = db.DB.Exec(stmt, newEvent.EventID, newDate, "9:00:00", "17:00:00")
		if err != nil {
			return 0, err
		}
	}

	return result.RowsAffected()

}

func (db Database) CreateBooking(slot Slot) (int64, error) {
	stmt := `SELECT slotid FROM Slots WHERE slotid = ?`

	row := db.DB.QueryRow(stmt, slot.SlotID)

	id := ""
	_ = row.Scan(&id)
	if id != "" {
		stmt = `UPDATE Slots SET name = ?, email = ?, number = ? WHERE slotid = ?`
		result, err := db.DB.Exec(stmt, slot.Name, slot.Email, slot.Number, slot.SlotID)
		if err != nil {
			panic(err)
		}
		return result.RowsAffected()
	}

	stmt = `
    INSERT INTO Slots (eventdayid, starttime, duration, available, name, email, number)
    VALUES (?,?,?,?,?,?,?)
    `
	result, err := db.DB.Exec(stmt, slot.EventDayID, slot.StartTime,
		slot.Duration, slot.Available, slot.Name, slot.Email, slot.Number)
	if err != nil {
		return 0, err
	}

	// returns number of rows affected + err (nill)
	return result.RowsAffected()
}

func (db Database) InitializeDatabase() bool {
	createEventTable := `
    CREATE TABLE IF NOT EXISTS Events (
        eventid INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        startdate DATETIME NOT NULL,
        enddate DATETIME NOT NULL
    );`

	createEventDayTable := `
    CREATE TABLE IF NOT EXISTS EventDays (
        eventdayid INTEGER PRIMARY KEY,
        eventid INTEGER NOT NULL,
        date DATETIME NOT NULL,
        starttime TIME NOT NULL,
        endtime TIME NOT NULL,
        FOREIGN KEY(eventid) REFERENCES Event(eventid)
    );`
	rows, err := db.DB.Query(`SELECT name FROM sqlite_master WHERE type='trigger'`)
	if err != nil {
		rows.Close()
		panic(err)
	}
	defer rows.Close()

	for rows.Next() {
		var triggerName string
		if err := rows.Scan(&triggerName); err != nil {
			panic(err)
		}

		query := fmt.Sprintf("DROP TRIGGER IF EXISTS %s", triggerName)
		_, err := db.DB.Query(query)
		if err != nil {
			panic(err)
		}
	}

	createSlotTable := `
    CREATE TABLE IF NOT EXISTS Slots (
        slotid INTEGER PRIMARY KEY,
        eventdayid INTEGER NOT NULL,
        starttime TIME NOT NULL,
        duration INTEGER NOT NULL,
        available INTEGER NOT NULL,
        name TEXT,
        email TEXT,
        number TEXT,
        FOREIGN KEY(eventdayid) REFERENCES EventDay(eventdayid)
    );`

	eventdaysSlotTrigger := `
DROP TRIGGER IF EXISTS check_slot_duration;
CREATE TRIGGER check_slot_duration
BEFORE INSERT ON Slots
FOR EACH ROW
BEGIN
    SELECT
    CASE
        WHEN (SELECT slotduration FROM Eventdays WHERE eventdayid = NEW.eventdayid) < NEW.duration THEN
            RAISE (ABORT, 'Slot duration cannot exceed event day slot duration')
    END;
END;

`
	slotInsertTrigger := `
        DROP TRIGGER IF EXISTS validate_slot_times;
        CREATE TRIGGER validate_slot_times
        BEFORE INSERT ON Slots
        FOR EACH ROW
        BEGIN
            SELECT CASE
                    WHEN NEW.starttime < (SELECT starttime FROM Eventdays WHERE eventdayid = NEW.eventdayid)
                    THEN RAISE (ABORT, 'Slot starttime must be after the event starttime')
                    WHEN strftime('%H:%M:%S', NEW.starttime, '+' || NEW.duration || ' minute') > (SELECT endtime FROM Eventdays WHERE eventdayid = NEW.eventdayid)
                    THEN RAISE (ABORT, 'Slot endtime must be before the event endtime')
                END;
        END;

`
	slotDurationTrigger := `
DROP TRIGGER IF EXISTS enforce_duration_limit;
CREATE TRIGGER enforce_duration_limit
BEFORE INSERT ON Slots
FOR EACH ROW
BEGIN
    SELECT CASE
            WHEN NEW.duration > 15 THEN
                RAISE (ABORT, 'Slot duration must be less than or equal to 15 minutes')
        END;
END;

`

	slotAvailableTrigger := `
DROP TRIGGER IF EXISTS available_check;
CREATE TRIGGER available_check
    BEFORE INSERT ON Slots
    FOR EACH ROW
    BEGIN
        SELECT CASE
            WHEN NEW.available < -1 OR NEW.available > 1 THEN
                RAISE(ABORT, 'available must be between -1 and 1')
        END;
    END;
`

	queries := []string{createEventTable, createEventDayTable, createSlotTable, eventdaysSlotTrigger, slotInsertTrigger, slotDurationTrigger, slotAvailableTrigger}
	for _, query := range queries {
		_, err := db.DB.Exec(query)
		if err != nil {
			return false
		}
	}

	return true
}
