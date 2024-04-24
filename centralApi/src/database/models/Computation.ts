import mongoose, { Schema, Document, Model } from 'mongoose';

interface IComputation extends Document {
  title: string;
  imageName: string;
  notes: string;
}

const computationSchema: Schema = new Schema({
  title: { type: String, required: true },
  imageName: { type: String, required: true },
  notes: { type: String, required: true }
});

export const Computation: Model<IComputation> = mongoose.model<IComputation>('Computation', computationSchema);
export { computationSchema }; // Export the schema for reuse

export default Computation;
