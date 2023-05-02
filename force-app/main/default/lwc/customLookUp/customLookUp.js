import { LightningElement, api, track } from 'lwc';
import { utilAlert, utilShowToast, utilConfrim} from 'c/utils';

const defualtStandardIconUrl = '/_slds/icons/standard-sprite/svg/symbols.svg#';
const defualtUtilIconUrl = '/_slds/icons/utility-sprite/svg/symbols.svg#';

export default class CustomLookUp extends LightningElement {

    @api label                 = 'label';
    isOptionShowListByOne      = false;
    isSelected                 = false;
    selectedData;
    _displayName = 'Name';
    dataList       = [{Name:'Burlington Textiles Corp of America',Id:'test'}];
    closeIconURL   = defualtUtilIconUrl+'close';
    _searchIconURL = defualtUtilIconUrl+'search';
    _targetIconURL = defualtStandardIconUrl +'account';

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
        this._searchIconURL = defualtUtilIconUrl+value;
    }

    @api
    get targetIconURL() {
        return this._targetIconURL;
    }

    set targetIconURL(value) {
        this._targetIconURL = defualtStandardIconUrl+value;
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