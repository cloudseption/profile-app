// Entry point for register page
$(function () {
    var model = new Model(),
        view = new View(model);
        controller = new Controller(model, view);
        view.render();
});