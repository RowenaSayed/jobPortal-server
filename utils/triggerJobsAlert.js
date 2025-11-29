const JobAlert = require("../models/JobAlert");
const Notification = require("../models/Notification");
const sendEmail = require("./email");
const { jobAlertTemplate } = require("./emailTemplates");
const {User} = require("../models/User");

async function triggerJobAlerts(job) {
    const alerts = await JobAlert.find({
        $or: [
            { keywords: { $in: job.title.split(" ") } },
            { keywords: { $in: job.skills } }
        ],
        ...(job.location && { location: job.location }),
        ...(job.jobType && { jobType: job.jobType }),
        ...(job.experienceLevel && { experienceLevel: job.experienceLevel })
    });

    for (const alert of alerts) {

        // ====== CREATE IN-APP NOTIFICATION ======
        if (alert.in_app_notification) {
            await Notification.create({
                user: alert.user,
                job_id: job._id,
                message: `New job matching your alerts: ${job.title}`
            });
        }

        // ====== SEND EMAIL NOTIFICATION ======
        if (alert.email_notification) {
            const user = await User.findById(alert.user);

            await sendEmail(
                user.email,
                `New Job Matching Your Preferences: ${job.title}`,
                jobAlertTemplate(job, user.name)
            );
        }
    }
}

module.exports = triggerJobAlerts;
