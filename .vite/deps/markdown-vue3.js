import { $ as createTextVNode, Bn as markRaw, Dt as mergeProps, G as createBlock, Jt as renderSlot, K as createCommentVNode, Kn as ref, M as Fragment, U as computed, Ut as provide, Vt as openBlock, W as createBaseVNode, Yt as resolveComponent, Z as createSlots, Zt as resolveDynamicComponent, dn as useSlots, et as createVNode, ft as guardReactiveProps, gn as watch, gr as normalizeProps, hr as normalizeClass, nr as unref, nt as defineComponent, q as createElementBlock, qt as renderList, vr as toDisplayString, xn as withCtx, xt as inject } from "./vue.runtime.esm-bundler-CaV6uQJ2.js";
//#region node_modules/markdown-vue3/dist/markdown-vue3.es.js
var O = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
function k(e) {
	if (typeof e != "string" || (e = e.trim(), !e.startsWith("<") || !e.endsWith(">"))) return !1;
	if (e.startsWith("</")) {
		let t = e.slice(2, -1).trim();
		return /^[A-Z][A-Z0-9\-.:]*$/i.test(t) ? -1 : !1;
	}
	if (e.startsWith("<!") || e.startsWith("<?")) return !1;
	let t = 1, n = e.length, r = "";
	for (; t < n && /[A-Z0-9\-.:]/i.test(e[t]);) r += e[t++];
	if (!r) return !1;
	for (; t < n;) {
		for (; t < n && /\s/.test(e[t]);) t++;
		if (t >= n) break;
		if (e[t] === "/" && t + 1 < n && e[t + 1] === ">") return 0;
		if (e[t] === ">") return O.has(r.toLowerCase()) ? 0 : 1;
		if (!/[A-Z_:]/i.test(e[t])) return !1;
		let i = "";
		for (; t < n && /[\w\-.:]/.test(e[t]);) i += e[t++];
		for (; t < n && /\s/.test(e[t]);) t++;
		if (t < n && e[t] === "/" && t + 1 < n && e[t + 1] === ">") return 0;
		if (t < n && e[t] === ">") return O.has(r.toLowerCase()) ? 0 : 1;
		if (t < n && e[t] === "=") {
			for (t++; t < n && /\s/.test(e[t]);) t++;
			if (t >= n) return !1;
			if (e[t] === "\"" || e[t] === "'") {
				let r = e[t++];
				for (; t < n && e[t] !== r;) t++;
				if (t >= n) return !1;
				t++;
				continue;
			} else {
				let r = t;
				for (; t < n && /[^\s>]/.test(e[t]);) t++;
				if (t === r) return !1;
				continue;
			}
		}
		t < n && e[t] !== ">" && e[t];
	}
	return !1;
}
function A(e) {
	let t = {};
	if (e.attrs && Array.isArray(e.attrs)) for (let [n, r] of e.attrs) t[n] = r;
	return t;
}
function j(e) {
	try {
		let t = JSON.parse(e), n = (e) => {
			if (e && typeof e == "object" && !Array.isArray(e)) {
				let t = {};
				return Object.keys(e).sort().forEach((r) => {
					t[r] = n(e[r]);
				}), t;
			}
			return e;
		};
		return JSON.stringify(n(t));
	} catch {
		return e.trim();
	}
}
function M(e, t) {
	let n = e.open || e;
	return Array.isArray(n.map) && n.map.length ? `:${n.map[0]}` : t === void 0 ? "" : `:${t}`;
}
function N(e, t) {
	let n = A(e), r = Object.keys(n).length ? JSON.stringify(n, Object.keys(n).sort()) : "", i = e.templateType;
	if (i) {
		if (i.startsWith("container:")) return `${i}:${r}${M(e, t)}`;
		if (e.type === "fence" && i.startsWith("fence:")) return `${i}:${j(e.content || "")}:${r}${M(e, t)}`;
		if (i.startsWith("tag:")) return `${i}:${r}${M(e, t)}`;
	}
	let a = e.content === void 0 ? "" : e.content;
	(e.type === "text" || e.type === "code_inline" || e.type === "html_inline" || e.type === "html_block") && (a = a.slice(0, 50));
	let o = M(e, t);
	return `${e.type}:${e.tag || ""}${r}${a}${o}`;
}
function ee(e) {
	let t = [], n = /([a-zA-Z_:][\w\-:]*)(?:=(["'])((?:(?!\2).)*?)\2)?/g, r;
	for (; (r = n.exec(e)) !== null;) {
		let e = r[1], n = r[3] ?? "";
		t.push([e, n]);
	}
	return t;
}
function te(e) {
	if (e.type !== "html_inline") return;
	let t = k(e.content);
	if (t === !1) return;
	e.nesting = t;
	let n = e.content.match(/^<(\/?)([a-zA-Z][a-zA-Z0-9\-.:]*)/);
	if (n && (e.tag = n[2]), t === 1 || t === 0) {
		let t = e.content.indexOf(e.tag) + e.tag.length, n = e.content.length - 1;
		e.content.endsWith("/>") && n--, e.attrs = ee(e.content.substring(t, n).trim());
	}
}
function P(e) {
	let t = [], n = [], r = (e) => {
		let r = t[t.length - 1];
		r ? r.children.push(e) : n.push(e);
	};
	for (let [n, i] of e.entries()) if (te(i), i.nesting === 1) {
		let e = {
			type: "group",
			tag: i.tag || "span",
			open: i,
			close: null,
			children: [],
			_skip: !1,
			_stableKey: N(i, n)
		};
		i.type.startsWith("container_") && (e.templateType = `container:${i.info?.split(" ")[0]}`), r(e), t.push(e);
	} else if (i.nesting === -1) {
		let e = t.pop();
		e && (e.close = i);
	} else r(i);
	return n;
}
function F(e) {
	let { tokens: t, tags: n, fences: r, onThinking: i, onProgress: a } = e, o = [], s = [], c = (e) => {
		if (!("templateType" in e) || !e.templateType) if (e.type === "fence") {
			let t = e.info?.split(" ")[0];
			t && r.includes(t) && (e.templateType = `fence:${t}`);
		} else "tag" in e && n.includes(e.tag) && (e.templateType = `tag:${e.tag}`);
		if (o.length > 0) {
			let t = o[o.length - 1];
			t.children = t.children || [], t.children.push(e);
		} else s.push(e);
	};
	for (let [e, r] of t.entries()) if (r.nesting === 1) if (r.tag) {
		let t = {
			type: "group",
			tag: r.tag,
			open: r,
			close: null,
			children: [],
			_skip: !1,
			_stableKey: N(r, e)
		};
		if (r.type.startsWith("container_")) {
			let e = r.info?.split(" ")[0];
			if (t.templateType = `container:${e}`, e === "thinking" && i) {
				t._skip = !0, o.push(t);
				continue;
			} else if (e === "progress" && a) {
				t._skip = !0, o.push(t);
				continue;
			}
		} else r.type === "html_inline" ? t.templateType = "group:html_inline" : n.includes(r.tag) && (t.templateType = `tag:${r.tag}`);
		o.push(t);
	} else c(r);
	else if (r.nesting === -1) {
		let e = o.pop();
		e && (e.close = r, e._skip ? e.templateType === "container:thinking" && i ? i(e) : e.templateType === "container:progress" && a && a(e) : c(e));
	} else if (r.type === "inline" && r.children && r.children.length) {
		let e = P(r.children);
		c({
			...r,
			children: e
		});
	} else c(r);
	return s;
}
function I(e, t, n) {
	function r(e) {
		return e.trim().split(" ", 2)[0] === t;
	}
	function i(e, n, r, i, a) {
		return e[n].nesting === 1 && e[n].attrJoin("class", t), a.renderToken(e, n, r, i, a);
	}
	n ||= {};
	let a = n.marker || ":", o = a.charCodeAt(0), s = a.length, c = n.validate || r, l = n.render || i;
	function u(e, n, r, i) {
		let l, u = !1, d = e.bMarks[n] + e.tShift[n], f = e.eMarks[n];
		if (o !== e.src.charCodeAt(d)) return !1;
		for (l = d + 1; l <= f && a[(l - d) % s] === e.src[l]; l++);
		let p = Math.floor((l - d) / s);
		if (p < 3) return !1;
		l -= (l - d) % s;
		let m = e.src.slice(d, l), h = e.src.slice(l, f);
		if (!c(h, m)) return !1;
		if (i) return !0;
		let g = n;
		for (; g++, !(g >= r || (d = e.bMarks[g] + e.tShift[g], f = e.eMarks[g], d < f && e.sCount[g] < e.blkIndent));) if (o === e.src.charCodeAt(d) && !(e.sCount[g] - e.blkIndent >= 4)) {
			for (l = d + 1; l <= f && a[(l - d) % s] === e.src[l]; l++);
			if (!(Math.floor((l - d) / s) < p) && (l -= (l - d) % s, l = e.skipSpaces(l), !(l < f))) {
				u = !0;
				break;
			}
		}
		let _ = e.parentType, v = e.lineMax;
		e.parentType = "container", e.lineMax = g;
		let y = e.push("container_" + t + "_open", "div", 1);
		y.markup = m, y.block = !0, y.info = h, y.map = [n, g], e.md.block.tokenize(e, n + 1, g);
		let b = e.push("container_" + t + "_close", "div", -1);
		return b.markup = e.src.slice(d, l), b.block = !0, e.parentType = _, e.lineMax = v, e.line = g + (u ? 1 : 0), !0;
	}
	e.block.ruler.before("fence", "container_" + t, u, { alt: [
		"paragraph",
		"reference",
		"blockquote",
		"list"
	] }), e.renderer.rules["container_" + t + "_open"] = l, e.renderer.rules["container_" + t + "_close"] = l;
}
var L = { key: 2 }, R = { key: 3 }, z = { key: 4 }, B = [
	"alt",
	"src",
	"title"
], V = { key: 6 }, H = { key: 0 }, U = ["innerHTML"], W = ["innerHTML"], G = ["innerHTML"], K = /* @__PURE__ */ defineComponent({
	name: "Renderer",
	__name: "Renderer",
	props: { tree: {} },
	setup(t) {
		let o = inject("md"), l = o.options.breaks, u = inject("sanitizeHtml", (e) => e);
		function f(e) {
			return e.type === "group";
		}
		function h(e) {
			return e.templateType || e.type;
		}
		function _(e) {
			return console.warn("Unmatched token:", e), o.renderer.render([e], o.options, {});
		}
		function v(e) {
			return e.tag || "div";
		}
		function T(e, t) {
			if (!e.attrs) return "";
			let n = e.attrs.find(([e]) => e === t);
			return n ? n[1] : "";
		}
		function E(e) {
			let t = e.trim();
			return t.startsWith("<!--") && t.endsWith("-->");
		}
		return (o, d) => {
			let O = resolveComponent("Renderer", !0);
			return openBlock(!0), createElementBlock(Fragment, null, renderList(t.tree, (t) => renderSlot(o.$slots, h(t), {
				key: t._stableKey,
				node: t
			}, () => [f(t) ? (openBlock(), createBlock(resolveDynamicComponent(v(t)), mergeProps({
				key: 0,
				ref_for: !0
			}, unref(A)(t.open)), {
				default: withCtx(() => [createVNode(O, { tree: t.children }, null, 8, ["tree"])]),
				_: 2
			}, 1040)) : t.type === "text" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(t.content), 1)], 64)) : t.type === "hr" ? (openBlock(), createElementBlock("hr", L)) : t.type === "fence" || t.type === "code_block" ? (openBlock(), createElementBlock("pre", R, [createBaseVNode("code", { class: normalizeClass(`language-${t.info?.split(" ")[0] || ""}`) }, toDisplayString(t.content), 3)])) : t.type === "code_inline" ? (openBlock(), createElementBlock("code", z, toDisplayString(t.content), 1)) : t.type === "image" ? (openBlock(), createElementBlock("img", {
				key: 5,
				alt: t.content,
				src: T(t, "src"),
				title: T(t, "title")
			}, null, 8, B)) : t.type === "hardbreak" ? (openBlock(), createElementBlock("br", V)) : t.type === "softbreak" ? (openBlock(), createElementBlock(Fragment, { key: 7 }, [unref(l) ? (openBlock(), createElementBlock("br", H)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(" \xA0 ")], 64))], 64)) : t.type === "html_block" ? (openBlock(), createElementBlock(Fragment, { key: 8 }, [E(t.content) ? createCommentVNode("", !0) : (openBlock(), createElementBlock("div", {
				key: 0,
				innerHTML: unref(u)(t.content)
			}, null, 8, U))], 64)) : t.type === "html_inline" ? (openBlock(), createElementBlock("span", {
				key: 9,
				innerHTML: unref(u)(t.content)
			}, null, 8, W)) : t.type === "inline" ? (openBlock(), createBlock(O, {
				key: 10,
				tree: t.children
			}, null, 8, ["tree"])) : (openBlock(), createElementBlock("span", {
				key: 11,
				class: "fallback",
				style: { display: "contents" },
				innerHTML: _(t)
			}, null, 8, G))])), 128);
		};
	}
}), q = { class: "default-thinking" }, J = /* @__PURE__ */ defineComponent({
	name: "DefaultThinking",
	__name: "DefaultThinking",
	props: { node: {} },
	setup(e) {
		let t = e, n = ref([]), r = [];
		return watch(() => t.node, (e) => {
			r.includes(e._stableKey) || (n.value.push(e), r.push(e._stableKey));
		}), (e, t) => (openBlock(), createElementBlock("div", q, [t[1] ||= createBaseVNode("header", null, [createBaseVNode("div", { class: "icon" }), createBaseVNode("div", { class: "title" }, "已深度思考")], -1), createBaseVNode("main", null, [t[0] ||= createBaseVNode("div", { class: "main-icon" }, null, -1), createVNode(K, { tree: n.value }, null, 8, ["tree"])])]));
	}
}), Y = "data:image/webp;base64,UklGRuwCAABXRUJQVlA4WAoAAAAwAAAAHwAAHwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDhM/gAAAC8fwAcQz6CgbRvG6/hjGrJDQ0HbNlKqHYDxR3p/FLRtI/mG4CAdf0T/lSDbFu8Eb0wPumdO3sMwtL80YsDPTCn6fUscFUL02icvQQNEDADIkSQpkpaZuVx/Rffuuqb66B3Rf0Vu2zaBdelu7X4CAAAAAAAAAAAAAAAAAAAAAAAAYLx7HbuYPyJi29F6iIiI17jK5B7xRcsii1fDpcguOjknFNe/1Vi/TpNm/Zb74E0f008eCeleh69H2aU8J6lF7WGuKWnb6BkRERERbU2HbBrW5u1jn/aF155+OpluWFO6QqdW1SzNGk71LK7atg41bT3KolbO85BfAODf+t8A", X = "data:image/webp;base64,UklGRpgFAABXRUJQVlA4WAoAAAAwAAAAIwAAIwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDhMqgMAAC8jwAgQtwextm3Tzln7nPwf27adFJY2bdu27fTAoJEkRTW7T3LevzAmiG0jOZJYPfMm/2jddLeBtG1DqYHvd3gYWvdrsH34VOQgFalIxfDyw3xLRSpSkUQqUnF7+SKMTv+6jny45ocnFYGkK9UTrkB4zDU9PJlo2u4/dFscmjsc5XDHercE+o+zneqykOoQXLtqNnoMnh877FH+amxslc9ZriJs18jAfg2h5qnSkY7tGoIrgrBdQ/go8t7aVcYn8edq3pSFpyCY4oYUx3aNq1r2T6VfLUdZTXsvhJYrf9fsZQXSROCyFqh7zt9lOY6asje7ymp+kuAwcZcFHCawQEIcZjiA4AIrxHoP4TH03WczQ+t4KxOz/YBMUX3XEjABsEycZ0i45QIAYAILAInzDBdYEgDsZwghgAMEEPtpIRwhAtcZJgBIQftdgbss8MdmAoBfgIvdtAQQ4L8ECyCAAADYz/jtCX88BxkOE7JMAKw/hl/LaQYAJmQJr8EE5G/7f/rpkOK8bCzbtexaXjambNu27Zpt27Ztq/ONz8/pnLOK6D8Dt40UdRnuLgO6RwAAAAAAAAAAAAAAAAAAAACaU1r8Ax1/fUoWjdZk/TNFZVcn/AHRPyLGuYuMmZHt568Ope+qPvyxdzzybcJpJak2XxAU9oXFJRXW84BOx17GxN1POtBddNZIT7D5oVjXtwk0BY0deaGvopc+SPYN2K0sovWCjWCk+jfFxJzgsIjFLL/md+P2tL9hJn0Xvs8Vs0bjaEhYZNwyTx//m3v+7lRszX/oSHil34k3cQ88fXe1EyFZ9UM4J+ndZicTPJ4cVhJ7RjAXtKRD0Dnh4dNuYhh9BMV2OZHc53VIlGLBd0FHjpqPE4/cBoXNgIZnjZ7w86Th2iwoesvCGTZcFGK1ra22nDbU//ooMQrtH7YL5WjF85tjxCja2AiXG0k3pYsBga2lLs6R1nh/p73iHCMFuwtqUq3lM/9bgyRIjL5YnFGTaAf9HI9I0apeKbTcqS7G0XW/j/95ZUmrB34rsnq/UuNPiFZLEh/7BvSU4eH2Z8sra9K2rpk5a9GW2Hh370ttZUWzR0VVXb2JaU5+2N17rl6pSjIzwaD646eM7LzQ8GjnB4905WZLh9o04xmjx84eMSTeLUVJdkoZpmdu04TGa13ddeWnXUfjILPcgoho58RkpQbk5vSsnLywiFgXj6kNSuDBm17ciYrb2AsAAAAAAAAAAAAAAAAAAPjfP1IA", Z = "data:image/webp;base64,UklGRiQEAABXRUJQVlA4WAoAAAAwAAAAHwAAHwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDhMNgIAAC8fwAcQt+MgkiRFqlm4e0YL798YM/+WDYdtJCmSF+7umT//AJn5fxw3kqRI2bB06NL5b8w9l7sLUiNJkuSoW2bV3BT2tYHf2Vj25TXN7u+wXp/+m4+tt5V/LKjtL8zpd9gH3+ZTOp5uk/GtXR4Y0+VyGzoHz3TrBzlGuz/KENEnLKn0UejT89F8NnpzPle5y1siho7er1Y12pRCx3f7tlSR75qfuJBUdCQIBUkQqOS3xq9AJMhysWmuiywX+v0koz9Jxcawd4RuRn+SRRIK+dOIhZDsAQQWXvuXxAMMnVQif3UEshdZhz9I+oknYT8IAB5AJMtAJBYsIP0FQwIs/72wAgsA0D8AS4jEAqJt26Ybt6kds7ZtK2Zt23d9/+PNG80HRPRfgRtJyeB+AjwCAAAAAAAAAAAAAAAAAAAAAAAAAJgZspiGhJi2xr4Q4f9h8yUpo7SlxJxXIU7MKWt12c1JCX2cFmJIS3ZXyCZpngohktpCbWVxmzvUoAzL46NRhkpXR20+uz8MGEUoaqooMF+Hw+Gw1N/1DofTaTP6Wgipv8vn5hcWFxfrNBmm/v5+f3+++81p3lhbW1lertIJ0b+7vb09JWtU+7weT2NhnbN37jSKULPUk0eKf72fGWVYP8iMSlPi4/1pFegLAIPHuaws7ny+PUeB9ruLbmDiMJceNuf+7Smm88HNxZh2wORRbtec2dst9FyO6QQYiXRKN9dzrWA8Kl+uxq3Re33lt+idYFehfRQA", ne = {
	key: 0,
	class: "tasks-list"
}, re = ["src"], ie = { class: "task-content" }, Q = /* @__PURE__ */ defineComponent({
	name: "DefaultProgress",
	__name: "DefaultProgress",
	props: { node: {} },
	setup(t) {
		let n = t;
		function o(e) {
			let t = "";
			if (e.type === "text") t += e.content;
			else if (e.type === "fence" || e.type === "code_block") t += e.content;
			else if (e.children) for (let n of e.children) t += o(n);
			return t;
		}
		let s = ref([]);
		watch(() => n.node, (e) => {
			let t = o(e).replace(/,\s*\]\s*$/, "]").replace(/,\s*\}\s*$/, "}");
			t.startsWith("\"") && t.endsWith("\"") && (t = t.slice(1, -1));
			try {
				let e = JSON.parse(t);
				Array.isArray(e) && e.length >= s.value.length && (s.value = e);
			} catch {}
		}, { immediate: !0 });
		let c = (e) => {
			switch (e) {
				case "completed": return Y;
				case "in_progress": return Z;
				case "pending": return X;
				default: return X;
			}
		};
		return (t, n) => s.value.length ? (openBlock(), createElementBlock("div", ne, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.value, (e, t) => (openBlock(), createElementBlock("div", {
			key: t,
			class: "task-item"
		}, [createBaseVNode("img", {
			src: c(e.status),
			alt: "task status",
			class: "task-icon"
		}, null, 8, re), createBaseVNode("div", ie, toDisplayString(e.content), 1)]))), 128))])) : createCommentVNode("", !0);
	}
}), $ = /* @__PURE__ */ defineComponent({
	name: "WiMarkdown",
	__name: "index",
	props: {
		md: {
			type: Object,
			required: !0
		},
		source: {
			type: String,
			required: !0
		},
		tags: {
			type: Array,
			default: () => []
		},
		fences: {
			type: Array,
			default: () => []
		},
		containers: {
			type: Array,
			default: () => []
		},
		sanitize: {
			type: Function,
			default: null
		}
	},
	setup(n) {
		let a = n, s = useSlots(), { md: l, containers: d, sanitize: p } = a;
		provide("md", markRaw(l)), provide("sanitizeHtml", (e) => typeof p == "function" ? p(e) : e), Array.isArray(d) && d.length && [...new Set(d.concat(["progress", "thinking"]))].forEach((e) => {
			l.use(I, e);
		});
		let m = ref(), x = ref(), S = computed(() => F({
			tokens: a.md.parse(a.source, {}),
			tags: a.tags || [],
			fences: a.fences || [],
			onProgress: (e) => {
				x.value = e;
			},
			onThinking: (e) => {
				m.value = e;
			}
		}));
		return (t, n) => (openBlock(), createElementBlock(Fragment, null, [
			x.value ? renderSlot(t.$slots, "fixed-progress", {
				key: 0,
				node: x.value
			}, () => [createVNode(Q, { node: x.value }, null, 8, ["node"])]) : createCommentVNode("", !0),
			m.value ? renderSlot(t.$slots, "fixed-thinking", {
				key: 1,
				node: m.value
			}, () => [createVNode(J, { node: m.value }, null, 8, ["node"])]) : createCommentVNode("", !0),
			createVNode(K, { tree: S.value }, createSlots({ _: 2 }, [renderList(unref(s), (e, n) => ({
				name: n,
				fn: withCtx((e) => [renderSlot(t.$slots, n, normalizeProps(guardReactiveProps(e)))])
			}))]), 1032, ["tree"])
		], 64));
	}
}), ae = [$, K], oe = { install(e) {
	ae.forEach((t) => {
		let n = t.name || t.__name;
		n ? e.component(n, t) : console.warn("Component missing name:", t);
	});
} }, se = $, ce = K;
//#endregion
export { se as MarkdownVue3, ce as Renderer, oe as default };

//# sourceMappingURL=markdown-vue3.js.map