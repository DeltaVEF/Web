import {inject, bindable} from "aurelia-framework";
import {CssAnimator} from 'aurelia-animator-css';
import {EventAggregator} from "aurelia-event-aggregator";
import {FlashMessenger} from "models/flash-messenger";
import "bootstrap";

@inject(CssAnimator, EventAggregator, FlashMessenger)
export class App {
	eventAggregator;
	flashMessenger;
	@bindable errorMessage;

	constructor(animator, eventAggregator, flashMessenger) {
		this.animator = animator;
		this.eventAggregator = eventAggregator;
		this.flashMessenger = flashMessenger;
	}

  configureRouter(config, router) {
    config.title = "VEF";
    config.map([
			{ route: ["", "home"], name: "home", moduleId: "./home", nav: true, title: "Home" },
      { route: ["record"], name: "record", moduleId: "./record", nav: true, title: "Record" }
    ]);

    this.router = router;
  }

	attached() {
		//animate the error message
		this.eventAggregator.subscribe("Error Message", (message) => {
			this.errorMessage = message;
				this.animator.addClass(this.errorMessageContainer, 'fade-error-message').then(() => {
						setTimeout(() => this.animator.removeClass(this.errorMessageContainer, 'fade-error-message'), 3000);
				});
		});
	}
}
