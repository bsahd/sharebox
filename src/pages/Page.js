import Markdown from "markdown-to-jsx";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { socket } from "../sock";
import createPatch from "textdiff-create";
import applyPatch from "textdiff-patch";

export function Page() {
	const [page, setPage] = useState("");
	useEffect(() => {
		function pedit(data) {
			setPage((page) => applyPatch(page, data));
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
				socket.emit("pageEdit", createPatch(page, a));
				setPage(a);
			},
			key: "page",
		}),
		h(Markdown, null, page),
	);
}
