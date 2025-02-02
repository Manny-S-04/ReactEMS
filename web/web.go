package web

import (
	"embed"
	"encoding/json"
	"net/http"

	"github.com/labstack/echo/v4"
)

var (
	//go:embed all:dist
	dist embed.FS
	//go:embed all:dist/index.html
	indexHTML     embed.FS
	distDirFS     = echo.MustSubFS(dist, "dist")
	distIndexHtml = echo.MustSubFS(indexHTML, "dist")
)

func RegisterHandlers(e *echo.Echo) {
	e.FileFS("/", "index.html", distIndexHtml)
	e.FileFS("/event-day", "index.html", distIndexHtml)
	e.FileFS("/create-booking", "index.html", distIndexHtml)
	e.FileFS("/create-event", "index.html", distIndexHtml)
	e.StaticFS("/", distDirFS)
}

func RegisterPages(e *echo.Echo, db *Database) {
	ApiEP(e, db)
	SelectEvent(e, db)
    CreateEvent(e,db)
	GetEvent(e, db)
	GetSlots(e, db)
	SubmitBooking(e, db)
}

func ApiEP(e *echo.Echo, db *Database) {
	e.GET("/api", func(c echo.Context) error {
		return c.String(http.StatusOK, "API")
	})
}

func GetSlots(e *echo.Echo, db *Database) {
	e.GET("/get-slots", func(c echo.Context) error {
		eventDate := c.QueryParam("eventdate")

		var (
			slots []Slot
			err   error
		)
		slots, err = db.GetSlotsByEventDay(eventDate, e)
		if err != nil {
			panic(e)
		}

		var jsonData []byte
		jsonData, err = json.Marshal(slots)
		if err != nil {
			panic(e)
		}
		return c.String(http.StatusOK, string(jsonData))
	})
}

func GetEvent(e *echo.Echo, db *Database) {
	e.POST("/get-event",
		func(c echo.Context) error {
			eventName := c.FormValue("name")

			var (
				eventDays []EventDay
				err       error
			)

			eventDays, err = db.GetEventDaysByEventName(eventName)
			if err != nil {
				panic(err)
			}

			var jsonData []byte
			jsonData, err = json.Marshal(eventDays)
			if err != nil {
				panic(err)
			}

			return c.String(http.StatusOK, string(jsonData))
		})
}

func SelectEvent(e *echo.Echo, db *Database) {
	e.GET("/select-event",
		func(c echo.Context) error {
			var (
				events []Event
				err    error
			)
			events, err = db.GetEvents()
			if err != nil {
				panic(err)
			}
			var jsonData []byte
			jsonData, err = json.Marshal(events)
			if err != nil {
				panic(err)
			}
			return c.String(http.StatusOK, string(jsonData))
		})
}

func CreateEvent(e *echo.Echo, db *Database){
    e.POST("/create-event",func(c echo.Context) (err error) {
        newEvent := new(Event)
        if err = c.Bind(newEvent); err != nil{
            return echo.NewHTTPError(http.StatusBadRequest, err.Error())
        }

        rows, err := db.CreateEvent(*newEvent, e)
        if (rows == 0 || err != nil){
            return echo.NewHTTPError(http.StatusBadRequest, err.Error())
        }

        return c.String(http.StatusOK, newEvent.Name)

    })
}

func SubmitBooking(e *echo.Echo, db *Database) {
	e.POST("/create-booking",
		func(c echo.Context) (err error) {
			bookedSlot := new(Slot)
			if err = c.Bind(bookedSlot); err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err.Error())
			}

            db.CreateBooking(*bookedSlot)

			return nil
		})
}
