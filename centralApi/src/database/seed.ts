import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import getConfig from '../config/getConfig.js';
import { logger } from '../logger.js';
import Consortium from './models/Consortium.js';
import Computation from './models/Computation.js';
import Run from './models/Run.js';
import User from './models/User.js';
import computationNotesMarkdownExample from './seedContent/computationNotesMarkdownExample.js';
import computationNotesNvflareSsrCsv from './seedContent/computationNotesNvflareSsrCsv.js';
import computationNotesNvflareBoilerplate from './seedContent/computationNotesNvflareBoilerplate.js';
import consortiumLeaderNotesMulitsiteBrainStudy from './seedContent/consortiumLeaderNotesMulitsiteBrainStudy.js';
import computationNotesSingleRoundRidgeRegression from './seedContent/computationNotesSingleRoundRidgeRegression.js';

const { databaseDetails } = await getConfig();
const { url, user, pass } = databaseDetails;
const saltRounds = 10;

// Predefined ObjectIds for relationships and consistency
const predefinedIds = {
    centralUserId: new mongoose.Types.ObjectId('66289c79aebab67040a20067'),
    user1Id: new mongoose.Types.ObjectId('66289c79aebab67040a20068'),
    user2Id: new mongoose.Types.ObjectId('66289c79aebab67040a20069'),
    user3Id: new mongoose.Types.ObjectId('66289c79aebab67040a20070'),
    user4Id: new mongoose.Types.ObjectId('66289c79aebab67040a20071'),
    computation1Id: new mongoose.Types.ObjectId('66289c79aebab67040a21000'),
    computation2Id: new mongoose.Types.ObjectId('66289c79aebab67040a21001'),
    computation3Id: new mongoose.Types.ObjectId('66289c79aebab67040a21002'),
    computation4Id: new mongoose.Types.ObjectId('66289c79aebab67040a21003'),
    consortium2Id: new mongoose.Types.ObjectId('66289c79aecab67040a22001'),
    consortium3Id: new mongoose.Types.ObjectId('66289c79aecab67040a22002'),
    run1Id: new mongoose.Types.ObjectId('66289c79aecab67040a23000'),
    run2Id: new mongoose.Types.ObjectId('66289c79aecab67040a23001'),
    run3Id: new mongoose.Types.ObjectId('66289c79aecab67040a23002'),
};

// Define data
const users = [
    { _id: predefinedIds.user1Id, username: 'user1', hash: await bcrypt.hash('password1', saltRounds) },
    { _id: predefinedIds.user2Id, username: 'user2', hash: await bcrypt.hash('password2', saltRounds) },
    { _id: predefinedIds.user3Id, username: 'user3', hash: await bcrypt.hash('password3', saltRounds) },
    { _id: predefinedIds.user4Id, username: 'user4', hash: await bcrypt.hash('password4', saltRounds), roles: ['admin'] },
    { _id: predefinedIds.centralUserId, username: 'centralUser', hash: await bcrypt.hash('centralPassword', saltRounds), roles: ['central'] },
];

const computations = [
    {
        _id: predefinedIds.computation1Id,
        title: 'NVFLARE boilerplate average',
        imageName: 'boilerplate_average_app',
        imageDownloadUrl: 'https://example.com/boilerplate_average_app',
        notes: computationNotesNvflareBoilerplate,
        owner: predefinedIds.user1Id.toString(),
    },
    {
        _id: predefinedIds.computation2Id,
        title: 'Markdown Example',
        imageName: 'markdown_example',
        imageDownloadUrl: 'https://www.markdownguide.org/cheat-sheet/',
        notes: computationNotesMarkdownExample,
        owner: predefinedIds.user2Id.toString(),
    },
    {
        _id: predefinedIds.computation3Id,
        title: 'Single Round Ridge Regression',
        imageName: 'dylanrmartin/computations:single_round_ridge_regression-748881be1c0b5b75efdd363485193d7d310d8df9',
        imageDownloadUrl: 'https://hub.docker.com/layers/dylanrmartin/computations/single_round_ridge_regression-748881be1c0b5b75efdd363485193d7d310d8df9/images/sha256-3a7e61e8e10f7d59571dfa8526c9a84d3e48727fdd8c12923fc02c896543e004?context=repo',
        notes: computationNotesSingleRoundRidgeRegression,
        owner: predefinedIds.user3Id.toString(),
    },
    {
        _id: predefinedIds.computation4Id,
        title: 'NVFlare SSR CSV',
        imageName: 'coinstacteam/nvflare-ssr-csv',
        imageDownloadUrl: 'https://hub.docker.com/repository/docker/coinstacteam/nvflare-ssr-csv',
        notes: computationNotesNvflareSsrCsv,
        owner: predefinedIds.user1Id.toString(),
    },
];

