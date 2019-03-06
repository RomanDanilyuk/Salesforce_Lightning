declare module "@salesforce/apex/ApexMainController.saveDataFile" {
  export default function saveDataFile(param: {file: any}): Promise<any>;
}
declare module "@salesforce/apex/ApexMainController.getDataFile" {
  export default function getDataFile(param: {ListId: any, pageNumber: any, pageLimit: any}): Promise<any>;
}
declare module "@salesforce/apex/ApexMainController.deleteSensors" {
  export default function deleteSensors(param: {recordsToDelete: any}): Promise<any>;
}
