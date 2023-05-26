/*
* @autor 진현욱
* @since 2023. 05. 25
* @description 
* @test 
*/
public with sharing class CustomObjectService {
    /*
     FieldType(type_x)
     AutoNumber
     Lookup
     MasterDetail
     MetadataRelationship
     Checkbox
     Currency
     Date
     DateTime
     Picklist
     MultiselectPicklist
     Email
     EncryptedText
     Number
     Text
     TextArea
     LongTextArea
     Time
    */
    public CustomObjectService() {
    }

    public static void createObject()
	{
		MetadataService.MetadataPort service = createService();		
		MetadataService.CustomObject customObject = new MetadataService.CustomObject();
		
        //sObjectApi
        customObject.fullName = 'Test1__c';
		customObject.label = 'Test';
		customObject.pluralLabel = 'Tests';
		customObject.nameField = new MetadataService.CustomField();
		//customObject.nameField.type_x = 'Text';
		customObject.nameField.label = 'Test Record';
        //autoNumber [s]
        customObject.nameField.type_x = 'AutoNumber';
        customObject.nameField.displayFormat = '{YYYYMMDD}-{000000}';
        customObject.nameField.startingNumber = 1;
        //autoNumber [e]
		customObject.deploymentStatus = 'Deployed';
		customObject.sharingModel = 'ReadWrite';
        customObject.description = '설명';
		List<MetadataService.SaveResult> results = 		
			service.createMetadata(
				new MetadataService.Metadata[] { customObject });		
		handleSaveResults(results[0]);
	}

    public static void upsertObject()
    {
        MetadataService.MetadataPort service = createService();
        MetadataService.CustomObject customObject = new MetadataService.CustomObject();
        customObject.fullName = 'Test1__c';
        customObject.label = 'Test';
        customObject.pluralLabel = 'Tests Upsert';
        customObject.nameField = new MetadataService.CustomField();
        customObject.nameField.type_x = 'Text';
        customObject.nameField.label = 'Test Record Upsert';
        customObject.deploymentStatus = 'Deployed';
        customObject.sharingModel = 'ReadWrite';
        customObject.description = '설명 업데이트';
        List<MetadataService.UpsertResult> results =
            service.upsertMetadata(
                new MetadataService.Metadata[] { customObject });
        handleUpsertResults(results[0]);
    }

    public static void createLookupField()
    {
        MetadataService.MetadataPort service = createService();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = 'Test__c.LookupField__c';
        customField.label = 'Lookup Field';
        customField.type_x = 'Lookup';
        customField.relationshipLabel = 'Tests';
        customField.relationshipName = 'Tests';
        customField.referenceTo = 'Test__c';
        
        List<MetadataService.SaveResult> results =
            service.createMetadata(
                new MetadataService.Metadata[] { customField });
        handleSaveResults(results[0]);
    }

    public static void createExternalField()
    {
        MetadataService.MetadataPort service = createService();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = 'Test__c.ExternalField__c';
        customField.label = 'External Field';
        customField.type_x = 'Text';
        customField.length = 42;
        customField.externalId = true;
        List<MetadataService.SaveResult> results =
            service.createMetadata(
                new MetadataService.Metadata[] { customField });
        handleSaveResults(results[0]);
    }

    public static void createLongTextAreaField()
    {
        MetadataService.MetadataPort service = createService();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = 'Test__c.LongTextAreaField__c';
        customField.label = 'Long Text Area Field';
        customField.type_x = 'LongTextArea';
        customField.length = 32000;
        customField.visibleLines = 3;
        List<MetadataService.SaveResult> results =
            service.createMetadata(
                new MetadataService.Metadata[] { customField });
        handleSaveResults(results[0]);
    }

    public static void createField()
	{
		MetadataService.MetadataPort service = createService();		
		MetadataService.CustomField customField = new MetadataService.CustomField();
		customField.fullName = 'Test1__c.TestPick__c';
		customField.label = 'Test Pick Field';
		//customField.type_x = 'Text';
        customField.type_x = 'Picklist';
        MetadataService.ValueSet pickVal = new MetadataService.ValueSet();
        pickVal.restricted = true;
        pickVal.valueSetDefinition = new MetadataService.ValueSetValuesDefinition();
        pickVal.valueSetDefinition.sorted = false;
        MetadataService.CustomValue customVal = new MetadataService.CustomValue();
        customVal.label = '점심';
        customVal.fullName = '점심';
        customVal.default_x = false;
        customVal.isActive = false;
        MetadataService.CustomValue customVal2 = new MetadataService.CustomValue();
        customVal2.label = '식사';
        customVal2.fullName = '식사';
        customVal2.default_x = false;
        customVal2.isActive = false;
        pickVal.valueSetDefinition.value = new List<MetadataService.CustomValue>{
            customVal, customVal2
        };
        customField.valueSet = pickVal;
		//customField.length = 42;
		List<MetadataService.SaveResult> results = 		
			service.createMetadata(
				new MetadataService.Metadata[] { customField });				
		handleSaveResults(results[0]);
        showDebug(results);
	}

    public static void showDebug(Object result) {
        System.debug(JSON.serializePretty(result));
    }

    public static void deleteInfo(String type, List<String> apiList)
    {
        MetadataService.MetadataPort service = createService();
        List<MetadataService.DeleteResult> results =
            service.deleteMetadata(
                //'CustomField', new String[] { 'Test__c.TestField__c' });
                'CustomObject', new String[] { 'Test1__c' });
        handleDeleteResults(results[0]);
    }

    public static void updateField()
    {
        MetadataService.MetadataPort service = createService();
        MetadataService.CustomField customField = new MetadataService.CustomField();
        customField.fullName = 'Test__c.TestField__c';
        customField.label='New Test Field Label';
        customField.type_x = 'Text';
        customField.length = 52;
        List<MetadataService.SaveResult> results =
            service.updateMetadata(
                new MetadataService.Metadata[] { customField });
        handleSaveResults(results[0]);
    }

    public static MetadataService.MetadataPort createService()
	{ 
		MetadataService.MetadataPort service = new MetadataService.MetadataPort();
		service.SessionHeader = new MetadataService.SessionHeader_element();
		service.SessionHeader.sessionId = UserInfo.getSessionId();
		return service;		
	}

    public static void handleSaveResults(MetadataService.SaveResult saveResult)
    {
        // Nothing to see?
        if(saveResult==null || saveResult.success)
            return;
        // Construct error message and throw an exception
        if(saveResult.errors!=null)
        {
            List<String> messages = new List<String>();
            messages.add(
                (saveResult.errors.size()==1 ? 'Error ' : 'Errors ') +
                    'occured processing component ' + saveResult.fullName + '.');
            for(MetadataService.Error error : saveResult.errors)
                messages.add(
                    error.message + ' (' + error.statusCode + ').' +
                    ( error.fields!=null && error.fields.size()>0 ?
                        ' Fields ' + String.join(error.fields, ',') + '.' : '' ) );
            // if(messages.size()>0)
            //     throw new MetadataServiceExamplesException(String.join(messages, ' '));
        }
        // if(!saveResult.success)
        //     throw new MetadataServiceExamplesException('Request failed with no specified error.');
    }

    public static void handleUpsertResults(MetadataService.UpsertResult upsertResult)
    {
        // Nothing to see?
        if(upsertResult==null || upsertResult.success)
            return;
        // Construct error message and throw an exception
        if(upsertResult.errors!=null)
        {
            List<String> messages = new List<String>();
            messages.add(
                (upsertResult.errors.size()==1 ? 'Error ' : 'Errors ') +
                    'occured processing component ' + upsertResult.fullName + '.');
            for(MetadataService.Error error : upsertResult.errors)
                messages.add(
                    error.message + ' (' + error.statusCode + ').' +
                    ( error.fields!=null && error.fields.size()>0 ?
                        ' Fields ' + String.join(error.fields, ',') + '.' : '' ) );
            // if(messages.size()>0)
            //     throw new MetadataServiceExamplesException(String.join(messages, ' '));
        }
        // if(!upsertResult.success)
        //     throw new MetadataServiceExamplesException('Request failed with no specified error.');
    }

    
    public static void handleDeleteResults(MetadataService.DeleteResult deleteResult)
    {
        // Nothing to see?
        if(deleteResult==null || deleteResult.success)
            return;
        // Construct error message and throw an exception
        if(deleteResult.errors!=null)
        {
            List<String> messages = new List<String>();
            messages.add(
                (deleteResult.errors.size()==1 ? 'Error ' : 'Errors ') +
                    'occured processing component ' + deleteResult.fullName + '.');
            for(MetadataService.Error error : deleteResult.errors)
                messages.add(
                    error.message + ' (' + error.statusCode + ').' +
                    ( error.fields!=null && error.fields.size()>0 ?
                        ' Fields ' + String.join(error.fields, ',') + '.' : '' ) );
            // if(messages.size()>0)
            //     throw new MetadataServiceExamplesException(String.join(messages, ' '));
        }
        // if(!deleteResult.success)
        //     throw new MetadataServiceExamplesException('Request failed with no specified error.');
    }
}