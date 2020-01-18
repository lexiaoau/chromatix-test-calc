var fileHandler = require('./fileHandler')

///// APP entry, call file handler to handle input data file
// const targetDataFilePath = './data/sample.csv';
const targetDataFilePath = './data/node-data-processing-medium-data.csv' ;
fileHandler.getDataFromFile(  targetDataFilePath );
