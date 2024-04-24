import mongoose from 'mongoose';
import Consortium from './models/Consortium.js';
import Computation from './models/Computation.js';
import Run from './models/Run.js';
import User from './models/User.js';
import getConfig from '../config/getConfig.js';
import bcrypt from 'bcrypt';

const { databaseDetails } = getConfig();
const { url, user, pass } = databaseDetails;
const saltRounds = 10;

const seedDatabase = async () => {
  try {
    await mongoose.connect(url, { user, pass, authSource: 'admin'});
    console.log('MongoDB connected successfully.');

    await User.deleteMany({});
    await Consortium.deleteMany({});
    await Computation.deleteMany({});
    await Run.deleteMany({});

    const users = [
      { username: 'user1', hash: await bcrypt.hash('password1', saltRounds) },
      { username: 'user2', hash: await bcrypt.hash('password2', saltRounds) }
    ];
    const createdUsers = await User.insertMany(users);
    console.log('Users seeded successfully!');

    const computations = [
      { title: 'Computation A', imageName: 'compA.png', notes: 'Notes for Computation A' },
      { title: 'Computation B', imageName: 'compB.png', notes: 'Notes for Computation B' }
    ];
    const createdComputations = await Computation.insertMany(computations);
    console.log('Computations seeded successfully!');

    const consortia = [
      {
        title: 'Consortium One',
        description: 'This is the first consortium',
        leader: createdUsers[0]._id,
        members: [createdUsers[0]._id],
        activeMembers: [createdUsers[0]._id],
        studyConfiguration: {
          consortiumLeaderNotes: 'Leader notes for Consortium One',
          computationParameters: JSON.stringify({ parameter: 'value' }),
          computation: {
            title: createdComputations[0].title, // only selected fields if necessary
            imageName: createdComputations[0].imageName,
            notes: createdComputations[0].notes
          }
        }
      },
      {
        title: 'Consortium Two',
        description: 'This is the second consortium',
        leader: createdUsers[1]._id,
        members: [createdUsers[1]._id],
        activeMembers: [createdUsers[1]._id],
        studyConfiguration: {
          consortiumLeaderNotes: 'Leader notes for Consortium Two',
          computationParameters: JSON.stringify({ parameter: 'value' }),
          computation: {
            title: createdComputations[1].title,
            imageName: createdComputations[1].imageName,
            notes: createdComputations[1].notes
          }
        }
      }
    ];
    await Consortium.insertMany(consortia);
    console.log('Consortia seeded successfully!');

    const runs = [
      {
        consortiumLeader: createdUsers[0]._id,
        studyConfiguration: consortia[0].studyConfiguration,
        members: consortia[0].members,
        status: 'Active',
        runErrors: ['Error encountered during processing Run 1.']
      },
      {
        consortiumLeader: createdUsers[1]._id,
        studyConfiguration: consortia[1].studyConfiguration,
        members: consortia[1].members,
        status: 'Pending',
        runErrors: []
      }
    ];
    await Run.insertMany(runs);
    console.log('Runs seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await mongoose.connection.close();
  }
};


seedDatabase();
