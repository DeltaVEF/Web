import "jquery";
import "bootstrap";

export class App {
  configureRouter(config, router) {
    config.title = "VEF";
    config.map([
			{ route: ["", "home"], name: "home", moduleId: "./home", nav: true, title: "Home" },
      { route: ["record"], name: "record", moduleId: "./record", nav: true, title: "Record" }
    ]);

    this.router = router;
  }
}
