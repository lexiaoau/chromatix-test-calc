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
// console.time('getDataFromLine')    
let dataObj = {};

// console.time('splittext')    
    const dataArr = lineText.split(",");
// console.timeEnd('splittext')    

// console.time('assign')    

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
// console.timeEnd('assign')    



// console.timeEnd('getDataFromLine')    

    return dataObj;
};



const addTotalRevenueCostProfitToObject = function(  totalRevenue,
    totalCost,
    totalProfit , obj )
    {
        const totalRevenueFieldName = 'totalRevenue';
const totalCostFieldName = 'totalCost';
const totalProfitFieldName = 'totalProfit';
        if ( totalRevenueFieldName in obj ) {
            obj[  totalRevenueFieldName ] += totalRevenue ;
        }
        else {
            obj[ totalRevenueFieldName ] = totalRevenue ;
        }

        if ( totalCostFieldName in obj ) {
            obj[  totalCostFieldName ] += totalCost ;
        }
        else {
            obj[ totalCostFieldName ] = totalCost ;
        }

        if ( totalProfitFieldName in obj ) {
            obj[  totalProfitFieldName ] += totalProfit ;
        }
        else {
            obj[ totalProfitFieldName ] = totalProfit ;
        }
    }

exports.addOrderRecordToByRegionDataset = function(
    region,
    country,
    itemType,
    totalRevenue,
    totalCost,
    totalProfit,
    dataObj
) {
    if( !(region in dataObj.totalRegion) ) {
        dataObj.totalRegion[ region ] = {};
    }
    addTotalRevenueCostProfitToObject( totalRevenue,
        totalCost,
        totalProfit, dataObj.totalRegion[ region ] );

        if( !(country in dataObj.totalCountry) ) {
            dataObj.totalCountry[ country ] = {};
        }
        addTotalRevenueCostProfitToObject( totalRevenue,
            totalCost,
            totalProfit, dataObj.totalCountry[ country ] );

            if( country in dataObj.totalCountryItemType ) {
                if( !(itemType in dataObj.totalCountryItemType[ country ] )) {
                    dataObj.totalCountryItemType[ country ][ itemType ] = {};
                }
            }
            else {
                dataObj.totalCountryItemType[ country ] = {};
                dataObj.totalCountryItemType[ country ][ itemType ] = {};
            }
            addTotalRevenueCostProfitToObject( totalRevenue,
                totalCost,
                totalProfit, dataObj.totalCountryItemType[ country ][ itemType ]  );
    /////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////

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

const incrementShipInfoToObject = function(shipDays, obj) {
    if( 'shipDays' in obj ){
        obj['shipDays'] += shipDays ;
    }
    else{
        obj['shipDays'] = shipDays;
    }

    if( 'numberOfOrders' in obj ){
        obj['numberOfOrders'] += 1 ;
    }
    else{
        obj['numberOfOrders'] = 1;
    }
}

exports.addOrderRecordToByMonthRegionDataset = function( year , month, region, country, shipDays,  dataObj ) {
    //////  add data to shipInfoYearMonth
    /////
    /////
    //check for year
    if( year in dataObj.shipInfoYearMonth ) {
        //check for month
        if( !(month in dataObj.shipInfoYearMonth[ year ] )) {
            dataObj.shipInfoYearMonth[ year ][ month ] = {};
        }
    }
    else{
        dataObj.shipInfoYearMonth[ year ] = {};
        dataObj.shipInfoYearMonth[ year ][ month ] = {};
    }
    incrementShipInfoToObject(shipDays, dataObj.shipInfoYearMonth[ year ][ month ]);

    //////  add data to shipInfoYearMonthRegion
    /////
    /////
    //check for year
    if( year in dataObj.shipInfoYearMonthRegion ) {
        //check for month
        if( month in dataObj.shipInfoYearMonthRegion[ year ] ) {
            // check for region
            if( !( region in dataObj.shipInfoYearMonthRegion[ year ][ month ]) ) {
                dataObj.shipInfoYearMonthRegion[ year ][ month ][ region ] = {};
            }

        }
        else {
            dataObj.shipInfoYearMonthRegion[ year ][ month ] = {};
            dataObj.shipInfoYearMonthRegion[ year ][ month ][ region ] = {};
        }
    }
    else{
        dataObj.shipInfoYearMonthRegion[ year ] = {};
        dataObj.shipInfoYearMonthRegion[ year ][ month ] = {};
        dataObj.shipInfoYearMonthRegion[ year ][ month ][ region ] = {};
    }
    // try {
    incrementShipInfoToObject(shipDays, dataObj.shipInfoYearMonthRegion[ year ][ month ][ region ]);
        
    // } catch (err) {
    //     console.log('------------------------------------------------error')
    //     console.log(year , month, region, country)
    //     console.log(dataObj.shipInfoYearMonthRegion[ year ])
    //     console.log('------------------------------------------------error')

    // }


    //////  add data to shipInfoYearMonthCountry
    /////
    /////
    //check for year
    if( year in dataObj.shipInfoYearMonthCountry ) {
        //check for month
        if( month in dataObj.shipInfoYearMonthCountry[ year ] ) {
            // check for country
            if(  !(country in dataObj.shipInfoYearMonthCountry[ year ][ month ]) ) {
                dataObj.shipInfoYearMonthCountry[ year ][ month ][ country ] = {};
            }

        }
        else {
            dataObj.shipInfoYearMonthCountry[ year ][ month ] = {};
            dataObj.shipInfoYearMonthCountry[ year ][ month ][ country ] = {};
        }
    }
    else{
        dataObj.shipInfoYearMonthCountry[ year ] = {};
        dataObj.shipInfoYearMonthCountry[ year ][ month ] = {};
        dataObj.shipInfoYearMonthCountry[ year ][ month ][ country ] = {};
    }
    incrementShipInfoToObject(shipDays, dataObj.shipInfoYearMonthCountry[ year ][ month ][ country ]);

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

exports.getCountryListForRegion = function( region, dataObj) {
    const mapping = dataObj.regionCountryMapping;
    const countryObject = mapping[ region ];

    return Object.keys( countryObject );
}

exports.getItemTypeListForCountry = function( region, country, dataObj) {
    const mapping = dataObj.totalCountryItemType[ country ];

    return Object.keys( mapping );
}

exports.getTotalRevenueCostProfitForOrderList = function( list, dataObj) {
    const orderData = dataObj.allOrderDetail;

    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    for (let index = 0; index < list.length; index++) {
        const orderId = list[index];

        const thisOrderData = orderData[ orderId ];

        totalRevenue += thisOrderData.totalRevenue ;
        totalCost += thisOrderData.totalCost ;
        totalProfit += thisOrderData.totalProfit ;        
    }

    const resultObj = {
        totalRevenue: Math.round( totalRevenue * 100 ) / 100,
        totalCost: Math.round( totalCost * 100 ) / 100,
        totalProfit: Math.round( totalProfit * 100 ) / 100,
    }

    return resultObj ;

}

exports.getAvgShipDays = function( totalShipDays, orderCount) {
    return Math.round(  totalShipDays / orderCount );
}

exports.getTotalRevenueCostProfitForObj = function( obj) {
    obj.totalRevenue = Math.round( obj.totalRevenue * 100 ) /100 ;
    obj.totalProfit = Math.round( obj.totalProfit * 100 ) /100 ;
    obj.totalCost = Math.round( obj.totalCost * 100 ) /100 ;

    return obj;
}
