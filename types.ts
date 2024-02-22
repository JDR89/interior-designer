export interface Prediction{
    status:"starting"|"processing"|"succeeded"|"failed";
    id:string,
    output:[string,string]
}