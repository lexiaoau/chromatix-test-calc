var utils = require('./utils')

var dataObj = {};

exports.getDataFromFile =  function ( filePath )  {
    let fs = require('fs');
    let readline = require('readline');
    let stream = require('stream');
    // let now = require('performance-now');
    
    // let instream = fs.createReadStream('test.txt');
    let instream = fs.createReadStream(  filePath );
    
    let outstream = new stream();
    let rl = readline.createInterface(instream, outstream);

    let lineCount = 0;
    let lineObj={};

    dataObj = {
        orderByRegion : {}, 
        orderByRegionCountry : {}, 
        orderByRegionCountryItemType : {}, 
        orderByItemType : {}, 
        priorityByMonth : {}, 
        orderByMonth : {}, 
        orderByMonthRegion : {}, 
        orderByMonthRegionCountry : {}, 
        allOrderDetail : {},
        regionCountryMapping: {}
    }

    rl.on('line', function(line) {
        lineCount += 1;

        if( lineCount > 1 ) {
            const lineDataObj = utils.getDataFromLine( line );

            const { year, month } = utils.getYearAndMonth(  lineDataObj.orderDate );

            // add the complete order data for query
            dataObj.allOrderDetail[ lineDataObj.orderId ] = lineDataObj ;

            // add regin and country mapping relationship
            if( lineDataObj.region in  dataObj.regionCountryMapping ) {
                if( !(lineDataObj.country in  dataObj.regionCountryMapping[ lineDataObj.region ]) ) { 
                    dataObj.regionCountryMapping[ lineDataObj.region ][ lineDataObj.country ] = 1;
                }
            }
            else {
                dataObj.regionCountryMapping[ lineDataObj.region ] = {};
                dataObj.regionCountryMapping[ lineDataObj.region ][ lineDataObj.country ] = 1;
            }

            utils.addOrderRecordToByRegionDataset( lineDataObj.region, lineDataObj.country, lineDataObj.itemType, lineDataObj.orderId, dataObj  );
            utils.addOrderRecordToByItemTypeDataset( lineDataObj.itemType, lineDataObj.orderId, dataObj );
            utils.addOrderRecordToByPriorityMonthDataset(  year,  month, lineDataObj.priority, lineDataObj.orderId, dataObj   );


            // console.log(lineDataObj);
            lineObj[String(lineCount)] = line ;
        }
    });

    rl.on('close', function() {
        console.log('cloes');
        // console.log('-----------------------------------------------------------------');
        // console.log(dataObj)
        const printTarget = dataObj.orderByRegionCountryItemType;
        // console.log(JSON.stringify(printTarget, null , 4));

        return dataObj;

    });

}
