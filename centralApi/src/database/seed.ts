import mongoose from 'mongoose'
import Consortium from './models/Consortium.js'
import Computation from './models/Computation.js'
import Run from './models/Run.js'
import User from './models/User.js'
import bcrypt from 'bcrypt'
import getConfig from '../config/getConfig.js'
import { logger } from '../logger.js'
import computationNotesMarkdownExample from './computationNotesMarkdownExample.js'
import computationNotesNvflareBoilerplate from './computationNotesNvflareBoilerplate.js'

const { databaseDetails } = await getConfig()
const { url, user, pass } = databaseDetails
const saltRounds = 10

// Predefined ObjectIds
const centralUserId = new mongoose.Types.ObjectId('66289c79aebab67040a20067')
const user1Id = new mongoose.Types.ObjectId('66289c79aebab67040a20068')
const user2Id = new mongoose.Types.ObjectId('66289c79aebab67040a20069')
const user3Id = new mongoose.Types.ObjectId('66289c79aebab67040a20070')
const user4Id = new mongoose.Types.ObjectId('66289c79aebab67040a20071')
const computation1Id = new mongoose.Types.ObjectId('66289c79aebab67040a21000')
const computation2Id = new mongoose.Types.ObjectId('66289c79aebab67040a21001')
const consortium1Id = new mongoose.Types.ObjectId('66289c79aebab67040a22000')
const consortium2Id = new mongoose.Types.ObjectId('66289c79aecab67040a22001')
const run1Id = new mongoose.Types.ObjectId('66289c79aecab67040a23000')
const run2Id = new mongoose.Types.ObjectId('66289c79aecab67040a23001')
const run3Id = new mongoose.Types.ObjectId('66289c79aecab67040a23002')

const seedDatabase = async () => {
  try {
    await mongoose.connect(url, { user, pass, authSource: 'admin' })
    logger.info('MongoDB connected successfully.')

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
        _id: user3Id,
        username: 'user3',
        hash: await bcrypt.hash('password3', saltRounds),
      },
      {
        _id: user4Id,
        username: 'user4',
        hash: await bcrypt.hash('password4', saltRounds),
        roles: ['admin'],
      },
      {
        _id: centralUserId,
        username: 'centralUser',
        hash: await bcrypt.hash('centralPassword', saltRounds),
        roles: ['central'],
      },
    ]
    await User.insertMany(users)
    logger.info('Users seeded successfully!')

    // Create computations
    const computations = [
      {
        _id: computation1Id,
        title: 'NVFLARE boilerplate average',
        imageName: 'boilerplate_average_app',
        imageDownloadUrl: 'https://example.com/boilerplate_average_app',
        notes: computationNotesNvflareBoilerplate,
        owner: user1Id.toString(),
      },
      {
        _id: computation2Id,
        title: 'Markdown Example',
        imageName: 'markdown_example',
        imageDownloadUrl: 'https://www.markdownguide.org/cheat-sheet/',
        notes: computationNotesMarkdownExample,
        owner: user2Id.toString(),
      },
    ]
    await Computation.insertMany(computations)
    logger.info('Computations seeded successfully!')

    // Create consortia
    const consortia = [
      {
        _id: consortium1Id,
        title: 'Consortium One',
        description: 'This is the first consortium',
        leader: user1Id,
        members: [user1Id, user2Id, user3Id],
        activeMembers: [user1Id, user2Id, user3Id],
        studyConfiguration: {
          consortiumLeaderNotes: 'Leader notes for Consortium One',
          computationParameters: JSON.stringify({ decimal_places: 2 }),
          computation: {
            title: computations[0].title,
            imageName: computations[0].imageName,
            notes: computations[0].notes,
            imageDownloadUrl: computations[0].imageDownloadUrl,
          },
        },
      },
      {
        _id: consortium2Id,
        title: 'Consortium Two',
        description: 'This is the second consortium',
        leader: user2Id,
        members: [user1Id, user2Id],
        activeMembers: [user1Id, user2Id],
        studyConfiguration: {
          consortiumLeaderNotes: 'Leader notes for Consortium Two',
          computationParameters: JSON.stringify({ decimal_places: 10 }),
          computation: {
            title: computations[1].title,
            imageName: computations[1].imageName,
            imageDownloadUrl: computations[1].imageDownloadUrl,
            notes: computations[1].notes,
          },
        },
      },
    ]
    await Consortium.insertMany(consortia)
    logger.info('Consortia seeded successfully!')

    // Create runs
    const runs = [
      {
        _id: run1Id,
        consortium: consortium1Id,
        consortiumLeader: user1Id,
        studyConfiguration: consortia[0].studyConfiguration,
        members: consortia[0].members,
        status: 'Complete',
        runErrors: [],
        lastUpdated: Date.now(),
      },
      {
        _id: run2Id,
        consortium: consortium2Id,
        consortiumLeader: user2Id,
        studyConfiguration: consortia[1].studyConfiguration,
        members: consortia[1].members,
        status: 'Pending',
        runErrors: [],
        lastUpdated: Date.now(),
      },
      {
        _id: run3Id,
        consortium: consortium1Id,
        consortiumLeader: user1Id,
        studyConfiguration: consortia[0].studyConfiguration,
        members: consortia[0].members,
        status: 'Error',
        runErrors: [
          {
            user: user1Id,
            timestamp: Date.now().toString(),
            message: 'Error message for user 1',
          },
          {
            user: user2Id,
            timestamp: Date.now().toString(),
            message: 'Error message for user 2',
          },
        ],
        lastUpdated: Date.now(),
      },
    ]
    await Run.insertMany(runs)
    logger.info('Runs seeded successfully!')
  } catch (error) {
    logger.error('Failed to seed database:', error)
  } finally {
    await mongoose.connection.close()
  }
}

seedDatabase()