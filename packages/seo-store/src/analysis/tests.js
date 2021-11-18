import { act, renderHook } from "@testing-library/react-hooks";
import { dispatch } from "@wordpress/data";
import { curry, merge, set } from "lodash";
import registerSeoStore, { SEO_STORE_NAME } from "../index";
import { useAnalyze } from "./hooks";
import configReducer, { configActions, configSelectors } from "./slice/config";

describe( "Config slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		analysisType: "post",
		isSeoActive: true,
		isReadabilityActive: true,
		researches: [ "morphology" ],
	};

	describe( "Reducer", () => {
		test( "should return the initial state", () => {
			expect( configReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the analysis type", () => {
			const { updateAnalysisType } = configActions;

			const result = configReducer( previousState, updateAnalysisType( "term" ) );

			expect( result ).toEqual( {
				...initialState,
				analysisType: "term",
			} );
		} );

		test( "should update whether the SEO analysis is active", () => {
			const { updateIsSeoActive } = configActions;

			const result = configReducer( previousState, updateIsSeoActive( false ) );

			expect( result ).toEqual( {
				...initialState,
				isSeoActive: false,
			} );
		} );

		test( "should update whether the readability analysis is active", () => {
			const { updateIsReadabilityActive } = configActions;

			const result = configReducer( previousState, updateIsReadabilityActive( false ) );

			expect( result ).toEqual( {
				...initialState,
				isReadabilityActive: false,
			} );
		} );

		test( "should add a research", () => {
			const { addResearch } = configActions;

			const result = configReducer( previousState, addResearch( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				researches: [ "morphology", "test" ],
			} );
		} );

		test( "should remove a research", () => {
			const { removeResearch } = configActions;

			const result = configReducer( previousState, removeResearch( "morphology" ) );

			expect( result ).toEqual( {
				...initialState,
				researches: [],
			} );
		} );
	} );

	describe( "Selectors", () => {
		const createStoreState = curry( set )( {}, "analysis.config" );

		test( "should select the configuration", () => {
			const { selectAnalysisConfig } = configSelectors;

			const result = selectAnalysisConfig( createStoreState( initialState ) );

			expect( result ).toEqual( initialState );
		} );

		test( "should select the analysis type", () => {
			const { selectAnalysisType } = configSelectors;

			const state = { ...initialState, analysisType: "category" };
			const result = selectAnalysisType( createStoreState( state ) );

			expect( result ).toBe( "category" );
		} );

		test( "should select the is SEO active", () => {
			const { isSeoAnalysisActive } = configSelectors;

			const state = { ...initialState, isSeoActive: false };
			const result = isSeoAnalysisActive( createStoreState( state ) );

			expect( result ).toBe( false );
		} );

		test( "should select the is readability active", () => {
			const { isReadabilityAnalysisActive } = configSelectors;

			const state = { ...initialState, isReadabilityActive: false };
			const result = isReadabilityAnalysisActive( createStoreState( state ) );

			expect( result ).toBe( false );
		} );

		test( "should select the researches", () => {
			const { selectResearches } = configSelectors;

			const state = { ...initialState, researches: [ "morphology", "test" ] };
			const result = selectResearches( createStoreState( state ) );

			expect( result ).toEqual( [ "morphology", "test" ] );
		} );
	} );
} );

describe( "Hooks", () => {
	describe( "useAnalyze", () => {
		const paper = {
			content: "",
			seoTitle: "",
			metaDescription: "",
			slug: "",
			permalink: "",
			date: "",
		};
		const keyphrases = {
			focus: {
				id: "focus",
				keyphrase: "",
				synonyms: "",
			},
		};
		const config = {
			analysisType: "post",
			isSeoActive: true,
			isReadabilityActive: true,
			researches: [ "morphology" ],
		};

		let analyze;

		beforeEach( () => {
			analyze = jest.fn().mockReturnValue( {
				seo: {
					focus: {
						score: 0,
						results: [],
					},
				},
				readability: {
					score: 10,
					results: [],
				},
				research: {
					morphology: {},
				},
			} );
			registerSeoStore( { analyze } );

			renderHook( () => useAnalyze() );
		} );

		test( "should call analyze", () => {
			expect( analyze ).not.toHaveBeenCalled();

			// Fast-forward the debounce of analyze.
			jest.runAllTimers();

			expect( analyze ).toHaveBeenCalledWith( paper, keyphrases, config );
		} );

		test( "should call analyze when the SEO title changes", () => {
			act( () => {
				dispatch( SEO_STORE_NAME ).updateSeoTitle( "SEO title" );
			} );
			jest.runAllTimers();

			expect( analyze ).toHaveBeenCalledWith( { ...paper, seoTitle: "SEO title" }, keyphrases, config );
		} );

		test( "should call analyze when the content changes", () => {
			act( () => {
				dispatch( SEO_STORE_NAME ).updateContent( "Test content" );
			} );
			jest.runAllTimers();

			expect( analyze ).toHaveBeenCalledWith( { ...paper, content: "Test content" }, keyphrases, config );
		} );

		test( "should call analyze when the focus keyphrase changes", () => {
			act( () => {
				dispatch( SEO_STORE_NAME ).updateKeyphrase( { keyphrase: "Focus keyphrase" } );
			} );
			jest.runAllTimers();

			expect( analyze ).toHaveBeenCalledWith( paper, merge( {}, keyphrases, { focus: { keyphrase: "Focus keyphrase" } } ), config );
		} );

		test( "should call analyze when the analysis type changes", () => {
			act( () => {
				dispatch( SEO_STORE_NAME ).updateAnalysisType( "category" );
			} );
			jest.runAllTimers();

			expect( analyze ).toHaveBeenCalledWith( paper, keyphrases, { ...config, analysisType: "category" } );
		} );

		test( "should call analyze when the title changes", () => {
			act( () => {
				dispatch( SEO_STORE_NAME ).updateTitle( "Title" );
			} );
			jest.runAllTimers();

			// Note: no changes in the arguments because the title is not used in the analyze itself (by default).
			expect( analyze ).toHaveBeenCalledWith( paper, keyphrases, config );
		} );
	} );
} );