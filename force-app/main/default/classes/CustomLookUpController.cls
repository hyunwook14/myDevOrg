/*
* @autor 진현욱
* @since 2023. 05. 03
* @description 
* @test 
*/
public with sharing class CustomLookUpController {
    public CustomLookUpController() {
        
    }

    public class NullSobjectException extends Exception {}

    /**
    * {@autor} 진현욱
    * {@since} 2023. 05. 03
    * {@description} 
    * {@param} 
    */
    @AuraEnabled
    public static Map<String,Object> getSearchData(Map<String,Object> params){
        try {
            Map<String,Object> result = new Map<String,Object>();
            result.put('params', params);

            String sObjectApi = (params.get('sObjectApi') != null) ? String.valueOf(params.get('sObjectApi')) : '';
            String fields     = (params.get('fields') != null) ? String.valueOf(params.get('fields')) : '';
            String orderByClause = (params.get('orderByClause') != null) ? String.valueOf(params.get('orderByClause')) : '';
            List<String> whereClauseList = 
            (params.get('whereClauseList') != null) ? 
            (List<String>) JSON.deserialize(JSON.serialize(params.get('whereClauseList')), List<String>.class) 
            : null;
            
            String whereLogicalOperator = (params.get('whereLogicalOperator') != null) ? String.valueOf(params.get('whereLogicalOperator')) : '';
            Integer limitNum = (params.get('limitNum') != null) ? Integer.valueOf(params.get('limitNum')) : 100;
            String query = '';
            String querySelect = 'select ' +fields;
            if(String.isBlank(sObjectApi)) throw new NullSobjectException('Not Defined sObjectApi');
            String queryFrom = ' from '+sObjectApi;
            String queryWhere = ' where id != null ';
            
            query += querySelect + queryFrom + queryWhere;
        
            result.put('query', query);

            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}