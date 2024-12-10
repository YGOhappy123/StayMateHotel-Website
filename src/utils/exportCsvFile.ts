import FileSaver from 'file-saver'
import { utils, write } from 'xlsx'

export const exportToCSV = (csvData: any, fileName: string, columnsWidth?: any) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const ws = utils.json_to_sheet(csvData)
    if (columnsWidth) {
        ws['!cols'] = columnsWidth
    }

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })

    FileSaver.saveAs(data, fileName + fileExtension)
}
