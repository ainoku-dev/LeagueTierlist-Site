# LeagueTierlist-Site

This project provides a small web application for rating League of Legends skins.
Users can choose one of four preset accounts, rate skins and see a tier list
sorted by the average rating across all users.

## Running locally

A minimal Node.js server is included for development. After installing the
dependencies you can start the server and view the site in your browser.

```bash
npm install
npm start
```

The application will be available at http://localhost:3000 (or the port set in
`PORT`). The server simply serves the static files in this repository.

## Exposing with ngrok

To share the development server over the internet you can use [ngrok](https://ngrok.com/).
After installing ngrok and logging in, run the following command in a separate
terminal after starting the server:

```bash
ngrok http --url=complete-sloth-ultimately.ngrok-free.app 3000
```

This will make the site available at
`https://complete-sloth-ultimately.ngrok-free.app`.
