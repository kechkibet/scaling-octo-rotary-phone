const rowData = ["1001", "1002"] // in

const columnData = {
    "maxFailuresColumns": 5,
    "maxDefectsColumns": 14,
    "maxPartsColumns": 26,
    "precedingColumns": 6,
    "trailingColumn": 1
} // in

async function  apiResolver(repairId, columnId){
    //write data to get from server


}
async function mapperDDD(rowData, columnData) {
    let dataArray = [] //out

    async function resolveData(key, columnId) {//resolver
        //contact server
        let serverResp = `Data for field ${key}`
        await apiResolver(key, columnId)
        if(!serverResp)
            return;
        let e = dataArray.findIndex(value => value.id === key)
        if (e !== -1) {//found
            dataArray[e][`${columnId}`] = serverResp
        } else {
            let pushed = {id: key}
            pushed[`${columnId}`] = serverResp
            dataArray.push(pushed)
        }
    }

    async function resolveAllData(cd, rd) {
        let promises = []
        rd.forEach((r)=>{
            cd.forEach((c)=>{
                promises.push(c.fn(r))
            })
        })
        await Promise.allSettled(promises)
    }

    function columnDataToColumnArray(cd) {
        let finalColumns = []
        Array.prototype.push.apply(finalColumns, [...Array(columnData.maxFailuresColumns).keys()].map(e => ({
            title: `Failure ${e + 1}`,
            data: `F${e}`,
            fn: (row) => resolveData(row, `F${e}`)
        })))
        Array.prototype.push.apply(finalColumns, [...Array(columnData.maxDefectsColumns).keys()].map(e => ({
            title: `Defect ${e + 1}`,
            data: `D${e}`,
            fn: (row) => resolveData(row, `D${e}`)
        })))
        Array.prototype.push.apply(finalColumns, [...Array(columnData.maxPartsColumns).keys()].map(e => ({
            title: `Parts Exchanged ${e + 1}`,
            data: `P${e}`,
            fn: (row) => resolveData(row, `P${e}`)
        })))
        return finalColumns
    }

    const columnArray = columnDataToColumnArray(columnData)

    await  resolveAllData(columnArray, rowData)

    return {columnArray,  dataArray}
}

mapperDDD(rowData, columnData).then(value => {
    console.log(value)
})

