import { v4 as uuidv4 } from "uuid";

/**
 * @param {{id:string,text:string}[]} lines
 * @param {string[]} editedText
 */
export function createDiff(lines, editedText) {
	/** @type {{type:"insert"|"replace"|"delete",position:string,text:string,id:string}[]} */
	const changes = [];
	let index = 0;
	let editedIndex = 0;

	while (index < lines.length || editedIndex < editedText.length) {
		const line = lines[index];
		const after = editedText[editedIndex];

		if (line?.text === after) {
			index++;
			editedIndex++;
		} else if (!line) {
			changes.push({
				type: "insert",
				position: "bottom",
				text: after,
				id: uuidv4(),
			});
			editedIndex++;
		} else if (editedText.slice(editedIndex).includes(line.text)) {
			changes.push({
				type: "insert",
				text: after,
				position: line.id,
				id: uuidv4(),
			});
			editedIndex++;
		} else if (
			lines
				.slice(index)
				.map((a) => a.text)
				.includes(after)
		) {
			console.log("del");
			changes.push({
				type: "delete",
				position: line.id,
				text: "",
				id: line.id,
			});
			index++;
		} else {
			changes.push({
				type: "replace",
				position: line.id,
				text: after,
				id: line.id,
			});
			index++;
			editedIndex++;
		}
	}
	console.log(changes);
	return changes;
}

/**
 * @param {{id:string,text:string}[]} lines
 * @param {{type:"insert"|"replace"|"delete",position:string,text:string,id:string}[]} patch
 */

export function patchDiff(lines, patch) {
	let patchi = 0;
	/** @type {{id:string,text:string}[]} */
	const newLine = [];
	for (let index = 0; index < lines.length; index++) {
		const element = lines[index];
		const pat = patch[patchi];
		if (pat?.position == element.id) {
			if (pat.type == "insert") {
				newLine.push({ text: pat.text, id: pat.id });
				index--;
			} else if (pat.type != "delete") {
				newLine.push({ text: pat.text, id: element.id });
			}
			patchi++;
		} else {
			newLine.push(element);
		}
	}
	if (patchi < patch.length) {
		for (const element of patch.slice(patchi)) {
			if (element.position == "bottom") {
				newLine.push({ text: element.text, id: element.id });
			}
		}
	}
	return newLine;
}
