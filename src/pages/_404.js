import { h } from "preact";

export function NotFound() {
	return h(
		'section',
		null,
		h('h1', null, '404: Not Found'),
		h('p', null, "It's gone :(")
	);
}
