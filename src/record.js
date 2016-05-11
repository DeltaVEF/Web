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
	roomId;
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
		this.http.fetch("/rooms", {
			method: "post",
			body: json({
				//todo: api-key for login or something
			})
		}).then(
			response => {
				var responseObject = response.json();
				if (response.status != 200 || responseObject.error) {
					this.roomCreationFailed();
					return;
				}

				this.roomId = responseObject.data._id;
			},
			error => {
				this.roomCreationFailed();
			}
		);
	}

	attached() {
	}

	roomCreationFailed() {
		this.flashMessenger.addMessage("Could not create room!");
		this.navigation.navigate("home");
	}

	roomUpdateFailed() {
		this.flashMessenger.addMessage("Room update failed!");
	}

	roomNameChanged(roomName) {
		this.updateRoomDetails();
	}

	roomDescriptionChanged(roomDescription) {
		this.updateRoomDetails();
	}

	updateRoomDetails() {
		this.http.fetch("/rooms/" + this.roomId, {
			method: "put",
			body: json({
				//todo: api-key for login or something
				title: this.roomName,
				description: this.roomDescription,
			})
		}).then(
			response => {
				if (response.status != 200 || response.json().error) {
					this.roomUpdateFailed();
				}
			},
			error => {
				this.roomUpdateFailed();
			}
		);
	}

	startStop() {
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