const consortia = [
    {
        _id: predefinedIds.consortium2Id,
        title: 'Single Round Ridge Regression Consortium',
        description: 'Test consortium for single round ridge regression',
        leader: predefinedIds.user2Id,
        members: [predefinedIds.user1Id, predefinedIds.user2Id],
        activeMembers: [predefinedIds.user1Id, predefinedIds.user2Id],
        studyConfiguration: {
            consortiumLeaderNotes: 'Leader notes for Consortium Two',
            computationParameters: JSON.stringify({
                Covariates: ['MDD', 'Age', 'Sex', 'ICV'],
                Dependents: ['L_hippo', 'R_hippo', 'Tot_hippo'],
            }),
            computation: computations[2], // Matches "Single Round Ridge Regression"
        },
    },
    {
        _id: predefinedIds.consortium3Id,
        title: 'Multisite Brain Study',
        description: 'Exploring connections between Hippocampal measurements and MDD, Age, Sex, and ICV',
        leader: predefinedIds.user1Id,
        members: [predefinedIds.user1Id, predefinedIds.user2Id],
        activeMembers: [predefinedIds.user1Id, predefinedIds.user2Id],
        studyConfiguration: {
            consortiumLeaderNotes: consortiumLeaderNotesMulitsiteBrainStudy,
            computationParameters: JSON.stringify({
                Dependents: { L_hippo: 'int', R_hippo: 'int', Tot_hippo: 'int' },
                Covariates: { MDD: 'bool', Age: 'int', Sex: 'int', ICV: 'int' },
                Lambda: 0,
            }),
            computation: computations[3], // Matches "NVFlare SSR CSV"
        },
    },
];

const runs = [
    {
        _id: predefinedIds.run1Id,
        consortium: predefinedIds.consortium2Id,
        consortiumLeader: predefinedIds.user2Id,
        studyConfiguration: consortia[0].studyConfiguration,
        members: consortia[0].members,
        status: 'Complete',
        runErrors: [],
        createdAt: new Date(),
        lastUpdated: new Date(),
    },
    {
        _id: predefinedIds.run2Id,
        consortium: predefinedIds.consortium3Id,
        consortiumLeader: predefinedIds.user1Id,
        studyConfiguration: consortia[1].studyConfiguration,
        members: consortia[1].members,
        status: 'Pending',
        runErrors: [],
        createdAt: new Date(),
        lastUpdated: new Date(),
    },
    {
        _id: predefinedIds.run3Id,
        consortium: predefinedIds.consortium2Id,
        consortiumLeader: predefinedIds.user2Id,
        studyConfiguration: consortia[0].studyConfiguration,
        members: consortia[0].members,
        status: 'Error',
        runErrors: [
            { user: predefinedIds.user1Id, timestamp: new Date().toISOString(), message: 'Error message for user 1' },
            { user: predefinedIds.user2Id, timestamp: new Date().toISOString(), message: 'Error message for user 2' },
        ],
        createdAt: new Date(),
        lastUpdated: new Date(),
    },
];

// Seeding Function
const seedDatabase = async () => {
    try {
        await mongoose.connect(url, { user, pass, authSource: 'admin' });
        logger.info('MongoDB connected successfully.');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Consortium.deleteMany({}),
            Computation.deleteMany({}),
            Run.deleteMany({}),
        ]);

        // Insert seed data
        await User.insertMany(users);
        logger.info('Users seeded successfully!');
        
        await Computation.insertMany(computations);
        logger.info('Computations seeded successfully!');
        
        await Consortium.insertMany(consortia);
        logger.info('Consortia seeded successfully!');
        
        // await Run.insertMany(runs);
        // logger.info('Runs seeded successfully!');
        
    } catch (error) {
        logger.error('Failed to seed database:', error);
    } finally {
        await mongoose.connection.close();
    }
};

seedDatabase();
