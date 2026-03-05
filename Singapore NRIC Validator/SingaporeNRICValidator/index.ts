import { IInputs, IOutputs } from "./generated/ManifestTypes";

/**
 * Validates a Singapore NRIC/FIN number.
 *
 * Format: [S|T|F|G|M][7 digits][check letter]
 *   S – Singapore citizen born before 2000
 *   T – Singapore citizen born from 2000 onwards
 *   F – Foreigner/PR registered before 2000
 *   G – Foreigner/PR registered from 2000 onwards
 *   M – Foreigner registered from 2022 onwards
 *
 * Checksum algorithm:
 *   1. Multiply the 7 digits by weights [2, 7, 6, 5, 4, 3, 2] and sum.
 *   2. Add offset: T or G → +4; M → +3; S or F → +0.
 *   3. Remainder = sum % 11.
 *   4. S/T check letters: "JZIHGFEDCBA"
 *      F/G/M check letters: "XWUTRQPNMLK"
 */
function validateNRIC(nric: string): boolean {
	if (!nric || nric.length !== 9) {
		return false;
	}

	const upper = nric.toUpperCase();
	const prefix = upper[0];
	const suffix = upper[8];

	if (!/^[STFGM]$/.test(prefix)) {
		return false;
	}

	const digits = upper.substring(1, 8);
	if (!/^\d{7}$/.test(digits)) {
		return false;
	}

	const weights = [2, 7, 6, 5, 4, 3, 2];
	let sum = 0;
	for (let i = 0; i < 7; i++) {
		sum += parseInt(digits[i], 10) * weights[i];
	}

	if (prefix === "T" || prefix === "G") {
		sum += 4;
	} else if (prefix === "M") {
		sum += 3;
	}

	const remainder = sum % 11;

	const stCheckLetters = "JZIHGFEDCBA";
	const fgmCheckLetters = "XWUTRQPNMLK";

	let expectedSuffix: string;
	if (prefix === "S" || prefix === "T") {
		expectedSuffix = stCheckLetters[remainder];
	} else {
		expectedSuffix = fgmCheckLetters[remainder];
	}

	return suffix === expectedSuffix;
}

export class SingaporeNRICValidator implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private container: HTMLDivElement;
	private input: HTMLInputElement;
	private statusDiv: HTMLDivElement;
	private notifyOutputChanged: () => void;
	private currentValue: string;
	private currentIsValid: boolean;
	private boundOnInputChange: () => void;

	constructor() {
		// Empty
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(
		context: ComponentFramework.Context<IInputs>,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		container: HTMLDivElement
	): void {
		this.notifyOutputChanged = notifyOutputChanged;
		this.container = container;
		this.currentValue = context.parameters.nricNumber.raw ?? "";
		this.currentIsValid = validateNRIC(this.currentValue);
		this.boundOnInputChange = this.onInputChange.bind(this);

		this.container.classList.add("nric-validator-container");

		const label = document.createElement("label");
		label.className = "nric-label";
		label.textContent = "Singapore NRIC / FIN";
		label.setAttribute("for", "nricInput");

		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.id = "nricInput";
		this.input.className = "nric-input";
		this.input.placeholder = "e.g. S1234567D";
		this.input.maxLength = 9;
		this.input.value = this.currentValue;
		this.input.addEventListener("input", this.boundOnInputChange);

		this.statusDiv = document.createElement("div");
		this.statusDiv.className = "nric-status";

		this.container.appendChild(label);
		this.container.appendChild(this.input);
		this.container.appendChild(this.statusDiv);

		this.renderStatus();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		const newValue = context.parameters.nricNumber.raw ?? "";
		if (newValue !== this.currentValue) {
			this.currentValue = newValue;
			this.input.value = this.currentValue;
			this.currentIsValid = validateNRIC(this.currentValue);
			this.renderStatus();
		}
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
	 */
	public getOutputs(): IOutputs {
		return {
			nricNumber: this.currentValue,
			isValid: this.currentIsValid,
		};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		this.input.removeEventListener("input", this.boundOnInputChange);
	}

	private onInputChange(): void {
		this.currentValue = this.input.value;
		this.currentIsValid = validateNRIC(this.currentValue);
		this.renderStatus();
		this.notifyOutputChanged();
	}

	private renderStatus(): void {
		const value = this.currentValue.trim();
		if (!value) {
			this.statusDiv.textContent = "";
			this.statusDiv.className = "nric-status";
			this.input.classList.remove("nric-input--valid", "nric-input--invalid");
		} else if (this.currentIsValid) {
			this.statusDiv.textContent = "✓ Valid NRIC / FIN";
			this.statusDiv.className = "nric-status nric-status--valid";
			this.input.classList.add("nric-input--valid");
			this.input.classList.remove("nric-input--invalid");
		} else {
			this.statusDiv.textContent = "✗ Invalid NRIC / FIN";
			this.statusDiv.className = "nric-status nric-status--invalid";
			this.input.classList.add("nric-input--invalid");
			this.input.classList.remove("nric-input--valid");
		}
	}
}
