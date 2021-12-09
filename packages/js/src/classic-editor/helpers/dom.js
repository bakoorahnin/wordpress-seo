import { get, set } from "lodash";

import { tmceId, getContentTinyMce } from "../lib/tinymce";

export const DOM_IDS = {
	// WP classic editor ids
	TITLE: "title",
	CONTENT: tmceId,
	EXCERPT: "excerpt",
	PERMALINK: "permalink",
	DATE: "date",
	// Yoast hidden input ids
	SEO_TITLE: "yoast_wpseo_title",
	META_DESCRIPTION: "yoast_wpseo_metadesc",
};

/**
 * Help create a prop getter for a DOM element.
 *
 * @param {string} id The id of the DOM element.
 * @param {string} prop The prop to get.
 * @param {*} defaultValue The default value to return if the prop doesn't exist.
 * @returns {void}
 */
export const createGetDomElementProp = ( id, prop, defaultValue = "" ) => () => get( document.getElementById( id ), prop, defaultValue );

/**
 * Help create a prop setter for a DOM element.
 *
 * @param {string} id The id of the DOM element.
 * @param {string} prop The prop to set.
 * @returns {Function} A function that receives a value to set.
 */
export const createSetDomElementProp = ( id, prop ) => ( value ) => set( document.getElementById( id ), prop, value );

/**
 * Get the title from the DOM.
 *
 * @returns {string} The title or an empty string.
 */
export const getTitle = createGetDomElementProp( DOM_IDS.TITLE, "value", "" );

/**
 * Get the content from the DOM.
 *
 * @returns {string} The content or an empty string.
 */
export const getContent = () => getContentTinyMce( DOM_IDS.CONTENT );

/**
 * Get the excerpt from the DOM.
 *
 * @returns {string} The excerpt or an empty string.
 */
export const getExcerpt = createGetDomElementProp( DOM_IDS.EXCERPT, "value", "" );

/**
 * Get the permalink from the DOM.
 *
 * @returns {string} The permalink or an empty string.
 */
export const getPermalink = createGetDomElementProp( DOM_IDS.PERMALINK, "value", "" );

/**
 * Get the date from the DOM.
 *
 * @returns {string} The date or an empty string.
 */
export const getDate = createGetDomElementProp( DOM_IDS.DATE, "value", "" );

/**
 * Get the SEO title from the DOM.
 *
 * @returns {string} The SEO title or an empty string.
 */
export const getSeoTitle = createGetDomElementProp( DOM_IDS.SEO_TITLE, "value", "" );

/**
 * Get the meta description from the DOM.
 *
 * @returns {string} The meta description or an empty string.
 */
export const getMetaDescription = createGetDomElementProp( DOM_IDS.META_DESCRIPTION, "value", "" );

/**
 * Set the SEO title value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setSeoTitle = createSetDomElementProp( DOM_IDS.SEO_TITLE, "value" );

/**
 * Set the meta description value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setMetaDescription = createSetDomElementProp( DOM_IDS.META_DESCRIPTION, "value" );
