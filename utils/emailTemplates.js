function jobAlertTemplate(job, userName) {
    return `
    <div style="font-family: Arial; padding: 20px; color: #333;">
        <h2>Hello ${userName},</h2>
        <p>A new job that matches your alert settings has been posted:</p>

        <h3 style="color:#2b5091;">${job.title}</h3>
        <p><strong>Location:</strong> ${job.location || "Not specified"}</p>
        <p><strong>Experience:</strong> ${job.experienceLevel || "Not specified"}</p>
        <p><strong>Job Type:</strong> ${job.jobType || "Not specified"}</p>

        <a href="https://yourfrontend.com/job/${job._id}" 
           style="display:inline-block; margin-top:15px; padding:10px 15px; background:#2b5091; color:white; text-decoration:none; border-radius:5px;">
           View Job
        </a>

        <p style="margin-top:30px;">You are receiving this email because you created job alerts.</p>
    </div>
    `;
}

module.exports = { jobAlertTemplate };
