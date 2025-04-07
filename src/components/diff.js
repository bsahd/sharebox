import { v4 as uuidv4 } from "uuid";

/**
 * @param {string} text
 * @param {string[]} arr
 * @returns {boolean}
 */
function replaceOrInsert(text, arr) {
	// 編集後のテキスト内にすでにそのテキストが含まれているかを判定
	// console.log("roi", text, arr, arr.indexOf(text), arr.indexOf(text) !== -1);
	return arr.indexOf(text) !== -1;
}

/**
 * @param {{id:string,text:string}[]} lines - 元の行
 * @param {string[]} editedText - 編集後の行
 */
export function createDiff(lines, editedText) {
	/** @type {{type:"insert"|"replace"|"delete",position:string,text:string,id:string}[]} */
	const changes = [];
	let index = 0;
	let editedIndex = 0;

	// 元の行と編集後の行を比較して変更を追跡
	while (index < lines.length || editedIndex < editedText.length) {
		const line = lines[index];
		const after = editedText[editedIndex];
		console.log(index, editedIndex, line?.text, after);

		// 行が一致した場合（変更なし）
		if (line?.text === after) {
			index++;
			editedIndex++;
		}
		// 編集後の行に新しい行が挿入された場合
		else if (!line) {
			changes.push({
				type: "insert",
				position: "bottom", // 最後に挿入
				text: after,
				id: uuidv4(),
			});
			editedIndex++;
		}
		// 途中に挿入された場合
		else if (replaceOrInsert(line.text, editedText.slice(editedIndex))) {
			changes.push({
				type: "insert",
				text: after,
				position: line.id, // 現在の行IDを位置として使う
				id: uuidv4(),
			});
			editedIndex++;
		}
		// 行が変更された場合（元の行と編集後の行が異なる）
		else if (
			replaceOrInsert(
				after,
				lines.slice(index).map((a) => a.text),
			)
		) {
			//lines[index + 1]?.text == after
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
	console.log(changes)
	return changes;
}

/**
 * @param {{id:string,text:string}[]} lines - 元の行
 * @param {{type:"insert"|"replace"|"delete",position:string,text:string,id:string}[]} patch
 */

export function patchDiff(lines, patch) {
	let patchi = 0;
	/** @type {{id:string,text:string}[]} */
	const newLine = [];
	for (let index = 0; index < lines.length; index++) {
		const element = lines[index];
		const pat = patch[patchi];
		console.log(index,patchi,element,pat)
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
	console.log(newLine)
	return newLine;
}
