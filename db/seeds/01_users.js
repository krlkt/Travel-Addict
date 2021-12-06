
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { name: 'Karel Karunia', email: 'karelkarunia24@gmail.com', password: 'karel1' },
        { name: 'admin', email: 'admin@ta', password: 'admin' },
      ]);
    });
};
