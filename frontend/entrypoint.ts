import { provideRedirect } from "uix/html/entrypoint-providers.tsx"
/**
 * Frontend entrypoint:
 * This module provides a default export that defines the UI that is created on the frontend
 * when a page is visited
 */

export default {
	
	'/': import("../common/index.tsx"),

}