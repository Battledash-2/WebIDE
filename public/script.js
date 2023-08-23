function serialize(text) {
	return text.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
}

const ColorCode = {
	identifier: '#ffd286',
	string: '#9ef396',
	number: '#fd8733',
	comment: '#3e5263',
	keyword: '#da9ce4',
	operator: '#fe9d7c',
	call: '#5274f1',
};

function makeColor(color, text) {
	return '<span style="color:' + color + ' !important">' + text + '</span>';
}

function colorFor(text) {
	let color = '';
	for (let item of spec) {
		// if (new RegExp(item[0].match(match))
		if (new RegExp('^' + item[0].source).exec(text) != null) {
			if (typeof item[1] === 'string') color = item[1];
			else if (typeof item[1] === 'function') return item[1](text);
			break;
		}
	}

	return color;
}

const spec = [
	[/&lt;|&gt;/, ''],
	[/("|')(\\\1|((?!\1).))*\1/, ColorCode.string],
	[/--.*/, ColorCode.comment],
	[/(\d+\.?\d*|\.?\d+)\b/, ColorCode.number],
	[/[()\[\].*/\\+-=;{}><]|\.\./, ColorCode.operator],
	[
		/(local|function|then|do|end|for|if|elseif|else|return)\b/,
		ColorCode.keyword,
	],
	[
		/[A-Za-z][A-Za-z0-9]*\(/,
		(match) => {
			return (
				makeColor(ColorCode.call, match.slice(0, -1)) +
				makeColor(colorFor('('), '(')
			);
		},
	],
	[/[A-Za-z][A-Za-z0-9]*/, ColorCode.identifier],
];

const regex = spec.reduce((prev, cur) => {
	return new RegExp(
		(prev[0] == null ? prev.source : prev[0].source) +
			'|' +
			(cur[0] == null ? cur.source : cur[0].source),
		'g'
	);
});

function colorCode(code) {
	code = serialize(code);

	let out = code;
	out = out.replace(
		regex,
		// (match) => '<span style="color: ' + i[1] + '">' + match + '</span>'
		(match) => {
			let color = colorFor(match);
			return color === ''
				? match
				: color.startsWith('<')
				? color
				: makeColor(color, match);
		}
	);

	return out;
}

function addAt(string = '', add = '', from = 0) {
	return string.slice(0, from) + add + string.slice(from, string.length);
}

onload = () => {
	let tab = 0;
	let tabs = [
		['{', '}'], // [ start, end ]
		['(', ')'],
		['[', ']'],
	];
	let opened = [];

	editor.addEventListener('input', (e) => {
		let display = document.querySelector('#display');
		const colored = colorCode(e.target.value);
		display.innerHTML = colored;
	});
	editor.addEventListener('keydown', (e) => {
		let display = document.querySelector('#display');

		function getLine(
			start = e.target.selectionStart,
			text = e.target.value,
			idx = false
		) {
			idx = 0;
			let line = 0;
			let split = text.split('\n');
			let lastitem = null;

			let lineEnd = 0;
			let lineStart = 0;
			let relstart = 0;

			for (let item of split) {
				if (item.length + idx + Math.max(0, split.length - 1) < start) {
					idx += item.length;
					lineStart = idx + Math.max(0, split.length - 1);
					line++;
					continue;
				}

				lastitem = item;
				idx += lastitem.length;
				lineEnd = idx + Math.max(0, split.length - 1);

				break;
			}

			return {
				line: Math.max(0, line),
				text: split[Math.max(0, line)],
				lineEnd,
				lineStart,
				selection: relstart,
			};
		}

		function replaceLine(text, line, nl) {
			return text
				.split('\n')
				.map((val, idx) => (idx === line ? nl : val))
				.join('\n');
		}
		function check(str = e.target.value, v) {
			if (
				typeof v === 'string' ||
				(typeof v === 'object' && v instanceof RegExp)
			)
				return (str.split(v) || [undefined]).length - 1;
			// array
			let count = 0;
			for (let i in v) {
				let vv = v[i];
				count += (str.split(vv) || [undefined]).length - 1;
			}
			return v.reduce(
				(p, c) => p + ((str.split(c) || [undefined]).length - 1),
				0
			);
		}
		function updateTabs(string = e.target.value) {
			tab = 0;
			opened = [];

			for (let i in tabs) {
				let v = tabs[i];
				// let count = (string.split(v[0]) || [undefined]).length - 1;
				let count = check(string, v[0]);
				tab += count;
				opened = [...opened, ...new Array(count).fill(Number(i))];

				count = check(string, v[1]);
				tab = Math.max(0, tab - count);
				if (count > 0 && opened.indexOf(v[1]) > -1)
					opened.splice(opened.indexOf(v[1]), 1);
			}
		}
		function checkCloser(argItem = null) {
			const tar = e.target;
			let item = argItem;

			for (let i of opened) {
				item = argItem;
				let v = tabs[i];
				if (typeof v[1] === 'string') {
					item =
						argItem != null
							? item
							: tar.value.slice(
									tar.selectionStart - (v[1].length - 1),
									tar.selectionStart
							  ) + e.key;
					let res = opened.some((v) => check(item, tabs[v][1]) > 0);
					if (res) return res;
				} else {
					for (let i1 of v[1].sort((a, b) => a.length - b.length)) {
						item =
							argItem != null
								? item
								: tar.value.slice(
										tar.selectionStart - (i1.length - 1),
										tar.selectionStart
								  ) + e.key;
						let res = opened.some(
							(v) => check(item, tabs[v][1]) > 0
						);
						if (res) return res;
					}
				}
			}
			return false;
		}

		if (e.key === 'Tab') {
			e.preventDefault();
			if (e.target.selectionStart === e.target.selectionEnd) {
				e.target.value = addAt(
					e.target.value,
					'\t',
					e.target.selectionStart
				);
			} else {
				const line = getLine();
				const newLine = replaceLine(
					e.target.value,
					line.line,
					'\t' + e.target.value.slice(line.lineStart, line.lineEnd)
				);
				e.target.value = newLine;
			}
		} else if (checkCloser(null)) {
			e.preventDefault();
			updateTabs();

			const line = getLine();
			const val = e.target.value;
			const sel = e.target.selectionStart;

			tab = Math.max(0, tab - 1);

			const nl = replaceLine(
				val,
				line.line,
				'\t'.repeat(tab) +
					val.slice(line.lineStart, sel).trimStart() +
					e.key +
					val.slice(sel)
			);

			e.target.value = nl;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			updateTabs();
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;
			const val = e.target.value;
			const add = '\n' + '\t'.repeat(tab);

			e.target.value = addAt(val, add, start);
			// e.target.selectionStart--;
			e.target.selectionStart = start + add.length;
			e.target.selectionEnd = end + add.length;
		}

		display.innerHTML = colorCode(e.target.value);
	});
};
