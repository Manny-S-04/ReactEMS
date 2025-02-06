FROM golang:1.23

WORKDIR /usr/src/app

COPY go.mod go.sum .

RUN go mod download

ENV PATH_TO_DB=./web/database/events.db

COPY main .

COPY web/database/events.db ./web/database/

CMD ["./main"]

EXPOSE 8080




