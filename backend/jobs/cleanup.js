/**
 * cleanup.js
 * * This file contains the scheduled cron job for cleaning up old data
 * from the database.
 */

const cron = require('node-cron');
const Tournament = require('../models/Tournament');

// This function defines and schedules the cleanup task.
const initScheduledJobs = () => {
    
    // Schedule a task to run at 2:00 AM every day.
    // The cron format is: 'minute hour day-of-month month day-of-week'
    const scheduledJob = cron.schedule('0 2 * * *', async () => {
        console.log('Running scheduled job: Cleaning up expired tournaments...');
        
        try {
            const now = new Date();
            
            // Find all tournaments where the 'endDate' is before the current time.
            const result = await Tournament.deleteMany({ endDate: { $lt: now } });
            
            if (result.deletedCount > 0) {
                console.log(`Successfully deleted ${result.deletedCount} expired tournaments.`);
            } else {
                console.log('No expired tournaments found to delete.');
            }
        } catch (err) {
            console.error('Error during scheduled tournament cleanup:', err);
        }
    });

    // Start the scheduled job
    scheduledJob.start();
    console.log('Tournament cleanup job scheduled to run daily at 2:00 AM.');
};

module.exports = initScheduledJobs;
