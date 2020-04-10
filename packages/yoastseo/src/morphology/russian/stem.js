/**
 * MIT License
 *
 * Copyright (c) 2016 Alexander Kiryukhin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * https://github.com/neonxp/Stemmer/blob/master/src/NXP/Stemmer.php
 */

const vowels = [ "а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я" ];
const regexPerfectiveGerunds1 = "(вши|вшись)$";
const regexPerfectiveGerunds2 = "(ив|ивши|ившись|ыв|ывши|авшись|ав|авши|авшись)$";
const regexAdjective = "(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$";
const regexParticiple = "(ивш|авш|ывш|увш|евш|ующ|ем|нн|вш|ющ|щ)";
const regexReflexives = "(ся|сь)$";
const regexVerb1 = "(ла|на|ете|([аеоую]?)йте|ли|уй|й|л|ем|н|ло|но|ет|ют|ны|(^ос)ть|ешь|нно)$";
const regexVerb2 = "(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|уют|ит|ыт|ены|ить|ыть|ишь|ую|(^ость)ю)$";
const regexNoun = "(а|ев|ов|в|ие|ье|е|ьё|иями|((ост)?)ями|ами|еи|ии|((ост)?)и|ией|((ост)?)ей|ой|ий|й|иям|((ост)?)ям|ием|ем|ам|ом|" +
	"о|у|ах|иях|((ост)?)ях|ы|((ост)?)ь|ию|((ост)?)ью|ю|ия|ья|я)$";
const regexSuperlative = "(ейш|ейше)$";
const regexI = "и$";
const regexSoftSign = "ь$";

/**
 * Checks if the input character is a Russian vowel.
 *
 * @param {string} char The character to be checked.
 *
 * @returns {boolean} Whether the input character is a Russian vowel.
 */
const isVowel = function( char ) {
	return vowels.includes( char );
};

/**
 * Determines the RV region of the word.
 *
 * @param {string} word	The word checked.
 *
 * @returns {int} The RV region index.
 */
const findRvRegion = function( word ) {
	let rv = 0;
	let state = 0;
	const wordLength = word.length;

	for ( let i = 1; i < wordLength; i++ ) {
		const prevChar = word.substring( i - 1, i );
		const char = word.substring( i, i + 1 );
		switch ( state ) {
			case 0:
				if ( isVowel( char ) ) {
					rv = i + 1;
					state = 1;
				}
				break;
			case 1:
				if ( isVowel( prevChar ) && isVowel( char ) ) {
					state = 2;
				}
				break;
			case 2:
				if ( isVowel( prevChar ) && isVowel( char ) ) {
					return rv;
				}
				break;
		}
	}

	return rv;
};

/**
 * Removes the endings from the word.
 *
 * @param {string}          word	The word to check.
 * @param {string|string[]} regex	The regex or a pair of regexes to match.
 * @param {int}             region	The word region
 *
 * @returns {string|null}	The word if the stemming rule could be applied or null otherwise.
 */
const removeEndings = function( word, regex, region ) {
	const prefix = word.substr( 0, region );
	const ending = word.substr( prefix.length );

	let currentRegex;

	if ( Array.isArray( regex ) ) {
		currentRegex = new RegExp( regex[ 0 ], "i" );

		if ( currentRegex.test( ending ) ) {
			word = prefix + ending.replace( currentRegex, "" );
			return word;
		}

		currentRegex = new RegExp( regex[ 1 ], "i" );
	} else {
		currentRegex = new RegExp( regex, "i" );
	}

	if ( currentRegex.test( ending ) ) {
		word = prefix + ending.replace( currentRegex, "" );
		return word;
	}

	return null;
};

/**
 * Removes inflectional suffixes from the word.
 *
 * @param {string} word	The word to check.
 * @param {int}    rv	The word rv region
 *
 * @returns {string}	The word after inflectional suffixes were removed.
 */
const removeInflectionalSuffixes = function( word, rv ) {
	// Try to find a PERFECTIVE GERUND ending. If it exists, remove it and finalize the step.
	const removeGerundSuffixes = removeEndings( word, [ regexPerfectiveGerunds1, regexPerfectiveGerunds2 ], rv );

	if ( removeGerundSuffixes ) {
		word = removeGerundSuffixes;
	} else {
		// If there is no PERFECTIVE GERUND ending then try removing a REFLEXIVE ending.
		const removeReflexiveSuffixes = removeEndings( word, regexReflexives, rv );

		if ( removeReflexiveSuffixes ) {
			word = removeReflexiveSuffixes;
		}
		// Try to remove following endings (in this order): ADJECTIVAL, VERB, NOUN. If one of them is found the step is finalized.
		const removeParticipleSuffixes = removeEndings( word, regexParticiple + regexAdjective, rv );
		const removeAdjectiveSuffixes = removeEndings( word, regexAdjective, rv );

		if ( removeParticipleSuffixes ) {
			word = removeParticipleSuffixes;
		} else if ( removeAdjectiveSuffixes ) {
			word = removeAdjectiveSuffixes;
		} else {
			const removeVerbalSuffixes = removeEndings( word, [ regexVerb1, regexVerb2 ], rv );
			if ( removeVerbalSuffixes ) {
				word = removeVerbalSuffixes;
			} else {
				const removeNounSuffixes = removeEndings( word, regexNoun, rv );
				if ( removeNounSuffixes ) {
					word = removeNounSuffixes;
				}
			}
		}
	}

	return word;
};

/**
 * Stems russian words.
 *
 * @param {string} word	The word to stem.
 *
 * @returns {string}	The stemmed word.
 */
export default function stem( word ) {
	const rv = findRvRegion( word );

	// Step 1: Remove inflectional suffixes if they are present in the word.
	word = removeInflectionalSuffixes( word, rv );

	// Step 2: If the word ends in "и", remove it.
	const removeIEnding = removeEndings( word, regexI, rv );
	if ( removeIEnding ) {
		word = removeIEnding;
	}

	// Step 3: There can be one of three options:
	// 1. If the word ends in нн, remove the last letter.
	if ( word.endsWith( "нн" ) ) {
		word = word.substr( 0, word.length - 1 );
	}

	// 2. If the word ends in a SUPERLATIVE ending, remove it and then again the last letter if the word ends in "нн".
	const removeSuperlativeSuffixes = removeEndings( word, regexSuperlative, rv );
	if ( removeSuperlativeSuffixes ) {
		word = removeSuperlativeSuffixes;
	}

	// 3. If the word ends in "ь", remove it.
	const removeSoftSignEnding = removeEndings( word, regexSoftSign, rv );
	if ( removeSoftSignEnding ) {
		word = removeSoftSignEnding;
	}

	return word;
}
