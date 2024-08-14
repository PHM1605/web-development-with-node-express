const express = require('express');
const {engine} = require("express-handlebars");
const credentials = require("./credentials");
const createTwitterClient = require("./lib/twitter");

const twitterClient = createTwitterClient(credentials.twitter);
const tweets = await twitterClient.seach('#Oregon #travel', 10);