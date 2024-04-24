import mongoose, { Schema, Document, Model } from 'mongoose'
import {
  IStudyConfiguration,
  studyConfigurationSchema,
} from './StudyConfiguration.js'

// Define an interface for the Run document, renaming 'errors' to avoid conflict
interface IRun extends Document {
  consortium: mongoose.Types.ObjectId // Reference to the Consortium model
  consortiumLeader: mongoose.Types.ObjectId // Reference to the User model
  studyConfiguration: IStudyConfiguration
  members: mongoose.Types.ObjectId[] // Array of User references
  status: string // Could be an enum or simple string
  runErrors: string[] // Array of error messages, renamed to 'runErrors'
}

// Create the Run schema
const runSchema: Schema = new Schema({
  consortium: {
    type: mongoose.Types.ObjectId,
    ref: 'Consortium',
    required: true,
  },
  consortiumLeader: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studyConfiguration: { type: studyConfigurationSchema, required: true },
  members: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
  status: { type: String, required: true, default: 'Pending' },
  runErrors: [{ type: String, default: [] }], // Using 'runErrors' to store error messages
})

// Create the model
const Run: Model<IRun> = mongoose.model<IRun>('Run', runSchema)

export default Run
