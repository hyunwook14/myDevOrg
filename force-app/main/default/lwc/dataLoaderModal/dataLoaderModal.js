import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import { loadScript } from 'lightning/platformResourceLoader';
import sheetjs from '@salesforce/resourceUrl/sheetjs';



export default class DataLoaderModal extends LightningModal  {
    @api content;
    version = "???"; 

    isInit = false;
    @track data;
    columns = [];

    get isData() {
        console.log('isData getter');
        if(this.data) return true;
        else return false;
    }

    get acceptedFormats() {
        return ['.xlsx', '.xlx', '.csv'];
    }

    async handleFilesChange(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        
        /*file upload 방법1
        let fileReader = new FileReader();
        fileReader.onload = function() {
            let fileData = fileReader.result;
            var wb = XLSX.read(fileData, {type : 'binary'});
            this.columns = [];

            let copyColumns = this.columns.splice();
            wb.SheetNames.forEach(function(sheetName){
                let headerInfo = XLSX.utils.sheet_to_json(wb.Sheets[sheetName],{header:1})[0];
                headerInfo.forEach(header=>{
                    copyColumns.push({
                        label:header
                        ,value:header
                    });
                });
                
                var rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
                this.data = rowObj;
	            console.log(JSON.stringify(rowObj));
            });
            this.columns = copyColumns;
        }
        fileReader.readAsBinaryString(uploadedFiles[0]);
        */
        /*file upload 방법2*/
            const data = await uploadedFiles[0].arrayBuffer();
            // data is an ArrayBuffer 
            const workbook = XLSX.read(data);
            // do something with the workbook here 
            console.log(workbook);
            this.columns = [];
            let copyColumns = this.columns.splice();
            this.columns = copyColumns;

            workbook.SheetNames.forEach(sheetName => {
                console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])); //
                console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{header:1})[0]); //header

                let headerInfo = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{header:1})[0];
                headerInfo.forEach(header=>{
                    copyColumns.push({
                        label:header
                        ,fieldName:header
                    });
                });

                let rowObj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                this.data = rowObj;
            });

            
        /**/
        
    }

    handleOkay() {
        this.close('okay');
    }

    async connectedCallback() {
        await loadScript(this, sheetjs); // load the library
        // At this point, the library is accessible with the `XLSX` variable
        console.log(XLSX);
        this.version = XLSX.version;
      }
    
    renderedCallback() {
        if(!this.isInit) {
            // Promise.all([
            //     loadScript(this, sheetjs)
            //     //loadStyle(this, D3 + '/style.css')
            // ]).then(() => {
            //         this.isInit = true;
            //         console.log('script load');
            //         console.log(sheetjs);
            //         console.log(XLSX);
            //         this.version = XLSX.version;
            //     })
            //     .catch(error => {
            //         console.error(error.message);
            //         // this.dispatchEvent(
            //         //     new ShowToastEvent({
            //         //         title: 'Error ',
            //         //         message: error.message,
            //         //         variant: 'error'
            //         //     })
            //         // );
            // });
        }
    }
}