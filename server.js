const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Final Test';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/v1/items/:id', (request, response) => {
  database('items').where('id', request.params.id).select()
    .then(item => {
      if (item.length) {
        response.status(200).json(item);
      } else {
        response.status(404).json({
          error: `Could not find any items with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(404).json({error});
    });
});

app.post('/api/v1/items', (request, response) => {
	const { name } = request.body;
	const item = { name, packed: false };

	for (let requiredParameter of ['name']) {
		if (!request.body[requiredParameter]) {
		return response
				.status(422)
				.send({error: 'Expected name to be passed into the body'});
		}
	}

  database('items').insert(item, 'id')
    .then(item => {
      response.status(201).json({ id: item[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;