import getWordForms from "../../../../../src/languageProcessing/languages/ja/customResearches/getWordForms";
import { Paper } from "../../../../../index";
import Researcher from "../../../../../src/languageProcessing/languages/ja/Researcher";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "ja" );

describe( "The getWordForms function", () => {
	it( "creates word forms based on the word forms found in the paper.", () => {
		const paper = new Paper(
			"休ま",
			{
				keyword: "休め",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ],
			synonymsForms: [],
		} );
	} );
	it( "creates word forms for an exact match keyphrase based on the word forms found in the paper.", () => {
		const paper = new Paper(
			"頑張ら",
			{
				keyword: "「頑張り」",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "頑張る", "頑張り", "頑張ら", "頑張れ", "頑張ろ", "頑張っ", "頑張れる", "頑張らせ", "頑張らせる", "頑張られ", "頑張られる", "頑張ろう" ] ],
			synonymsForms: [],
		} );
	} );
	it( "creates word forms for synonyms based on the word forms found in the paper.", () => {
		const paper = new Paper(
			"話せる及ん",
			{
				keyword: "話さ",
				synonyms: "休め, 及ぼ",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "話す", "話し", "話さ", "話せ", "話そ", "話せる", "話させ", "話させる", "話され", "話される", "話そう" ] ],
			synonymsForms: [
				[ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ],
				[ [ "及ぶ", "及び", "及ば", "及べ", "及ぼ", "及ん", "及べる", "及ばせ", "及ばせる", "及ばれ", "及ばれる", "及ぼう" ] ],
			],
		} );
	} );
	it( "creates word forms for exact matching synonyms based on the word forms found in the paper.", () => {
		const paper = new Paper(
			"話せる及ん",
			{
				keyword: "話さ",
				synonyms: "『休め』, 及ぼ",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "話す", "話し", "話さ", "話せ", "話そ", "話せる", "話させ", "話させる", "話され", "話される", "話そう" ] ],
			synonymsForms: [
				[ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ],
				[ [ "及ぶ", "及び", "及ば", "及べ", "及ぼ", "及ん", "及べる", "及ばせ", "及ばせる", "及ばれ", "及ばれる", "及ぼう" ] ],
			],
		} );
	} );
	it( "creates forms for keyphrases consisting of multiple words.", () => {
		const paper = new Paper(
			"犬です。",
			{
				/*
				 * 猫 - noun, no forms required
				 * が - function word, is deleted
				 * 遊んでいる - verb, forms are created
				 */
				keyword: "猫が遊んでいる",
				synonyms: "",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms:
				[ [ "猫" ],
					[ "遊ぬ", "遊に", "遊な", "遊ね", "遊の", "遊ん", "遊ねる", "遊なせ", "遊なせる",
						"遊なれ", "遊なれる", "遊のう", "遊む", "遊み", "遊ま", "遊め", "遊も",
						"遊める", "遊ませ", "遊ませる", "遊まれ", "遊まれる", "遊もう", "遊ぶ",
						"遊び", "遊ば", "遊べ", "遊ぼ", "遊べる", "遊ばせ", "遊ばせる",
						"遊ばれ", "遊ばれる", "遊ぼう" ] ],
			synonymsForms: [],
		} )
		;
	} );
	it( "creates forms for keyphrases consisting of multiple words separated by spaces.", () => {
		const paper = new Paper(
			"文章です。",
			{
				/*
				 * レシピ - noun, no forms required
				 * 美味しい - adjective, forms are created
				 */
				keyword: "レシピ　美味しい",
				synonyms: "",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms:
				[ [ "レシピ" ],
					[ "美味しう",
						"美味しい",
						"美味しわ",
						"美味しえ",
						"美味しお",
						"美味しっ",
						"美味しえる",
						"美味しわせ",
						"美味しわせる",
						"美味しわれ",
						"美味しわれる",
						"美味しおう",
						"美味しく",
						"美味しき",
						"美味しか",
						"美味しけ",
						"美味しこ",
						"美味しける",
						"美味しかせ",
						"美味しかせる",
						"美味しかれ",
						"美味しかれる",
						"美味しこう",
						"美味しかっ",
						"美味しぐ",
						"美味しぎ",
						"美味しが",
						"美味しげ",
						"美味しご",
						"美味しげる",
						"美味しがせ",
						"美味しがせる",
						"美味しがれ",
						"美味しがれる",
						"美味しごう" ] ],
			synonymsForms: [],
		} )
		;
	} );
} );
