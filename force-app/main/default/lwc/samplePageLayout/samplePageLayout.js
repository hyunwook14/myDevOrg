import { LightningElement } from 'lwc';
import dataLoaderModal from 'c/dataLoaderModal';
import { loadScript } from 'lightning/platformResourceLoader';
import sheetjs from '@salesforce/resourceUrl/sheetjs';
import getObjectInfo from '@salesforce/apex/samplePageLayoutController.getObjectInfo';
import getFieldInfo from '@salesforce/apex/samplePageLayoutController.getFieldInfo';
import getDatas from '@salesforce/apex/samplePageLayoutController.getDatas';

const events = ["pagehide", "pageshow", "unload", "load"];

const eventLogger = (event) => {
  switch (event.type) {
    case "pagehide":
    case "pageshow": {
      let isPersisted = event.persisted ? "persisted" : "not persisted";
      console.log(`Event: ${event.type} - ${isPersisted}`);
      break;
    }
    default:
      console.log(`Event: ${event.type}`);
      break;
  }
};
let XLS = {};

export default class SamplePageLayout extends LightningElement {
    objectOptions = [];
    fieldOptions  = [];
    selectedOptionList = [];
    data = [];

    customLookupInfo = [
        {attribute:'isRequired          ' , isRequired:'false', desc:'필수표시여부, 값: true/false'},
        {attribute:'isDisabled          ' , isRequired:'false', desc:'개발중'},
        {attribute:'label               ' , isRequired:'false', desc:'custom look up에 표시할 라벨'},
        {attribute:'sObjectApi          ' , isRequired:'true', desc:'검색할 대상이 되는 sObject Api 명, 값:User/Contact/등...'},
        {attribute:'searchField         ' , isRequired:'false', desc:'내용 검색시 기준이 되는 필드로 한 필드만 사용가능. default: Name'},
        {attribute:'fields              ' , isRequired:'false', desc:'검색 대상의 필드 정보, default: Id,Name'},
        {attribute:'orderByClause       ' , isRequired:'false', desc:'정렬 기준, default: order by CreatedDate'},
        {attribute:'limitNum            ' , isRequired:'false', desc:'default: 100'},
        {attribute:'whereClauseStr       ', isRequired:'false', desc:'검색할 대상의 필터 기준, value:["Id != null"]'},
        {attribute:'whereLogicalOperator' , isRequired:'false', desc:'필터 기준의 논리식으로 이 속성을 사용하지 않을경우 and 형식 묶는다, value: ( {0} or {1} ) and ( {2} )/등...'},
        {attribute:'displayName          ', isRequired:'false', desc:'검색시 Option에 노출할 필드 정보로 2개 이상일 경우 강제적으로 css 수정이 필요, defulat:Name, value:Name,Id/등...'},
        {attribute:'targetIconURL        ', isRequired:'false', desc:'검색 및 선택된 Option 에 나타나는 Icon 정보, default:account, '},
        
    ];

    isInit = false;

    async handleFilesChange(event) {
        // Get the list of uploaded files
        console.log('?');
        const uploadedFiles = event.detail.files;
        const data = await uploadedFiles[0].arrayBuffer();
        /* data is an ArrayBuffer */
        const workbook = XLS.read(data);
        /* do something with the workbook here */
        console.log(workbook);
        workbook.SheetNames.forEach(sheetName => {
            console.log(XLS.utils.sheet_to_json(workbook.Sheets[sheetName]));
            console.log(XLS.utils.sheet_to_json(workbook.Sheets[sheetName],{header:1})[0]);
        });
        // workbook.SheetNames.forEach(sheetName => {
            
        //     console.log(XLS.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
        // });
        
    }

