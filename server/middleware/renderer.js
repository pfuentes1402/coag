import React from 'react'
var express = require('express');
var router = express.Router();
const path = require("path");
const fs = require("fs");
export default async  function(req, res, next) {

    const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end()
        }

        return res.send(
            htmlData
        );
    });
}
