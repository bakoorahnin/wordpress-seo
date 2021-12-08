import {
	getContent,
	getDate,
	getExcerpt,
	getFocusKeyphrase,
	getMetaDescription,
	getPermalink,
	getSeoTitle,
	getSlug, getSnippetImage,
	getTitle,
	isCornerstone,
} from "../dom";
import { FOCUS_KEYPHRASE_ID } from "@yoast/seo-store";

/**
 * Gather the initial state of the classic editor.
 *
 * @returns {Object} The initial state of the classic editor.
 */
const getEditorInitialState = () => ( {
	title: getTitle(),
	date: getDate(),
	permalink: getPermalink(),
	excerpt: getExcerpt(),
	content: getContent(),
	featuredImage: getSnippetImage(),
} );

/**
 * Gathers the initial state of the metabox of the classic editor.
 *
 * @returns {Object} The initial state of the metabox of the classic editor.
 */
const getFormInitialState = () => ( {
	seo: {
		title: getSeoTitle(),
		description: getMetaDescription(),
		slug: getSlug(),
		isCornerstone: isCornerstone(),
	},
	keyphrases: {
		[ FOCUS_KEYPHRASE_ID ]: {
			id: FOCUS_KEYPHRASE_ID,
			keyphrase: getFocusKeyphrase(),
		},
	},
} );

/**
 * Gathers the initial state of the SEO store.
 *
 * @returns {Object} The initial state.
 */
export const getInitialState = () => ( {
	editor: getEditorInitialState(),
	form: getFormInitialState(),
} );