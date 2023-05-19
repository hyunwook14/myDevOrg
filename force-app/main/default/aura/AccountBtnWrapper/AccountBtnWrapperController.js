({
    onPageReferenceChange: function(component, event, helper) {
        console.log('onPageReferenceChange');
        let myPageRef = component.get("v.pageReference");
        console.log(JSON.stringify(myPageRef));
    },

    doInit: function(component, event, helper) {
        console.log('init');
        let myPageRef = component.get("v.pageReference");
        console.log(JSON.stringify(myPageRef));
    },

    handleClick: function(component, event, helper) {
        let isShow = component.get('v.isShow');

        component.set('v.isShow', !isShow);
    }
})
