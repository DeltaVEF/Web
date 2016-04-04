import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-fetch-client";
import "fetch";

@inject(HttpClient)
export class Record {
  constructor(http) {
		this.http = http;
  }

	activate() {
	}
}
