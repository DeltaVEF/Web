import {bindable, inject} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class FlashMessenger {
	message;

	constructor(eventAggregator) {
		this.eventAggregator = eventAggregator
	}

	addMessage(message) {
		this.eventAggregator.publish('Error Message', this.message = message);
	}

	getMessage() {
		return this.message;
	}
}
