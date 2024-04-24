import mongoose from 'mongoose'
import Consortium from './models/Consortium.js'
import Computation from './models/Computation.js'
import Run from './models/Run.js'
import User from './models/User.js'
import bcrypt from 'bcrypt'
import getConfig from '../config/getConfig.js'

const { databaseDetails } = getConfig()
const { url, user, pass } = databaseDetails
const saltRounds = 10

// Predefined ObjectIds
const centralUserId = new mongoose.Types.ObjectId('66289c79aebab67040a20067')
const user1Id = new mongoose.Types.ObjectId('66289c79aebab67040a20068')
const user2Id = new mongoose.Types.ObjectId('66289c79aebab67040a20069')
const computation1Id = new mongoose.Types.ObjectId('66289c79aebab67040a21000')
const computation2Id = new mongoose.Types.ObjectId('66289c79aebab67040a21001')
const consortium1Id = new mongoose.Types.ObjectId('66289c79aebab67040a22000')
const consortium2Id = new mongoose.Types.ObjectId('66289c79aecab67040a22001')
const run1Id = new mongoose.Types.ObjectId('66289c79aecab67040a23000')
const run2Id = new mongoose.Types.ObjectId('66289c79aecab67040a23001')

const seedDatabase = async () => {
  try {
    await mongoose.connect(url, { user, pass, authSource: 'admin' })
    console.log('MongoDB connected successfully.')

    // Clear existing data
    await User.deleteMany({})
    await Consortium.deleteMany({})
    await Computation.deleteMany({})
    await Run.deleteMany({})

    // Create users
    const users = [
      {
        _id: user1Id,
        username: 'user1',
        hash: await bcrypt.hash('password1', saltRounds),
      },
      {
        _id: user2Id,
        username: 'user2',
        hash: await bcrypt.hash('password2', saltRounds),
      },
      {
        _id: centralUserId,
        username: 'centralUser',
        hash: await bcrypt.hash('centralPassword', saltRounds),
        roles: ['central'],
      },
    ]
    await User.insertMany(users)
    console.log('Users seeded successfully!')

    // Create computations
    const computations = [
      {
        _id: computation1Id,
        title: 'Computation A',
        imageName: 'boilerplate_average_app',
        notes: 'This is the boilerplate average app',
      },
      {
        _id: computation2Id,
        title: 'Computation B',
        imageName: 'boilerplate_average_app',
        notes: 'Notes for Computation B',
      },
    ]
    await Computation.insertMany(computations)
    console.log('Computations seeded successfully!')

    // Create consortia
    const consortia = [
      {
        _id: consortium1Id,
        title: 'Consortium One',
        description: 'This is the first consortium',
        leader: user1Id,
        members: [user1Id],
        activeMembers: [user1Id, user2Id],
        studyConfiguration: {
          consortiumLeaderNotes: 'Leader notes for Consortium One',
          computationParameters: JSON.stringify({ parameter: 'value' }),
          computation: {
            title: computations[0].title,
            imageName: computations[0].imageName,
            notes: computations[0].notes,
          
          },
        },
      },
      {
        _id: consortium2Id,
        title: 'Consortium Two',
        description: 'This is the second consortium',
        leader: user2Id,
        members: [user2Id],
        activeMembers: [user1Id, user2Id],
        studyConfiguration: {
          consortiumLeaderNotes: 'Leader notes for Consortium Two',
          computationParameters: JSON.stringify({ parameter: 'value' }),
          computation: {
            title: computations[1].title,
            imageName: computations[1].imageName,
            notes: computations[1].notes,
          },
        },
      },
    ]
    await Consortium.insertMany(consortia)
    console.log('Consortia seeded successfully!')

    // Create runs
    const runs = [
      {
        _id: run1Id,
        consortium: consortium1Id,
        consortiumLeader: user1Id,
        studyConfiguration: consortia[0].studyConfiguration,
        members: consortia[0].members,
        status: 'Active',
        runErrors: ['Error encountered during processing Run 1.'],
      },
      {
        _id: run2Id,
        consortium: consortium2Id,
        consortiumLeader: user2Id,
        studyConfiguration: consortia[1].studyConfiguration,
        members: consortia[1].members,
        status: 'Pending',
        runErrors: [],
      },
    ]
    await Run.insertMany(runs)
    console.log('Runs seeded successfully!')
  } catch (error) {
    console.error('Failed to seed database:', error)
  } finally {
    await mongoose.connection.close()
  }
}

seedDatabase()