    async handleModalClick() {
        console.log('modalShow!');
        const result = await dataLoaderModal.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'large',
            description: 'modalInfo',
            content: 'Passed into content api',
        });

        
        // if modal closed with X button, promise returns result = 'undefined'
        // if modal closed with OK button, promise returns result = 'okay'
        console.log(result);
    }

    clickHandler(event) {
        console.log(event.currentTarget);
        let tabsCmps = this.template.querySelectorAll('.slds-tabs_scoped__item');
        for(let tabCm of tabsCmps) {
            tabCm.classList.remove('slds-is-active');
        }

        let liCmps = this.template.querySelectorAll('.slds-tabs_scoped__item');
        for(let liCmp of liCmps) {
            liCmp.tabIndex = -1;
            liCmp.setAttribute('aria-selected', false);
        }

        let targetCmp = event.currentTarget;
        targetCmp.tabindex = 0;
        targetCmp.setAttribute('aria-selected', true);
        targetCmp.parentElement.classList.add('slds-is-active');
        // let targetParentCmp = event.target;
        // targetParentCmp.classList.add('slds-is-active');

        let selectedControl = targetCmp.getAttribute('aria-controls');

        let tabContents = this.template.querySelectorAll('.slds-tabs_scoped__content');
        for(let tabContent of tabContents) {
            tabContent.classList.remove('slds-active');
            tabContent.classList.remove('slds-hide');

            if(selectedControl == tabContent.id) {
                tabContent.classList.add("slds-active");
            }else {
                tabContent.classList.add('slds-hide');
            }
        }
    }

    handleExport(event) {
        console.log('Export Btn Click');

        if(this.data.length>0) {
            let wb = XLSX.utils.book_new();
            let header = this.selectedOptionList.slice();

            // this.selectedOptionList.forEach(selectedOption=>{
            //     header.push(selectedOption.value)
            // }); 

            let ws = XLSX.utils.json_to_sheet(this.data , {header:header});

            let title = 'test';
            //엑셀파일정보
            wb.Props = {
                Title: title,
                Subject: "Excel",
                Author: "Master",
                CreatedDate: new Date()
            };
            
            /* 방법1 [s]*/
            //엑셀 첫번째 시트네임
            wb.SheetNames.push(title);

            //시트에 데이터를 연결
            wb.Sheets[title] = ws;
            /* 방법1 [e]*/

            /* 방법2 [s]*/
            //XLSX.utils.book_append_sheet(wb, ws, "Data");
            /* 방법2 [e]*/

            XLSX.writeFile(wb, "SheetForceExport4.xlsx");
        }
    }

    handleSearchClick(event) {
        console.log('clicked search btn');
        let sObjectApi = this.template.querySelector('.sObjectInfo').value;

        if(sObjectApi) {
            getDatas({
                objectApi: sObjectApi
                ,fieldInfoList: this.selectedOptionList
            }).then(result=>{
                console.log(result);
                this.data = result.getDataList;
            }).catch(error=>{
                console.error(error);
            });

        }
    }

    handleObjectChange(event) {
        console.log(event.currentTarget.value);
        console.log(event.target.value);
        let objectApi = event.target.value;
        getFieldInfo({objectApi:objectApi}).then(result=>{
            let fieldOptionList = result.fieldOptionList.slice();
            this.fieldOptions = fieldOptionList;
            let selectedOptionList = [];
            fieldOptionList.forEach(fieldOption=>{
                selectedOptionList.push(
                    fieldOption.value
                );
            })
            this.selectedOptionList = selectedOptionList;
        }).catch(error=>{   
            console.error(error);
        })
    }

    _setOnPopStateHandler() {
        console.log('_setOnPopStateHandler');
        window.onpopstate = (ev) => {
            console.log(ev);
            alert(
                `location: ${document.location}, state: ${JSON.stringify(ev.state)}`
              );
            // get the state for the history entry the user is going to be on
            const state = ev.state;
            if(state && state.pageNumber) {
                this.pageNumber = state.pageNumber;
            }
        };
    }

    constructor() {
        super();
        //this._setOnPopStateHandler.call(this);
        //this._setOnPopStateHandler();
        //events.forEach((eventName) => window.addEventListener(eventName, eventLogger));
    }

    async connectedCallback() {
        console.log('init');

        await loadScript(this, sheetjs); // load the library
        // At this point, the library is accessible with the `XLSX` variable
        //console.log(XLSX);
        XLS = XLSX;

        this.template.addEventListener('mouseup', (event)=>{
            console.log('samplePageLayout.js mouseup');
            console.log('event');
            console.log(event);
            //let now_mouseup = widnow.event.srcElement
            //console.log(now_mouseup.className);
        });

        getObjectInfo({}).then(result=>{
            console.log(result);
            this.objectOptions = result.objectInfoOptionList;
        }).catch(error=>{
            console.error(error);
        });
    }

    disconnectedCallback() {
        console.log('component remove');
    }

    renderedCallback() {
        if(!this.isInit) {
            this.isInit = true;

            let targetAList= this.template.querySelectorAll('.slds-vertical-tabs__link');
            let navList = this.template.querySelectorAll('.slds-vertical-tabs__nav-item');
            let targetContentList = this.template.querySelectorAll('.slds-vertical-tabs__content');
            for(let targetA of targetAList) {
                targetA.addEventListener('click', (event)=>{
                    
                    for(let nav of navList) {
                        nav.classList.remove('slds-is-active');
                    }

                    let targetCmp = event.currentTarget;
                    targetCmp.parentElement.classList.add('slds-is-active');
                    let selectedControl = targetCmp.getAttribute('aria-controls');

                    for(let targetContent of targetContentList) {
                        targetContent.classList.remove('slds-show');
                        targetContent.classList.remove('slds-hide');

                        if(selectedControl == targetContent.id) {
                            targetContent.classList.add("slds-show");
                        }else {
                            targetContent.classList.add('slds-hide');
                        }
                    }
                    
                });
            }
        }
    }
}