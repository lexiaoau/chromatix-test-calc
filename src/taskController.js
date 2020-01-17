var utils = require('./utils')

exports.getTotalRevenueCostProfit = function (dataObj) {
    let resultObj = {};
    console.log('getTotalRevenueCostProfit')

    resultObj["Regions"] = {};
    const allRegionList = Object.keys(dataObj.regionCountryMapping);

    for (let index = 0; index < allRegionList.length; index++) {
        const region = allRegionList[index];
        resultObj["Regions"][region] = {};

        const perRegionList = dataObj.orderByRegion[region];
        let funcReturnObject = utils.getTotalRevenueCostProfitForOrderList(perRegionList, dataObj);
        resultObj["Regions"][region]['Total'] = {
            'Revenue': funcReturnObject.totolRevenue,
            'Cost': funcReturnObject.totolCost,
            'Profit': funcReturnObject.totolProfit,
        }

        resultObj["Regions"][region]['Countries'] = {};

        const countryList = utils.getCountryListForRegion(region, dataObj);
        for (let index = 0; index < countryList.length; index++) {
            const countryName = countryList[index];
            const perRegionCountryList = dataObj.orderByRegionCountry[region][countryName];
            funcReturnObject = utils.getTotalRevenueCostProfitForOrderList(perRegionCountryList, dataObj);
            resultObj["Regions"][region]['Countries'][countryName] = {
                "Total": {
                    'Revenue': funcReturnObject.totolRevenue,
                    'Cost': funcReturnObject.totolCost,
                    'Profit': funcReturnObject.totolProfit,
                }
            }

            resultObj["Regions"][region]['Countries'][countryName]['ItemTypes'] = {};
            const itemTypeList = utils.getItemTypeListForCountry(region, countryName, dataObj);
            for (let index = 0; index < itemTypeList.length; index++) {
                const itemType = itemTypeList[index];
                const perRegionCountryItemTypeList = dataObj.orderByRegionCountryItemType[region][countryName][itemType];
                funcReturnObject = utils.getTotalRevenueCostProfitForOrderList(perRegionCountryItemTypeList, dataObj);
                resultObj["Regions"][region]['Countries'][countryName]['ItemTypes'][itemType] = {
                    'Revenue': funcReturnObject.totolRevenue,
                    'Cost': funcReturnObject.totolCost,
                    'Profit': funcReturnObject.totolProfit,
                };
            }
        }
    }

    resultObj['ItemTypes'] = {};
    const itemTypeList = Object.keys( dataObj.orderByItemType );
    for (let index = 0; index < itemTypeList.length; index++) {
        const itemName = itemTypeList[index];
        const perItemTypeList =  dataObj.orderByItemType[ itemName] ;
        funcReturnObject = utils.getTotalRevenueCostProfitForOrderList(perItemTypeList, dataObj);
        resultObj['ItemTypes'][ itemName ] = {
            'Revenue': funcReturnObject.totolRevenue,
            'Cost': funcReturnObject.totolCost,
            'Profit': funcReturnObject.totolProfit,
        };
        
    }
    // console.log(JSON.stringify(resultObj, null, 4))
    return resultObj ;

}

// exports.getTotalRevenueCostProfit = function (dataObj) {

// }
