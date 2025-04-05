import Markdown from "markdown-to-jsx";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { socket } from "../sock";

export function Page() {
	const [page, setPage] = useState("");
	useEffect(() => {
		function pedit(data) {
			setPage(data);
		}
		socket.on("pageEdit", pedit);
		return () => socket.offAny(pedit);
	}, []);
	return h(
		"main",
		{ class: "page" },
		h(CodeMirror, {
			extensions: [markdown()],
			value: page,
			onChange: (a) => {
				socket.emit("pageEdit", a);
			},
		}),
		h(Markdown, null, page),
	);
}
