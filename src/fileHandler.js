var utils = require('./utils')
var fs = require('fs')
var cli = require('./cli')
var readline = require('readline');
var stream = require('stream');

var dataObj = {};

var startTime, endTime = null;

exports.getDataFromFile = function (filePath) {
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
        shipInfoYearMonth: {},
        shipInfoYearMonthRegion: {},
        shipInfoYearMonthCountry: {},
        countryItemTypeMapping: {},
        ///////////////////////////////////////////
        // orderByRegion: {},
        // orderByRegionCountry: {},
        // orderByRegionCountryItemType: {},
        orderByItemType: {},
        priorityByMonth: {},
        // orderByMonthRegionCountry: {},
        allOrderDetail: {},
        regionCountryMapping: {}
    }

    // read input file data line by line
    rl.on('line', function (line) {
        lineCount += 1;

        // skip header line
        if (lineCount > 1) {
            const lineDataObj = utils.getDataFromLine(line);

            const { year, month } = utils.getYearAndMonth(lineDataObj.orderDate);

            // add the complete order data for query
// console.time('allOrderDetail[lineDataObj.orderId] ')            
            dataObj.allOrderDetail[lineDataObj.orderId] = lineDataObj;
// console.timeEnd('allOrderDetail[lineDataObj.orderId] ')            

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
            utils.addOrderRecordToByItemTypeDataset(lineDataObj.itemType, lineDataObj.orderId, dataObj);
            utils.addOrderRecordToByPriorityMonthDataset(year, month, lineDataObj.priority, lineDataObj.orderId, dataObj);
            utils.addOrderRecordToByMonthRegionDataset(year, month, lineDataObj.region, lineDataObj.country, lineDataObj.shipDays, dataObj);

        }
    });

    rl.on('close', function () {
        endTime = new Date();
        console.log('file read takes: ', (endTime - startTime) / 1000)
        console.log('cloes');

        // console.log(JSON.stringify(dataObj.shipInfoYearMonthRegion['2010']['10'], null, 4))
        // console.log(JSON.stringify(dataObj.shipInfoYearMonthCountry['2010']['10'], null, 4))
        // console.log(JSON.stringify(dataObj.shipInfoYearMonth, null, 4))


        cli.ask(dataObj);

        // return dataObj;

    });

}

exports.outputTaskResult = function (filePath, jsonData) {
    // console.time('writefile')
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4));
    // console.timeEnd('writefile')
}
