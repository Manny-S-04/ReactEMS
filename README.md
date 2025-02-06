- clone the repo
- docker build . -t {image name}
- docker run --rm -p 8080:8080 {image name}

This will open the app on the localmachine's 8080 port

This is a basic EMS which displays a list of events, events are creatable on the first page,
events are currently not deletable or mutable.
bookings can be made by clicking a slot and entering information

# Things learned:
- docker
- golang
- react js
- database sqlite
