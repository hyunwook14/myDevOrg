import { LightningElement, api, track } from 'lwc';
import { utilAlert, utilShowToast, utilConfrim, getIconURL} from 'c/utils';

//apex
import getSearchData from '@salesforce/apex/CustomLookUpController.getSearchData';

export default class CustomLookUp extends LightningElement {
    //TBD help Text 추가 , Disabled
    @api isRequired            = false;
    @api isDisabled            = false;
    @api label                 = '';
    @api sObjectApi            = ''; //test 용
    @api searchField           = 'Name';
    @api fields                = 'Id,Name';
    @api orderByClause         = ' order by CreatedDate ';
    @api whereLogicalOperator  = '';
    @api limitNum              = 100;
    _whereClauseList           = [];
    selectedDisplayInfo        ='';

    isOptionShowListByOne      = true;
    isSelected                 = false;
    isSearchLoading            = false;
    selectedData;
    _displayName = 'Name';
    dataList       = [];
    closeIconURL   = getIconURL('utility')+'close';
    _searchIconURL = getIconURL('utility')+'search';
    _targetIconURL = getIconURL('standard')+'account';
    

    @api get whereClauseStr() {
        return this._whereClauseList;
    }
    set whereClauseStr(value) {
        this._whereClauseList = JSON.parse(JSON.stringify(value));
    }

    get isOptionDataList() {
        return (this.dataList.length > 0);
    }

    @api
    get displayName() {
        if(this._displayName.split(',').length > 1) this.isOptionShowListByOne = false;
        else this.isOptionShowListByOne = true;

        return this._displayName;
    }

    set displayName(value) {
        this._displayName = value;
        this.displayName;
    }

    @api
    get searchIconURL() {
        return this._searchIconURL;
    }

    set searchIconURL(value) {
        this._searchIconURL = getIconURL('utility')+value;
    }

    @api
    get targetIconURL() {
        return this._targetIconURL;
    }

    set targetIconURL(value) {
        let iconInfoList = value.split(',');
        this._iconInfoList = iconInfoList;

        if(iconInfoList.length > 1) {
            this._targetIconURL = getIconURL(iconInfoList[0])+iconInfoList[1];
        }
        else {
            this._targetIconURL = getIconURL('standard')+value;
        }

    }

    _getSearchData(params) {
        this.isSearchLoading = true;
        getSearchData({params:params}).then(result=>{
            console.log(result);
            this.dataList = result.data;

        }).catch(error=>{
            console.error(error);
        }).finally(()=>{
            this.isSearchLoading = false;
        });
    }

    inputHandler(event) {

        let params = {searchField:this.searchText};
        let searchText = event.currentTarget.value;
        if(searchText) params.searchText = searchText;
        if(this.sObjectApi) params.sObjectApi = this.sObjectApi;
        if(this.fields) params.fields = this.fields.toLowerCase();
        if(this.orderByClause) params.orderByClause = this.orderByClause;
        if(this._whereClauseList && this._whereClauseList.lenght > 0) params.whereClauseList = this._whereClauseList;
        if(this.limitNum) params.limitNum = this.limitNum;
       

        this._getSearchData(params);
    }

    clickHandler(event) {
        //console.log('click!!')
        this.focusHandler();
    }

    removeHandler(event) {
        this.isSelected = false;
    }

    selectHandler(event) {
        let idx = event.currentTarget.dataset.idx;
        this.selectedData = this.dataList.slice()[idx];
        this.isSelected = true;

        let displayNameList = this._displayName.split(',');

        for(let field in this.selectedData) {
            if(field.toLowerCase() === displayNameList[0].toLowerCase())
            this.selectedDisplayInfo = this.selectedData[field];
        }

        // Creates the event with the contact ID data.
        const selectedEvent = new CustomEvent('selected', { detail: this.selectedData});
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);

        this.blurHandler();
    }

    /**
    * {@autor} 진현욱
    * {@since} 2023. 05. 02
    * {@description} 
    * {@param} 
    */
    focusHandler() {
        this.template.querySelector('.customLookupInput').classList.add('slds-has-focus');
        this.template.querySelector('.slds-dropdown-trigger_click').classList.add('slds-is-open');
        
        let params = {searchField:this.searchText};
        let searchText = this.template.querySelector('.customLookupInput').value;

        if(searchText) params.searchText = searchText;
        if(this.sObjectApi) params.sObjectApi = this.sObjectApi;
        if(this.fields) params.fields = this.fields.toLowerCase();
        if(this.orderByClause) params.orderByClause = this.orderByClause;
        if(this._whereClauseList && this._whereClauseList.lenght > 0) params.whereClauseList = this._whereClauseList;
        if(this.limitNum) params.limitNum = this.limitNum;
       
        if(!searchText) this._getSearchData(params);
    }

    blurHandler() {
        if(this.template.querySelector('.customLookupInput')) this.template.querySelector('.customLookupInput').classList.remove('slds-has-focus');
        if(this.template.querySelector('.slds-dropdown-trigger_click'))  this.template.querySelector('.slds-dropdown-trigger_click').classList.remove('slds-is-open');
    }

    focusInHandler(event) {
        this._IsFocus = true;
    }

    focusOutHandler(event) {
        this._IsFocus = false;
    }

    customClick(event) {
        console.log('cusotm Click!!');
        //event.stopPropagation(); 버블링을 막음 사용 x
        if(!this._IsFocus) {
            this.blurHandler();
        }
    }

    connectedCallback() {
        this._customClick = this.customClick.bind(this);
        document.addEventListener('click', this._customClick); // option : true 캡쳐링단계 false 버블링단계
    }

    disconnectedCallback() {
        console.log('cusotm Lookup disconnectdCallback')
        document.removeEventListener('click', this._customClick);
    }

    renderedCallback() {
        let targetIconContainers = this.template.querySelectorAll('.target-icon_container')

        if(this._iconInfoList && this._iconInfoList.length > 1 ) {
            for(let targetIconContainer of targetIconContainers) {   
                targetIconContainer.classList.add('slds-icon-'+this._iconInfoList[0]+'-'+this._iconInfoList[1])
            }
        }else {
            for(let targetIconContainer of targetIconContainers) {   
                targetIconContainer.classList.add('slds-icon-standard-'+this._iconInfoList[0])
            }
        }
    }
}