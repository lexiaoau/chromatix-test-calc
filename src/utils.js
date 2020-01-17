exports.getDaysDiff = function(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));

    return dayDiff;
};

const REGION_INDEX = 0;
const COUNTRY_INDEX = 1;
const ITEM_TYPE_INDEX = 2;
const SALE_CHANNEL_INDEX = 3;
const PRIORITY_INDEX = 4;
const ORDER_DATE_INDEX = 5;
const ORDER_ID_INDEX = 6;
const SHIP_DATE_INDEX = 7;
const UNITS_INDEX = 8;
const UNIT_PRICE_INDEX = 9;
const UNIT_COST_INDEX = 10;
const TOTAL_REVENUE_INDEX = 11;
const TOTAL_COST_INDEX = 12;
const TOTAL_PROFIT_INDEX = 13;

exports.getDataFromLine = function(lineText) {
    let dataObj = {};

    const dataArr = lineText.split(",");

    dataObj.region = dataArr[REGION_INDEX];
    dataObj.country = dataArr[COUNTRY_INDEX];
    dataObj.itemType = dataArr[ITEM_TYPE_INDEX];
    dataObj.channel = dataArr[SALE_CHANNEL_INDEX];
    dataObj.priority = dataArr[PRIORITY_INDEX];
    dataObj.orderDate = dataArr[ORDER_DATE_INDEX];
    dataObj.orderId = dataArr[ORDER_ID_INDEX];
    dataObj.shipDate = dataArr[SHIP_DATE_INDEX];
    dataObj.units = dataArr[UNITS_INDEX];
    dataObj.unitPrice = dataArr[UNIT_PRICE_INDEX];
    dataObj.unitCost = dataArr[UNIT_COST_INDEX];
    dataObj.totalRevenue = Number(dataArr[TOTAL_REVENUE_INDEX]);
    dataObj.totalCost = Number(dataArr[TOTAL_COST_INDEX]);
    dataObj.totalProfit = Number(dataArr[TOTAL_PROFIT_INDEX]);
    dataObj.shipDays = exports.getDaysDiff(dataObj.orderDate, dataObj.shipDate);

    return dataObj;
};

exports.addOrderRecordToByRegionDataset = function(
    region,
    country,
    itemType,
    orderId,
    dataObj
) {
    if (region in dataObj.orderByRegion) {
        dataObj.orderByRegion[region].push(orderId);
    } else {
        dataObj.orderByRegion[region] = [];
        dataObj.orderByRegion[region] .push( orderId );
    }

    // check if region exist
    if (region in dataObj.orderByRegionCountry) {
        // check if country exist
        if (country in dataObj.orderByRegionCountry[region]) {
            dataObj.orderByRegionCountry[region][country].push(orderId);
        } else {
            dataObj.orderByRegionCountry[region][country] = [orderId];
        }
    } else {
        dataObj.orderByRegionCountry[region] = {};
        dataObj.orderByRegionCountry[region][country] = [orderId];
    }

    // check if region exist
    if (region in dataObj.orderByRegionCountryItemType) {
        // check if country exist
        if (country in dataObj.orderByRegionCountryItemType[region]) {
            // check if item exist
            if (
                itemType in
                dataObj.orderByRegionCountryItemType[region][country]
            ) {
                dataObj.orderByRegionCountryItemType[region][country][
                    itemType
                ].push(orderId);
            } else {
                dataObj.orderByRegionCountryItemType[region][country][
                    itemType
                ] = [orderId];
            }
        } else {
            dataObj.orderByRegionCountryItemType[region][country] = {};
            dataObj.orderByRegionCountryItemType[region][country][itemType] = [
                orderId
            ];
        }
    } else {
        dataObj.orderByRegionCountryItemType[region] = {};
        dataObj.orderByRegionCountryItemType[region][country] = {};
        dataObj.orderByRegionCountryItemType[region][country][itemType] = [
            orderId
        ];
    }
}// end addOrderRecordToByRegionDataset

exports.addOrderRecordToByItemTypeDataset = function( itemType , orderId, dataObj ) {
    if( itemType in dataObj.orderByItemType ) {
        dataObj.orderByItemType[ itemType ].push( orderId );
    }
    else {
        dataObj.orderByItemType[ itemType ] = [ orderId ];
    }
}

exports.addOrderRecordToByPriorityMonthDataset = function( year , month, priority, orderId,  dataObj ) {
    //check for year
    if( year in dataObj.priorityByMonth ) {
        //check for month
        if( month in dataObj.priorityByMonth[ year ] ) {
            // check for priority
            if( priority in dataObj.priorityByMonth[ year ][ month ] ) {
                dataObj.priorityByMonth[ year ][ month ][ priority ].push( orderId );
            }
            else {
                dataObj.priorityByMonth[ year ][ month ][ priority ] = [ orderId ];
            }

        }
        else {
            dataObj.priorityByMonth[ year ][ month ] = {};
            dataObj.priorityByMonth[ year ][ month ][ priority ] = [ orderId ];
        }
    }
    else{
        dataObj.priorityByMonth[ year ] = {};
        dataObj.priorityByMonth[ year ][ month ] = {};
        dataObj.priorityByMonth[ year ][ month ][ priority ] = [ orderId ];
    }


}

exports.getYearAndMonth = function ( dateStr ) {
    let resultObj = {};

    const tempArr = dateStr.split('/');

    if( tempArr[0].length < 2 ) {
        resultObj.month = '0' + tempArr[0];
    }
    else {
        resultObj.month =tempArr[0];
    }
    resultObj.year = tempArr[2];

    return resultObj;
}
