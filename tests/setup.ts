// ABOUTME: Test setup file for DOM testing
// ABOUTME: Registers happy-dom globals for React testing

import { Window } from 'happy-dom';

const window = new Window({ url: 'https://localhost:8080/' });

// Register globals
Object.assign(globalThis, {
	window,
	document: window.document,
	navigator: window.navigator,
	HTMLElement: window.HTMLElement,
	Element: window.Element,
	Node: window.Node,
	Text: window.Text,
	DocumentFragment: window.DocumentFragment,
	Event: window.Event,
	CustomEvent: window.CustomEvent,
});
