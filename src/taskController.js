var utils = require('./utils')

const task1TimeText = "Task 1 take: ";
const task2TimeText = "Task 2 take: ";
const task3TimeText = "Task 3 take: ";

const t1_loopregion = 't1_loopregion';
const t1_loopitem = 't1_loopitem';

exports.getTotalRevenueCostProfit = function (dataObj) {
    // console.time(task1TimeText)
    let resultObj = {};

    resultObj["Regions"] = {};
    const allRegionList = Object.keys(dataObj.regionCountryMapping);

    // console.time(t1_loopregion)
    for (let index = 0; index < allRegionList.length; index++) {
        const region = allRegionList[index];
        resultObj["Regions"][region] = {};

        let funcReturnObject = utils.getTotalRevenueCostProfitForObj(dataObj.totalRegion[region]);
        resultObj["Regions"][region]['Total'] = {
            'Revenue': funcReturnObject.totalRevenue,
            'Cost': funcReturnObject.totalCost,
            'Profit': funcReturnObject.totalProfit,
        }

        resultObj["Regions"][region]['Countries'] = {};

        const countryList = utils.getCountryListForRegion(region, dataObj);
        for (let index = 0; index < countryList.length; index++) {
            const countryName = countryList[index];
            funcReturnObject = utils.getTotalRevenueCostProfitForObj(dataObj.totalCountry[countryName]);
            resultObj["Regions"][region]['Countries'][countryName] = {
                "Total": {
                    'Revenue': funcReturnObject.totalRevenue,
                    'Cost': funcReturnObject.totalCost,
                    'Profit': funcReturnObject.totalProfit,
                }
            }

            resultObj["Regions"][region]['Countries'][countryName]['ItemTypes'] = {};
            const itemTypeList = utils.getItemTypeListForCountry(region, countryName, dataObj);
            for (let index = 0; index < itemTypeList.length; index++) {
                const itemType = itemTypeList[index];
                funcReturnObject = utils.getTotalRevenueCostProfitForObj(dataObj.totalCountryItemType[countryName][itemType]);
                resultObj["Regions"][region]['Countries'][countryName]['ItemTypes'][itemType] = {
                    'Revenue': funcReturnObject.totalRevenue,
                    'Cost': funcReturnObject.totalCost,
                    'Profit': funcReturnObject.totalProfit,
                };
            }
        }
    }
    // console.timeEnd(t1_loopregion)


    resultObj['ItemTypes'] = {};
    const itemTypeList = Object.keys(dataObj.orderByItemType);
    console.time(t1_loopitem)
    for (let index = 0; index < itemTypeList.length; index++) {
        const itemName = itemTypeList[index];
        const perItemTypeList = dataObj.orderByItemType[itemName];
        funcReturnObject = utils.getTotalRevenueCostProfitForOrderList(perItemTypeList, dataObj);
        resultObj['ItemTypes'][itemName] = {
            'Revenue': funcReturnObject.totalRevenue,
            'Cost': funcReturnObject.totalCost,
            'Profit': funcReturnObject.totalProfit,
        };
    }

    console.timeEnd(t1_loopitem)
    // console.timeEnd(task1TimeText)
    return resultObj;

}

exports.getPriority = function (dataObj) {
    console.time(task2TimeText)

    const data = dataObj.priorityByMonth;

    let resultObj = {};

    const allYears = Object.keys(data);
    for (let index = 0; index < allYears.length; index++) {
        const year = allYears[index];
        resultObj[year] = {};

        const allMonths = Object.keys(data[year]);
        for (let index = 0; index < allMonths.length; index++) {
            const month = allMonths[index];
            resultObj[year][month] = {};

            const allPriority = Object.keys(data[year][month]);
            for (let index = 0; index < allPriority.length; index++) {
                const pri = allPriority[index];
                resultObj[year][month][pri] = data[year][month][pri].length;
            }
        }
    }
    console.timeEnd(task2TimeText)

    return resultObj;
}

exports.getTask3 = function (dataObj) {
    console.time(task3TimeText)

    let resultObj = {};

    const textRegions = 'Regions';
    const textCountries = 'Countries';
    const textAvgDaysToShip = 'AvgDaysToShip';
    const textNumberOfOrders = 'NumberOfOrders';

    const allYears = Object.keys(dataObj.shipInfoYearMonth);
    for (let index = 0; index < allYears.length; index++) {
        const year = allYears[index];
        resultObj[year] = {};

        const allMonths = Object.keys(dataObj.shipInfoYearMonth[year]);
        for (let index = 0; index < allMonths.length; index++) {
            const month = allMonths[index];
            resultObj[year][month] = {};

            resultObj[year][month][textRegions] = {};
            const allRegions = Object.keys(dataObj.shipInfoYearMonthRegion[year][month]);

            for (let index = 0; index < allRegions.length; index++) {
                const thisRegion = allRegions[index];
                resultObj[year][month][textRegions][thisRegion] = {};

                resultObj[year][month][textRegions][thisRegion][textCountries] = {};

                const allCountry = utils.getCountryListForRegion(thisRegion, dataObj) ;
                for (let index = 0; index < allCountry.length; index++) {
                    const thisCountry = allCountry[index];

                    if (!(thisCountry in dataObj.shipInfoYearMonthCountry[year][month])) {
                        continue;
                    }

                    const shipDataObj = dataObj.shipInfoYearMonthCountry[year][month][thisCountry];
                    resultObj[year][month][textRegions][thisRegion][textCountries][thisCountry] = {
                        [textAvgDaysToShip]: Math.round(shipDataObj.shipDays / shipDataObj.numberOfOrders),
                        [textNumberOfOrders]: shipDataObj.numberOfOrders
                    }
                }

                const shipDataObj = dataObj.shipInfoYearMonthRegion[year][month][thisRegion];
                resultObj[year][month][textRegions][thisRegion][textAvgDaysToShip] = Math.round(shipDataObj.shipDays / shipDataObj.numberOfOrders);
                resultObj[year][month][textRegions][thisRegion][textNumberOfOrders] = shipDataObj.numberOfOrders;
            }

            const shipDataObj = dataObj.shipInfoYearMonth[year][month];
            resultObj[year][month][textAvgDaysToShip] = Math.round(shipDataObj.shipDays / shipDataObj.numberOfOrders);
            resultObj[year][month][textNumberOfOrders] = shipDataObj.numberOfOrders;
        }
    }
    console.timeEnd(task3TimeText)

    return resultObj;

}
