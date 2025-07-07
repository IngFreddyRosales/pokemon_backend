module.exports = (app) => {
    require("./auth.routes")(app);
    require("./user.route")(app);
    require("./type.route")(app);
    require("./move.route")(app);
    require("./item.route")(app);
    require("./pokemon.route")(app);
    require("./ability.route")(app);
    require("./stat.route")(app);
    require("./nature.route")(app);
    require("./team.route")(app);
    require("./teamPokemon.route")(app);
}   