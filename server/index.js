import express from 'express';
import serverRenderer from './middleware/renderer';

import React from "react";
const PORT = 3000;
const path = require('path');
var compression = require('compression')
const app = express();

const router = express.Router();
router.use('^/$', serverRenderer);
router.use('/visualizar-expediente', serverRenderer);
router.use('/nuevo-expediente', serverRenderer);
router.use('/selector-expediente', serverRenderer);
router.use('/profile', serverRenderer);
router.use('/visualizar-expediente/:id/:idTrabajo?/:idEstructura?', serverRenderer);
router.use('/comunicacion/:id/:modificado?', serverRenderer);
router.use('/crear-trabajo/:id', serverRenderer);
router.use('/login', serverRenderer);
router.use(express.static(
  path.resolve(__dirname, '..', 'build'),
  { maxAge: 0 },
));
app.use(compression())
app.use(router);

app.listen(PORT, (error) => {
  if (error) {
    return console.log('something bad happened', error);
  }
  console.log("listening on " + PORT + "...");
});
