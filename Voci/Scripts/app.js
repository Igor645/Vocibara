//genommen aus https://itmodul.ch/m294/
const routes = {
    home: {hash: "#home", function: renderHome}, 
    create: {hash: "#create", function: renderCreate},
    lists: {hash: "#lists", function: renderLists},
    study: {hash: "#study", function: renderStudy},
    edit: {hash: "#edit", function: renderEdit},
    error: {function: renderNotFound}
}

let router = new Router(routes);
router.urlResolve();