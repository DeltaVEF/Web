export class App {
  configureRouter(config, router) {
    config.title = 'VEF';
    config.map([
      { route: ['','record'], name: 'record', moduleId: './record', nav: true, title:'Record' }
    ]);

    this.router = router;
  }
}
