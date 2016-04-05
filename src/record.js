import {inject} from "aurelia-framework";
import {HttpClient, json} from "aurelia-fetch-client";
import {Router} from "aurelia-router";
import "fetch";

@inject(HttpClient, Router)
export class Record {
  constructor(http, router) {
		http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl("https://sjoadfeoyor.com/");
    });

		this.http = http;
		this.navigation = router;
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
				this.error = "Could not create room!";
			}
		);
	}

	attached() {
		if (this.error) {
			this.showError(this.error);
		};

		this.navigation.navigate("home");
	}

	showError(message) {
		$(".error-message").text(message);
		$(".error-container").fadeIn(200).delay(5000).fadeOut(1000);
	}
}
