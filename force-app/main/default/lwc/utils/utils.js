import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningConfirm from 'lightning/confirm';
import LightningAlert from 'lightning/alert';

const defaultIconUrl ='/_slds/icons/{0}-sprite/svg/symbols.svg#';
/** icon Info [s] */
const doctype = 'doctype';
const standard = 'standard';
const utility = 'utility';
const custom  = 'custom';
const action = 'action';
/** icon Info [e] */

const getIconURL = (type) => {
    return defaultIconUrl.replace(/(\{0\})/, type);
};

const utilAlert = async(label,theme, message) => {
    await LightningAlert.open({
        message: 'This is the alert message.',
        theme: 'error', // a red theme intended for error states
        label: 'Error!', // this is the header text
    });
}

const utilShowToast = (title, message, variant) => {
    const event = new ShowToastEvent({
        title: title,
        message:message,
        variant:variant,
    });

    dispatchEvent(event);
}

const utilConfrim = async (label, message, variant) => {
    
    const result = await LightningConfirm.open({
            message: message,
            variant: variant ? variant : 'headerless',
            label: label,
            // setting theme would have no effect
    });
    return result;
}

export {utilAlert, utilShowToast, utilConfrim, getIconURL};