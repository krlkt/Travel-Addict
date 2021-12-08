
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { email: 'karelkarunia24@gmail.com', password: 'karel1' },
        { email: 'admin@ta', password: 'admin' },
      ]);
    });
};
