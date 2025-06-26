const dbconfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    dbconfig.DB,
    dbconfig.USER,
    dbconfig.PASSWORD,
    {
        host: dbconfig.HOST,
        port: dbconfig.PORT,
        dialect: 'mysql',
    }
);


sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const User = require('./user.js')(sequelize, Sequelize.DataTypes);
const AuthToken = require('./authToken.js')(sequelize, Sequelize.DataTypes);
const Item = require('./item.js')(sequelize, Sequelize.DataTypes);
const Team = require('./team.js')(sequelize, Sequelize.DataTypes);
const Nature = require('./nature.js')(sequelize, Sequelize.DataTypes);
const Stat = require('./stat.js')(sequelize, Sequelize.DataTypes);
const TeamPokemon = require('./teamPokemon.js')(sequelize, Sequelize.DataTypes);
const PokemonMove = require('./pokemonMove.js')(sequelize, Sequelize.DataTypes);
const Move = require('./move.js')(sequelize, Sequelize.DataTypes);
const Type = require('./type.js')(sequelize, Sequelize.DataTypes);
const Pokemon = require('./pokemon.js')(sequelize, Sequelize.DataTypes);
const Ability = require('./ability.js')(sequelize, Sequelize.DataTypes);
const SelectedPokemonMove = require('./selectedPokemonMove.js')(sequelize, Sequelize.DataTypes);

/** Usuario ↔ AuthToken **/
AuthToken.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(AuthToken, { foreignKey: 'user_id' });

/** Usuario ↔ Team **/
Team.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Team, { foreignKey: 'userId' });

/** Team ↔ TeamPokemon **/
TeamPokemon.belongsTo(Team, { foreignKey: 'teamId' });
Team.hasMany(TeamPokemon, { foreignKey: 'teamId' });

/** Pokemon “base” ↔ TeamPokemon **/
TeamPokemon.belongsTo(Pokemon, { foreignKey: 'pokemonId' });
Pokemon.hasMany(TeamPokemon, { foreignKey: 'pokemonId' });

/** Item ↔ TeamPokemon **/
TeamPokemon.belongsTo(Item, { foreignKey: 'itemId' });
Item.hasMany(TeamPokemon, { foreignKey: 'itemId' });

/** Ability ↔ TeamPokemon **/
TeamPokemon.belongsTo(Ability, { foreignKey: 'abilityId' });
Ability.hasMany(TeamPokemon, { foreignKey: 'abilityId' });

/** Nature ↔ TeamPokemon **/
TeamPokemon.belongsTo(Nature, { foreignKey: 'natureId' });
Nature.hasMany(TeamPokemon, { foreignKey: 'natureId' });

/** Type ↔ Pokemon (1er y 2º tipo) **/
Pokemon.belongsTo(Type, { as: 'type1', foreignKey: 'type1Id' });
Pokemon.belongsTo(Type, { as: 'type2', foreignKey: 'type2Id' });
Type.hasMany(Pokemon, { as: 'pokemonsAsType1', foreignKey: 'type1Id' });
Type.hasMany(Pokemon, { as: 'pokemonsAsType2', foreignKey: 'type2Id' });

/** Ability ↔ Pokemon base **/
Ability.belongsTo(Pokemon, { foreignKey: 'pokemonId' });
Pokemon.hasMany(Ability, { foreignKey: 'pokemonId' });

/** Move ↔ Type **/
Move.belongsTo(Type, { foreignKey: 'typeId' });
Type.hasMany(Move, { foreignKey: 'typeId' });

/** Pokemon base ↔ Move  (aprendizaje) **/
Pokemon.belongsToMany(Move, {
  through: PokemonMove,
  foreignKey: 'pokemonId',
  otherKey: 'moveId'
});
Move.belongsToMany(Pokemon, {
  through: PokemonMove,
  foreignKey: 'moveId',
  otherKey: 'pokemonId'
});

/** TeamPokemon ↔ Move  (movimientos elegidos) **/
TeamPokemon.belongsToMany(Move, {
  through: SelectedPokemonMove,
  foreignKey: 'teamPokemonId',
  otherKey: 'moveId'
});
Move.belongsToMany(TeamPokemon, {
  through: SelectedPokemonMove,
  foreignKey: 'moveId',
  otherKey: 'teamPokemonId'
});

/** Nature ↔ Stat (efectos) **/
Nature.belongsTo(Stat, {
  as: 'increasedStat',
  foreignKey: 'increasedStatId'
});
Stat.hasMany(Nature, {
  as: 'naturesIncreasing',
  foreignKey: 'increasedStatId'
});

Nature.belongsTo(Stat, {
  as: 'decreasedStat',
  foreignKey: 'decreasedStatId'
});
Stat.hasMany(Nature, {
  as: 'naturesDecreasing',
  foreignKey: 'decreasedStatId'
});

module.exports = {
  sequelize,
  User,
  AuthToken,
  Item,
  Type,
  Pokemon,
  Team,
  Ability,
  Move,
  Stat,
  Nature,
  TeamPokemon,
  PokemonMove,
  SelectedPokemonMove
};