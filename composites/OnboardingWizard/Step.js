import React from "react";
import Components from "./components/StepComponents";

/**
 * Renders a step in the wizard process
 *
 * @param {Object} props The props used for rendering the steps.
 * @returns {JSX.Element} A Step component.
 * @constructor
 */
class Step extends React.Component {

	/**
	 * Sets the default state.
	 *
	 * @param {Object} props The properties to use.
	 */
	constructor( props ) {
		super();

		// Make the components available.
		this.components = Object.assign( Components, props.customComponents );

		this.state = {
			fieldValues: {},
		};
	}

	/**
	 * Sets the field values for the given step.
	 *
	 * @returns {void}
	 */
	componentWillMount() {
		this.setFieldValues( this.props.fields, this.props.currentStep );
	}

	/**
	 * Sets the field values for the following step.
	 *
	 * @param {Object} props The new properties the Step component receives.
	 *
	 * @returns {void}
	 */
	componentWillReceiveProps( props ) {
		if( props.currentStep !== this.props.currentStep ) {
			this.setFieldValues( props.fields, props.currentStep );
		}
	}

	/**
	 * Store the field values for the given step, when they aren't set yet.
	 *
	 * @param {Object} fields       The fields for the step.
	 * @param {string}  currentStep The name for the current step.
	 *
	 * @returns {void}
	 */
	setFieldValues( fields, currentStep ) {
		let fieldNames = Object.keys( fields );
		let fieldValues = this.state.fieldValues;

		if ( typeof fieldValues[ currentStep ] === "undefined" ) {
			fieldValues[ currentStep ] = {};
		}

		fieldNames.forEach(
			( fieldName ) => {
				if ( typeof fieldValues[ currentStep ][ fieldName ] === "undefined" ) {
					fieldValues[ currentStep ][ fieldName ] = fields[fieldName].data;
				}
			}
		);

		this.setState( {
			currentStep, fieldValues,
		} );
	}

	/**
	 * Runs the onchange event by update the value in the state.
	 *
	 * @param {Object} evt The event data.
	 *
	 * @returns {void}
	 */
	onChange( evt ) {
		let fieldValues = this.state.fieldValues;
		let fieldName = evt.target.name;

		// If the field value is undefined, add the fields to the field values.
		if ( typeof fieldValues[ this.state.currentStep ][ fieldName ] !== "undefined" ) {
			fieldValues[ this.state.currentStep ][ fieldName ] = evt.target.value;
		}

		this.setState( {
			fieldValues,
		} );
	}

	/**
	 * Renders a field for the current step.
	 *
	 * @param {Object} fields The form fields to be created.
	 *
	 * @returns {JSX.Element} The form component containing its form field components.
	 */
	getFieldComponents( fields ) {
		let keys = Object.keys( fields );

		return keys.map( ( name, key ) => {

			let currentField = fields[ name ];

			if ( typeof this.components[ currentField.componentName ] === "undefined"
			     || ! this.components[ currentField.componentName ] ) {
				console.error( `Trying to load non-existing component: ${currentField.componentName}` );
				return null;
			}

			/* The last Mailchimp signup does not have to be rendered,
			 * if it is completed in the first signup component.
			 */
			if ( currentField.componentName === "MailchimpSignup" && this.props.currentStep === "success" ) {
				if ( this.state.fieldValues[ "intro" ][ "mailchimpSignup" ] === true ) {
					return;
				}
			}

			let fieldProps = this.getFieldProps( currentField.componentName, key, name, currentField );

			return React.createElement( this.components[ currentField.componentName ], fieldProps );
		} );
	}

	/**
	 * @summary Get the value for the field.
	 *
	 * Gets the value for the field, if the value is already set in the state, this value is returned.
	 * If not the value from the config is set.
	 *
	 * @param {string} name The key name for the field.
	 * @param {object} field The field object.
	 * @returns {string} The field value
	 */
	getFieldValue( name, field ) {
		let storedFieldValue = this.state.fieldValues[ this.state.currentStep ][ name ];
		let configFieldValue = field.data;

		// The field values are only stored when the step is filled in by the user.
		if ( storedFieldValue !== "" ) {
			return storedFieldValue;
		}

		// Return the value from the settings if the user has not changed it yet.
		return configFieldValue;
	}

	/**
	 * Gets the properties for a specific field type.
	 *
	 * @param componentType The field component type, for example: Input or Choice.
	 * @param key The unique id key for this element.
	 * @param name The name for the field.
	 * @param {Object} currentField The current field with its settings.
	 *
	 * @returns {Object} The initialized properties for the element.
	 */
	getFieldProps( componentType, key, name, currentField ) {
		let props = {
			key,
			name,
			onChange: this.onChange.bind( this ),
			properties: currentField.properties,
			value: this.getFieldValue( name, currentField ),
		};

		if ( componentType === "Input" ) {
			let inputFieldProperties = {
				label: currentField.properties.label,
				"label-className": `${this.props.classPrefix}-text-input-label`,
				"input-className": `${this.props.classPrefix}-text-input-box`,
				optionalAttributes: {
					"class": `${this.props.classPrefix}-text-input`,
				}
			};

			Object.assign( props, inputFieldProperties )
		}

		if ( componentType === "Choice" ) {
			let choiceFieldProperties = {
				"className": `${this.props.classPrefix}-input-radio`,
				"optionClassName": `${this.props.classPrefix}-input-radio-option`,
			};

			Object.assign( props, choiceFieldProperties );
		}

		if ( componentType === "ConditionalInput" ) {
			let fieldValues = this.state.fieldValues;
			let requiredFieldValue = fieldValues[ this.props.currentStep ][ currentField.requires.field ];
			Object.assign( props, {
				requires: currentField.requires,
				requiredFieldValue,
				label: currentField.properties.label,
				"label-className": `${this.props.classPrefix}-text-input-label`,
				"input-className": `${this.props.classPrefix}-text-input-box`,
				optionalAttributes: {
					"class": `${this.props.classPrefix}-text-input`,
				}
			});
		}

		return props;
	}

	/**
	 * Renders the step.
	 *
	 * @returns {JSX.Element} Rendered Step component.
	 */
	render() {
		return (
			<div className={`${this.props.classPrefix}--step--container`}>
				<h1>{this.props.title}</h1>
				{ this.getFieldComponents( this.props.fields ) }
			</div>
		);
	}
}


Step.propTypes = {
	title: React.PropTypes.string.isRequired,
	fields: React.PropTypes.object,
	currentStep: React.PropTypes.string,
	classPrefix: React.PropTypes.string,
};

Step.defaultProps = {
	fields: {},
	currentStep: "",
	classPrefix: "yoast-wizard",
};

export default Step;
