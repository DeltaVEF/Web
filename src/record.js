import {inject} from "aurelia-framework";
import {HttpClient, json} from "aurelia-fetch-client";
import {Router} from "aurelia-router";
import {FlashMessenger} from "models/flash-messenger";
import "fetch";

@inject(HttpClient, Router, FlashMessenger)
export class Record {
	http;
	navigation;
	flashMessenger;

  constructor(http, router, flashMessenger) {
		http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl("https://sjoadfeoyor.com/");
    });

		this.http = http;
		this.navigation = router;
		this.flashMessenger = flashMessenger;
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
				this.flashMessenger.addMessage("Could not create room!");
				this.navigation.navigate("home");
			}
		);
	}

	attached() {
	}
}
