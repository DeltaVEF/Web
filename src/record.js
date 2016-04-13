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
	startStopButton;

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
		//post request goes here
		console.log(this.roomName + " - " + this.roomDescription);
	}

	startStop() {
		console.log(this.startStopButton.__proto__);

		if (this.startStopButton.classList.contains("start-recording")) {
			//start recording
			//post request goes here
			this.startStopButton.classList.remove("start-recording", "btn-success");
			this.startStopButton.classList.add("stop-recording", "btn-danger");
			this.startStopButton.innerText = "Stop recording";
		}
		else {
			//stop recording
			//post request goes here
			this.startStopButton.classList.remove("stop-recording", "btn-danger");
			this.startStopButton.classList.add("start-recording", "btn-success");
			this.startStopButton.innerText = "Start recording";
		}
	}
}
