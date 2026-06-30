import React from "react";//allows for the intervention of strict mode react
import ReactDOM from"react-dom/client"; //this is what helps us connect react to the html page
import App from "./App";//getting the app stuff from the export app line we had ealier in tsx
import "./index.css"; //give it some of that tailwind style

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode> {/*this is working on finding the real div that they want to put the page on also strict mode helps look for problems*/}
  <App /> {/*shows the main app component on the page */}
</React.StrictMode>); 