import { LightningElement, api, track } from 'lwc';
import { utilAlert, utilShowToast, utilConfrim, getIconURL} from 'c/utils';

//apex
import getSearchData from '@salesforce/apex/CustomLookUpController.getSearchData';

export default class CustomLookUp extends LightningElement {

    @api label                 = 'label';
    @api sObjectApi            = 'User'; //test 용
    @api fields                = 'Id,Name';
    @api orderByClause         = ' order by CreatedDate ';
    _whereClauseList           = [];
    @api whereLogicalOperator  = '';
    @api limitNum              = 100;

    isOptionShowListByOne      = false;
    isSelected                 = false;
    selectedData;
    _displayName = 'Name';
    dataList       = [];
    //{Name:'Burlington Textiles Corp of America',Id:'test'}
    closeIconURL   = getIconURL('utility')+'close';
    _searchIconURL = getIconURL('utility')+'search';
    _targetIconURL = getIconURL('standard') +'account';
    
    _getSearchData(params) {
        getSearchData({params:params}).then(result=>{
            console.log(result);
        }).catch(error=>{
            console.error(error);
        });
    }

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
        this._targetIconURL = getIconURL('standard')+value;
    }

    clickHandler(event) {
        console.log('click!!')
        this.focusHandler();
    }

    removeHandler(event) {
        this.isSelected = false;
    }

    selectHandler(event) {
        let idx = event.currentTarget.dataset.idx;
        this.selectedData = this.dataList.slice()[idx];
        this.isSelected = true;

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
        
        let params = {};

        if(this.sObjectApi) params.sObjectApi = this.sObjectApi;
        if(this.fields) params.fields = this.fields;
        if(this.orderByClause) params.orderByClause = this.orderByClause;
        if(this._whereClauseList && this._whereClauseList.lenght > 0) params.whereClauseList = this._whereClauseList;
        if(this.limitNum) params.limitNum = this.limitNum;

        this._getSearchData(params);
    }

    blurHandler() {
        this.template.querySelector('.customLookupInput').classList.remove('slds-has-focus');
        this.template.querySelector('.slds-dropdown-trigger_click').classList.remove('slds-is-open');
    }

    focusInHandler(event) {
        this._IsFocus = true;
    }

    focusOutHandler(event) {
        this._IsFocus = false;
    }

    customClick() {
        console.log('cusotm Click!!');
        if(!this._IsFocus) {
            this.blurHandler();
        }
    }

    connectedCallback() {
        document.addEventListener('click', (e)=>{
            e.stopPropagation();
            this.customClick();
        });
    }

    disconnectedCallback() {
        document.removeEventListener('click', (e)=>{
            e.stopPropagation();
            this.customClick();
        });
    }
}