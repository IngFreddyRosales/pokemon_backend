function formatPokemon(p) {
    
  const types = [];
  if (p.type1) types.push({ id: p.type1Id, name: p.type1.name });
  if (p.type2) types.push({ id: p.type2Id, name: p.type2.name });

  return {
    id:     p.id,
    name:   p.name,
    image:  p.image,
    types,
    stats: {
      hp:            p.hp,
      attack:        p.attack,
      defense:       p.defense,
      specialAttack: p.specialAttack,
      specialDefense:p.specialDefense,
      speed:         p.speed
    },
    moves: p.Moves.map(m => ({
      id:       m.id,
      name:     m.name,
      category: m.category,
      power:    m.power
    }))
  };
}

module.exports = { formatPokemon };