import {inject} from "aurelia-framework";
import {HttpClient, json} from "aurelia-fetch-client";
import "fetch";

@inject(HttpClient)
export class Record {
  constructor(http) {
		http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl("https://sjoadfeoyor.com/");
    });

		this.http = http;
  }

	activate() {
		this.http.fetch("room/create", {
			method: "post",
			body: json()
		}).then(
			response => {
				this.room = response.json();
			},
			error => {
				this.showError("Could not create room!");
			}
		);
	}

	attached() {
		showError("Error?");
	}

	showError(message) {
		$(".error-message").text(message);
		$(".error-container").fadeIn(500);
	}
}
