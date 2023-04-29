import express from 'express';

const routes = express.Router();

routes.get('/ping', (req, res) => res.status(200).send(`Pong ${Date.now()}`));

export default routes;
