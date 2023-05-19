import { LightningElement } from 'lwc';

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

export default class SamplePageLayout extends LightningElement {

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
        
    ]

    clickHandler(event) {
        console.log(event.currentTarget);
        let tabsCmps = this.template.querySelectorAll('.slds-tabs_scoped__item');
        let targetCmp = event.currentTarget;
        targetCmp.tabindex = 0;
        targetCmp.setAttribute('aria-selected', true)
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
        events.forEach((eventName) => window.addEventListener(eventName, eventLogger));
    }

    connectedCallback() {
        console.log('init');
    }

    disconnectedCallback() {
        console.log('component remove');
    }
}