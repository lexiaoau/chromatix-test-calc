exports.getDaysDiff = function (startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));

    return dayDiff;
};

const REGION_INDEX = 0;
const COUNTRY_INDEX = 1;
const ITEM_TYPE_INDEX = 2;
// const SALE_CHANNEL_INDEX = 3;
const PRIORITY_INDEX = 4;
const ORDER_DATE_INDEX = 5;
// const ORDER_ID_INDEX = 6;
const SHIP_DATE_INDEX = 7;
// const UNITS_INDEX = 8;
// const UNIT_PRICE_INDEX = 9;
// const UNIT_COST_INDEX = 10;
const TOTAL_REVENUE_INDEX = 11;
const TOTAL_COST_INDEX = 12;
const TOTAL_PROFIT_INDEX = 13;

//// get all needed data field from line
exports.getDataFromLine = function (lineText) {
    let dataObj = {};

    const dataArr = lineText.split(",");

    dataObj.region = dataArr[REGION_INDEX];
    dataObj.country = dataArr[COUNTRY_INDEX];
    dataObj.itemType = dataArr[ITEM_TYPE_INDEX];
    // dataObj.channel = dataArr[SALE_CHANNEL_INDEX];
    dataObj.priority = dataArr[PRIORITY_INDEX];
    dataObj.orderDate = dataArr[ORDER_DATE_INDEX];
    // dataObj.orderId = dataArr[ORDER_ID_INDEX];
    dataObj.shipDate = dataArr[SHIP_DATE_INDEX];
    // dataObj.units = dataArr[UNITS_INDEX];
    // dataObj.unitPrice = dataArr[UNIT_PRICE_INDEX];
    // dataObj.unitCost = dataArr[UNIT_COST_INDEX];
    // dataObj.totalRevenue = Number(dataArr[TOTAL_REVENUE_INDEX]);
    dataObj.totalRevenue = Number(dataArr[TOTAL_REVENUE_INDEX]);
    dataObj.totalCost = Number(dataArr[TOTAL_COST_INDEX]);
    dataObj.totalProfit = Number(dataArr[TOTAL_PROFIT_INDEX]);
    dataObj.shipDays = exports.getDaysDiff(dataObj.orderDate, dataObj.shipDate);

    return dataObj;
};

//// save or add revenue info to data obj
const addTotalRevenueCostProfitToObject = function (totalRevenue,
    totalCost,
    totalProfit, obj) {
    const totalRevenueFieldName = 'totalRevenue';
    const totalCostFieldName = 'totalCost';
    const totalProfitFieldName = 'totalProfit';
    if (totalRevenueFieldName in obj) {
        obj[totalRevenueFieldName] += totalRevenue;
    }
    else {
        obj[totalRevenueFieldName] = totalRevenue;
    }

    if (totalCostFieldName in obj) {
        obj[totalCostFieldName] += totalCost;
    }
    else {
        obj[totalCostFieldName] = totalCost;
    }

    if (totalProfitFieldName in obj) {
        obj[totalProfitFieldName] += totalProfit;
    }
    else {
        obj[totalProfitFieldName] = totalProfit;
    }
}

//// store revenue data by region , country , itemType
exports.addOrderRecordToByRegionDataset = function (
    region,
    country,
    itemType,
    totalRevenue,
    totalCost,
    totalProfit,
    dataObj
) {
    if (!(region in dataObj.totalRegion)) {
        dataObj.totalRegion[region] = {};
    }
    addTotalRevenueCostProfitToObject(totalRevenue,
        totalCost,
        totalProfit, dataObj.totalRegion[region]);

    if (!(country in dataObj.totalCountry)) {
        dataObj.totalCountry[country] = {};
    }
    addTotalRevenueCostProfitToObject(totalRevenue,
        totalCost,
        totalProfit, dataObj.totalCountry[country]);

    if (country in dataObj.totalCountryItemType) {
        if (!(itemType in dataObj.totalCountryItemType[country])) {
            dataObj.totalCountryItemType[country][itemType] = {};
        }
    }
    else {
        dataObj.totalCountryItemType[country] = {};
        dataObj.totalCountryItemType[country][itemType] = {};
    }
    addTotalRevenueCostProfitToObject(totalRevenue,
        totalCost,
        totalProfit, dataObj.totalCountryItemType[country][itemType]);

}// end addOrderRecordToByRegionDataset

//// store revenue data by item type
exports.addOrderRecordToByItemTypeDataset = function (itemType, totalRevenue,
    totalCost,
    totalProfit, dataObj) {
    let dataSet = dataObj.totalItemType;

    if (itemType in dataSet) {
        let thisItemTypeData = dataSet[itemType];
        thisItemTypeData.totalRevenue += totalRevenue;
        thisItemTypeData.totalCost += totalCost;
        thisItemTypeData.totalProfit += totalProfit;
    }
    else {
        dataSet[itemType] = {};
        let thisItemTypeData = dataSet[itemType];
        thisItemTypeData.totalRevenue = totalRevenue;
        thisItemTypeData.totalCost = totalCost;
        thisItemTypeData.totalProfit = totalProfit;
    }
}

