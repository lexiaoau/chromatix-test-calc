var utils = require('./utils')
var fs = require('fs')
var cli = require('./cli')
var readline = require('readline');
var stream = require('stream');

var dataObj = {};

//// profilling code, can be deleted
var startTime, endTime = null;

exports.getDataFromFile = function (filePath) {

    //// profilling code, can be deleted
    startTime = new Date();

    let instream = fs.createReadStream(filePath);

    let outstream = new stream();
    let rl = readline.createInterface(instream, outstream);

    let lineCount = 0;

    // this data set will store all data from input file
    dataObj = {
        totalRegion : {},
        totalCountry : {},
        totalCountryItemType : {},
        totalItemType: {},
        shipInfoYearMonth: {},
        shipInfoYearMonthRegion: {},
        shipInfoYearMonthCountry: {},
        countryItemTypeMapping: {},
        priorityByMonth: {},
        regionCountryMapping: {}
    }

    // read input file data line by line
    rl.on('line', function (line) {
        lineCount += 1;

        // skip header line
        if (lineCount > 1) {
            const lineDataObj = utils.getDataFromLine(line);

            const { year, month } = utils.getYearAndMonth(lineDataObj.orderDate);       

            // add regin and country mapping relationship
            if (lineDataObj.region in dataObj.regionCountryMapping) {
                if (!(lineDataObj.country in dataObj.regionCountryMapping[lineDataObj.region])) {
                    dataObj.regionCountryMapping[lineDataObj.region][lineDataObj.country] = 1;
                }
            }
            else {
                dataObj.regionCountryMapping[lineDataObj.region] = {};
                dataObj.regionCountryMapping[lineDataObj.region][lineDataObj.country] = 1;
            }

            // add country and itemType mapping relationship
            if (lineDataObj.country in dataObj.countryItemTypeMapping) {
                if (!(lineDataObj.itemType in dataObj.countryItemTypeMapping[lineDataObj.country])) {
                    dataObj.countryItemTypeMapping[lineDataObj.country][lineDataObj.itemType] = 1;
                }
            }
            else {
                dataObj.countryItemTypeMapping[lineDataObj.country] = {};
                dataObj.countryItemTypeMapping[lineDataObj.country][lineDataObj.itemType] = 1;
            }

            // add order mapping for later processing
            utils.addOrderRecordToByRegionDataset(lineDataObj.region, lineDataObj.country, lineDataObj.itemType, 
                                                                                                  lineDataObj.totalRevenue, lineDataObj.totalCost, lineDataObj.totalProfit, dataObj);
            utils.addOrderRecordToByItemTypeDataset(lineDataObj.itemType, lineDataObj.totalRevenue, lineDataObj.totalCost, lineDataObj.totalProfit, dataObj);
            utils.addOrderRecordToByPriorityMonthDataset(year, month, lineDataObj.priority,  dataObj);
            utils.addOrderRecordToByMonthRegionDataset(year, month, lineDataObj.region, lineDataObj.country, lineDataObj.shipDays, dataObj);

        }
    });

    rl.on('close', function () {

        //// profilling code, can be deleted
        endTime = new Date();
        console.log('file read takes: ', (endTime - startTime) / 1000)

        cli.ask(dataObj);

    });

}

///// write json data to specified file
exports.outputTaskResult = function (filePath, jsonData) {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4));
}
