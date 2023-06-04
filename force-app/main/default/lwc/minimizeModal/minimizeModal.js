import { LightningElement } from 'lwc';
import { utilAlert, utilShowToast, utilConfrim, getIconURL} from 'c/utils';

export default class MinimizeModal extends LightningElement {

    minimizeIconURL   = getIconURL('utility')+'erect_window';

    handleMinimize(event) {
        console.log('최소화 버튼 클릭 [s]');

        const styleTag = document.createElement('style');
        styleTag.setAttribute('id','minimizeStyle');
        styleTag.innerHTML = `
            .slds-backdrop.fix-slds-backdrop, .slds-modal.fix-slds-modal {
                visibility: hidden;
            }
            .actionBar {
                position: fixed;
                bottom: 0rem;
                background-color: lightgoldenrodyellow;
                width: 250px;
                height: 50px;
                z-index: 900000000001;

            }
        `;
        const actionBarTag = document.createElement('div');
        actionBarTag.setAttribute('id','actionBar');
        actionBarTag.innerText = '최대화';
        actionBarTag.classList.add('actionBar');
        
        document.getElementsByTagName('body')[0].appendChild(styleTag);
        
        actionBarTag.addEventListener('click', (event) => {
            console.log('actionBarClick');
            let styleTag= document.querySelector('style[id=minimizeStyle]');
            document.body.removeChild(styleTag);
        });
            
        document.getElementsByTagName('body')[0].appendChild(actionBarTag);
        console.log('최소화 버튼 클릭 [e]');
    }

    renderedCallback()  {
        console.log('minimizeModal renderedCallback');

    }

}