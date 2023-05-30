/*
* @autor 진현욱
* @since 2023. 05. 30
* @description 
* @test 
*/
public with sharing class samplePageLayoutController {
    public samplePageLayoutController() {

    }
    
    @AuraEnabled
    public static Map<String,Object> getObjectInfo(){
        try {
            Map<String,Object> result = new Map<String,Object>();
            List<selectOption> objectInfoOptionList = new List<selectOption>();

            List<EntityDefinition> objectInfoList = [
                select
                    Id, DurableId, QualifiedApiName, NamespacePrefix, DeveloperName, MasterLabel, Label, PluralLabel, DefaultCompactLayoutId, IsCustomizable, IsApexTriggerable, IsWorkflowEnabled, IsProcessEnabled, IsCompactLayoutable, DeploymentStatus, KeyPrefix, IsCustomSetting, IsDeprecatedAndHidden, IsReplicateable, IsRetrieveable, IsSearchLayoutable, IsSearchable, IsTriggerable, IsIdEnabled, IsEverCreatable, IsEverUpdatable, IsEverDeletable, IsFeedEnabled, IsQueryable, IsMruEnabled, DetailUrl, EditUrl, NewUrl, EditDefinitionUrl, HelpSettingPageName, HelpSettingPageUrl, RunningUserEntityAccessId, PublisherId, IsLayoutable, RecordTypesSupported, InternalSharingModel, ExternalSharingModel, HasSubtypes, IsSubtype, IsAutoActivityCaptureEnabled, IsInterface, ImplementsInterfaces, ImplementedBy, ExtendsInterfaces, ExtendedBy, DefaultImplementation

                from EntityDefinition 
                where 
                    IsCustomizable = true and IsApexTriggerable = true
                order by Label
            ];

            

            for(EntityDefinition objectInfo: objectInfoList) {
                objectInfoOptionList.add(
                    new selectOPtion(objectInfo.Label , objectInfo.QualifiedApiName)
                );
            }

            result.put('objectInfoOptionList', objectInfoOptionList);
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String,Object> getFieldInfo(String objectApi){
        try {
            Map<String,Object> result = new Map<String,Object>();
            List<selectOPtion> fieldOptionList = new List<selectOPtion>();
            List<FieldDefinition> fieldInfoList = [
                select
                    Id, DurableId, QualifiedApiName, EntityDefinitionId, NamespacePrefix, DeveloperName, MasterLabel, Label, Length, DataType, ServiceDataTypeId, ValueTypeId, ExtraTypeInfo, IsCalculated, IsHighScaleNumber, IsHtmlFormatted, IsNameField, IsNillable, IsWorkflowFilterable, IsCompactLayoutable, Precision, Scale, IsFieldHistoryTracked, IsIndexed, IsApiFilterable, IsApiSortable, IsListFilterable, IsListSortable, IsApiGroupable, IsListVisible, ControllingFieldDefinitionId, LastModifiedDate, LastModifiedById, PublisherId, RunningUserFieldAccessId, RelationshipName, ReferenceTo, ReferenceTargetField, IsCompound, IsSearchPrefilterable, IsPolymorphicForeignKey, IsAiPredictionField, BusinessOwnerId, BusinessStatus, SecurityClassification, ComplianceGroup, Description
                from FieldDefinition  
                where EntityDefinitionId  = :objectApi
            ];

            for(FieldDefinition fieldInfo : fieldInfoList) {
                fieldOptionList.add(
                    new selectOption(fieldInfo.Label , fieldInfo.QualifiedApiName)
                );
            }
            result.put('fieldOptionList', fieldOptionList);
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String,Object> getDatas(String objectApi, List<String> fieldInfoList){
        try {
            Map<String,Object> result = new Map<String,Object>();

            String query = ' select ';
            query += String.join(fieldInfoList, ',');
            //query = query.substring(0, query.lastIndexOf(',') - 1);
            query += ' from '+ objectApi;

            System.debug('query=='+query);
            List<sObject> getDataList = database.query(query);
            result.put('query',query);
            result.put('getDataList',getDataList);

            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class selectOption {
        @AuraEnabled
        public String label;

        @AuraEnabled
        public String value;

        @AuraEnabled
        public String fieldName;
        

        public selectOption(){}
        public selectOption(String label, String value) {
            this.label = label;
            this.value = fieldName = value;
        }
    }
}