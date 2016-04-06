import {inject, bindable} from "aurelia-framework";
import {HttpClient, json} from "aurelia-fetch-client";
import {Router} from "aurelia-router";
import {FlashMessenger} from "models/flash-messenger";
import "fetch";

@inject(HttpClient, Router, FlashMessenger)
export class Record {
	http;
	navigation;
	flashMessenger;
	@bindable roomName;
	@bindable roomDescription;
	roomCode;

  constructor(http, router, flashMessenger) {
		http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl("");
    });

		this.http = http;
		this.navigation = router;
		this.flashMessenger = flashMessenger;
  }

	activate() {
		this.http.fetch("room/create", {
			method: "post",
			body: json() //api-key for login
		}).then(
			response => {
				this.room = response.json();
				console.log(this.room)

			},
			error => {
				this.flashMessenger.addMessage("Could not create room!");
				this.roomCode = "OSDJFOIJSDFOI";

				//todo: enable this when api works
				//this.navigation.navigate("home");
			}
		);
	}

	attached() {
	}

	roomNameChanged(roomName) {
		this.updateRoomDetails();
	}

	roomDescriptionChanged(roomDescription) {
		this.updateRoomDetails();
	}

	updateRoomDetails() {
		console.log(this.roomName + " - " + this.roomDescription);
	}
}
