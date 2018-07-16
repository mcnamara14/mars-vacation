
exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(function () {
      return knex('items').insert([
        {id: 1, name: 'Pet rock', packed: true},
        {id: 2, name: 'Canned tuna', packed: false},
        {id: 3, name: 'All the cats', packed: true}
      ])
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
    });
};
