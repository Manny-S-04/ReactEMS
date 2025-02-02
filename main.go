package main

import (
	"BaApp/web"

	"github.com/labstack/echo/v4"
)


func main(){
    e := echo.New()
    var database web.Database = web.RegisterDatabase()
    _ = database.InitializeDatabase()
    web.RegisterHandlers(e)
    web.RegisterPages(e, &database)
    e.Logger.Fatal(e.Start(":8080"))
}


