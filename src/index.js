import { h, render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { NotFound } from "./pages/_404.js";
import "./style.css";
import { Page } from "./pages/Page.js";

export function App() {
	return h(
		LocationProvider,
		null,
		h(
			Router,
			null,
			h(Route, { path: "/", component: Page }),
			h(Route, { default: true, component: NotFound }),
		),
	);
}

render(h(App, null), document.getElementById("app"));
