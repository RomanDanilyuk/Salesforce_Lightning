public with sharing class ApexMainController {
    public ApexMainController() {

    }
    @AuraEnabled
    public static List<String> saveDataFile(String file){
        String test = file.replaceAll('","', ',').replaceAll('"','').replaceAll(']','');  
        String[] resArr = test.split(',');

        Set<Base_Station__c> setStations = new Set<Base_Station__c>();
        List<String> sensorIdList = new List<String>();
        List<Sensor__c> sensors = new List<Sensor__c>();

        for(Integer i = 0; i < resArr.size(); i=i+4) {
            Base_Station__c base = new Base_Station__c();
            base.Name = resArr[i];
            setStations.add(base);
        }
        List<Base_Station__c> listStations = new List<Base_Station__c>();
        for(Base_Station__c st : setStations){
            listStations.add(st);
        }
        insert listStations;     

       for (Integer i = 4; i < resArr.size(); i = i + 4) {  
            
                Base_Station__c station = [SELECT Id FROM Base_Station__c WHERE Name =: resArr[i] LIMIT 1];
              
                Sensor__c sensor = new Sensor__c();            
                sensor.Name = resArr[i+1];
                sensor.Type__c = resArr[i+2];
                sensor.Status__c = resArr[i+3];   
                sensor.Base_Relationship__c = station.Id;           
                sensors.add(sensor);     
        }  
        
        List<String> lst = new List<String>();      
        Database.SaveResult[] insertedSensors = Database.insert(sensors, false);
          for(Database.SaveResult item : insertedSensors) {
            if(item.isSuccess()){
                lst.add(item.getId());
            }
          }
    return lst;
    }

    @AuraEnabled
    public static sensorObject getDataFile(List<String> ListId, Integer pageNumber, Integer pageLimit){
        sensorObject obj = new sensorObject();
        Integer off = (Integer)((pageNumber - 1) * pageLimit);
        obj.page = pageNumber;
        obj.totalPages = [SELECT count() FROM Sensor__c WHERE ID IN :ListId];
        obj.sensors = [SELECT Name, Status__c, Type__c, Base_Relationship__r.Name FROM Sensor__c WHERE Id IN :ListId LIMIT :pageLimit OFFSET:off];
        return obj;
    }
    @AuraEnabled
    public static List<String> deleteSensors(List<String> recordsToDelete){
        List<Sensor__c> records = new List<Sensor__c>();
        List<String> lst = new List<String>();
         records = [SELECT ID FROM Sensor__c WHERE ID IN :recordsToDelete];
         Database.DeleteResult[] deleteRecords = Database.delete(records, false);
         for(Database.DeleteResult item : deleteRecords){
             if(item.isSuccess()){
                 lst.add(item.getId());
             }
         }
        return lst;
      
    }

    public class sensorObject {
        @AuraEnabled
        public List<Sensor__c> sensors {get;set;}
        @AuraEnabled
        public Integer totalPages {get; set;}
        @AuraEnabled
        public Integer page {get; set;}
        }
    }

