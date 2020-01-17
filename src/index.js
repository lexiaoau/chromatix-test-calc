var fileHandler = require('./fileHandler')

const targetDataFilePath = './data/sample.csv' ;
const fileDataObj = fileHandler.getDataFromFile(  targetDataFilePath );

console.log(fileDataObj);






