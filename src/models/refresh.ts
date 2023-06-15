import { Schema, model } from 'mongoose';

interface Refresh {
    token : string,
}


const refreshSchema = new Schema<Refresh>({
    token: {type : String , required : true , unique : true}
});


export default model<Refresh>('Refresh' , refreshSchema, 'refreshs');