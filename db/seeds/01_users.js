
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { userName: 'Karel Karunia', email: 'karelkarunia24@gmail.com', password: 'karel1' },
        { userName: 'admin', email: 'admin@ta', password: 'admin' },
      ]);
    });
};
