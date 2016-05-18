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
	restServer = "http://localhost:80";
	streamServer = "localhost:8080";
	videoStream;
	socket;

	//mediaDevices does not seem to be supported yet, at least in the chrome I use
	getUserMedia = navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia;


	constructor(http, router, flashMessenger) {
		http.configure(config => {
			config
				.useStandardConfiguration()
				.withBaseUrl(this.restServer);
		});

		this.http = http;
		this.navigation = router;
		this.flashMessenger = flashMessenger;
	}

	activate() {
		//verify browser compatibility
		if (!this.getUserMedia) {
			this.flashMessenger.addMessage("Your browser does not support video recording. Please consider updating it to the latest version.");
			this.navigation.navigate("home");
		}

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

				this.roomId = responseObject.data.id;
				this.roomCode = responseObject.data.code;
			},
			error => {
				this.roomCreationFailed();
			}
		);
	}

	attached() {
		//this will be the navigator in the call, so set parent to refer to this
		var parent = this;
		this.getUserMedia.call(navigator, {video: true, audio: true}, function(stream) {
			parent.videoStream = stream;
			parent.livePreview.src = window.URL.createObjectURL(stream);
		}, function(error) {
			this.flashMessenger.addMessage("Could not access the camera.");
			this.navigation.navigate("home");
		});
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
			var socket = new WebSocket("ws://" + this.streamServer + "/stream ofzoiets");

			var parent = this;
			socket.onopen = function(event) {
				parent.socket = socket;
				socket.send(window.URL.createObjectURL(parent.videoStream)); //start sending the stream? it's probably not THAT simple

				parent.startStopButton.classList.remove("start-recording", "btn-success");
				parent.startStopButton.classList.add("stop-recording", "btn-danger");
				parent.startStopButton.innerText = "Stop recording";
			};
			socket.onerror = function(event) {
				parent.flashMessenger.addMessage("Could not connect to stream server!");
			}
		}
		else {
			//stop recording
			if (this.socket) {
				this.socket.close();
				this.socket = null;
			}

			//post request goes here
			this.startStopButton.classList.remove("stop-recording", "btn-danger");
			this.startStopButton.classList.add("start-recording", "btn-success");
			this.startStopButton.innerText = "Start recording";
		}
	}
}
