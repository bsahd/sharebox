import Markdown from "markdown-to-jsx";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { socket } from "../sock";
import { createDiff, patchDiff } from "../components/diff.js";

export function Page() {
	const [page, setPage] = useState([]);
	useEffect(() => {
		function pedit(data) {
			setPage((page) => patchDiff(page, data));
		}
		function prep(data) {
			setPage(data);
		}
		socket.on("pageEdit", pedit);
		socket.on("pageReplace", prep);
		return () => socket.offAny(pedit);
	}, []);
	return h(
		"main",
		{ class: "page" },
		h(CodeMirror, {
			extensions: [markdown()],
			value: page.map((a) => a.text).join("\n"),
			onChange: (a) => {
				setPage((page) => {
					const d = createDiff(page, a.split("\n"));
					socket.emit("pageEdit", d);

					return patchDiff(page, d);
				});
			},
			key: "page",
		}),
		h(Markdown, null, page.map((a) => a.text).join("\n")),
	);
}