//// store priority data by year, month
exports.addOrderRecordToByPriorityMonthDataset = function (year, month, priority, dataObj) {
    //check for year
    if (year in dataObj.priorityByMonth) {
        //check for month
        if (month in dataObj.priorityByMonth[year]) {
            // check for priority
            if (priority in dataObj.priorityByMonth[year][month]) {
                dataObj.priorityByMonth[year][month][priority] += 1;
            }
            else {
                dataObj.priorityByMonth[year][month][priority] = 1;
            }
        }
        else {
            dataObj.priorityByMonth[year][month] = {};
            dataObj.priorityByMonth[year][month][priority] = 1;
        }
    }
    else {
        dataObj.priorityByMonth[year] = {};
        dataObj.priorityByMonth[year][month] = {};
        dataObj.priorityByMonth[year][month][priority] = 1;
    }
}

////  add shipDay to total, and incrment order counter
const incrementShipInfoToObject = function (shipDays, obj) {
    if ('shipDays' in obj) {
        obj['shipDays'] += shipDays;
    }
    else {
        obj['shipDays'] = shipDays;
    }

    if ('numberOfOrders' in obj) {
        obj['numberOfOrders'] += 1;
    }
    else {
        obj['numberOfOrders'] = 1;
    }
}

//// save order ship days data by year, month, region , country
exports.addOrderRecordToByMonthRegionDataset = function (year, month, region, country, shipDays, dataObj) {
    //////  add data to shipInfoYearMonth
    /////
    /////
    //check for year
    if (year in dataObj.shipInfoYearMonth) {
        //check for month
        if (!(month in dataObj.shipInfoYearMonth[year])) {
            dataObj.shipInfoYearMonth[year][month] = {};
        }
    }
    else {
        dataObj.shipInfoYearMonth[year] = {};
        dataObj.shipInfoYearMonth[year][month] = {};
    }
    incrementShipInfoToObject(shipDays, dataObj.shipInfoYearMonth[year][month]);

    //////  add data to shipInfoYearMonthRegion
    /////
    /////
    //check for year
    if (year in dataObj.shipInfoYearMonthRegion) {
        //check for month
        if (month in dataObj.shipInfoYearMonthRegion[year]) {
            // check for region
            if (!(region in dataObj.shipInfoYearMonthRegion[year][month])) {
                dataObj.shipInfoYearMonthRegion[year][month][region] = {};
            }
        }
        else {
            dataObj.shipInfoYearMonthRegion[year][month] = {};
            dataObj.shipInfoYearMonthRegion[year][month][region] = {};
        }
    }
    else {
        dataObj.shipInfoYearMonthRegion[year] = {};
        dataObj.shipInfoYearMonthRegion[year][month] = {};
        dataObj.shipInfoYearMonthRegion[year][month][region] = {};
    }
    incrementShipInfoToObject(shipDays, dataObj.shipInfoYearMonthRegion[year][month][region]);

    //////  add data to shipInfoYearMonthCountry
    /////
    /////
    //check for year
    if (year in dataObj.shipInfoYearMonthCountry) {
        //check for month
        if (month in dataObj.shipInfoYearMonthCountry[year]) {
            // check for country
            if (!(country in dataObj.shipInfoYearMonthCountry[year][month])) {
                dataObj.shipInfoYearMonthCountry[year][month][country] = {};
            }
        }
        else {
            dataObj.shipInfoYearMonthCountry[year][month] = {};
            dataObj.shipInfoYearMonthCountry[year][month][country] = {};
        }
    }
    else {
        dataObj.shipInfoYearMonthCountry[year] = {};
        dataObj.shipInfoYearMonthCountry[year][month] = {};
        dataObj.shipInfoYearMonthCountry[year][month][country] = {};
    }
    incrementShipInfoToObject(shipDays, dataObj.shipInfoYearMonthCountry[year][month][country]);
}

///// get year and month value from line, year is 4 digits as '2016', month is 2 digits as '02'
//// input date format is 5/23/2016
exports.getYearAndMonth = function (dateStr) {
    let resultObj = {};

    const tempArr = dateStr.split('/');

    resultObj.month = tempArr[0].length < 2 ? '0' + tempArr[0] : tempArr[0];
    resultObj.year = tempArr[2];

    return resultObj;
}

exports.getCountryListForRegion = function (region, dataObj) {
    const mapping = dataObj.regionCountryMapping;
    const countryObject = mapping[region];

    return Object.keys(countryObject);
}

exports.getItemTypeListForCountry = function (region, country, dataObj) {
    const mapping = dataObj.totalCountryItemType[country];

    return Object.keys(mapping);
}

//// convert value by rouning, keep 2 digits for precision
exports.getTotalRevenueCostProfitForObj = function (obj) {
    obj.totalRevenue = Math.round(obj.totalRevenue * 100) / 100;
    obj.totalProfit = Math.round(obj.totalProfit * 100) / 100;
    obj.totalCost = Math.round(obj.totalCost * 100) / 100;

    return obj;
}
