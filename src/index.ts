import "./reset.css";
import "./index.css";

import "preact/debug";

import {createElement, render} from "preact";

import {Root} from "@/component/app";

(async function main() {
    const vdom = createElement(Root, {});
    render(vdom, document.body);
})();
