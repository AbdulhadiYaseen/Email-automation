const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const results = [];

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Delay function
const delay = ms => new Promise(res => setTimeout(res, ms));

// Read CSV
fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))

    .on('end', async () => {

        for (const row of results) {

            // Skip already sent emails
            if (row.status === 'sent') continue;

            try {

                await transporter.sendMail({

                    from: process.env.EMAIL_USER,

                    to: row.email.split(';'),

                    subject: 'Application for Software Engineer Opportunity',

                    html: `
<div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 650px;">

  <p>Dear Hiring Team,</p>

  <p>
    I hope you are doing well.
  </p>

  <p>
    My name is <strong>AbdulHadi Yaseen</strong>, and I am a
    Computer Science graduate from <strong>FAST-NUCES</strong>
    with hands-on experience in full-stack web development and
    AI-integrated applications.
  </p>

  <p>
    I am reaching out to express my interest in
    <strong>Software Engineer / Full-Stack Developer</strong>
    opportunities at <strong>${row.company}</strong>.
  </p>

  <p>
    I am very excited about the opportunity to contribute to a
    company like <strong>${row.company}</strong>, where I can
    continue growing as a developer while working on impactful
    real-world products and technologies.
  </p>

  <p>
    Through internships at <strong>10Pearls</strong> and
    <strong>Zehenify</strong>, along with multiple personal
    and AI-integrated projects, I have gained practical experience with
    <strong>MEAN, MERN, Next.js, RAG, web scraping, and automation</strong>.
  </p>

  <p>
    I have worked on full-stack applications, AI chatbot systems,
    authentication systems, databases, and scalable web solutions
    using technologies such as
    <strong>Angular, React, Node.js, MongoDB, and MySQL</strong>.
  </p>

  <p>
    I am currently looking for
    <strong>remote opportunities</strong> and would genuinely value
    the chance to contribute my skills, passion, and strong willingness
    to learn as part of your team.
  </p>

  <p>
    I have attached my resume for your review and would sincerely
    appreciate the opportunity to be considered for any relevant role.
  </p>

  <p>
    Thank you for your time and consideration.
    I look forward to hearing from you.
  </p>

  <br/>

  <div style="line-height: 1.6;">

    <p>
      Best regards,<br/>
      <strong>AbdulHadi Yaseen</strong><br/>
      Karachi, Pakistan
    </p>

    <p>
      📧
      <a href="mailto:abdulhadiyaseen2004@gmail.com"
        style="color: #125E9A; text-decoration: none;">
        abdulhadiyaseen2004@gmail.com
      </a>
    </p>

    <p>
      📞
      <a href="tel:+923260345093"
        style="color: #125E9A; text-decoration: none;">
        +92 326 0345093
      </a>
    </p>

    <p>
      🔗
      <a href="https://www.linkedin.com/in/abdulhadi-yaseen/"
        style="color: #125E9A; text-decoration: none;">
        LinkedIn 
      </a>
    </p>

    <p>
      💻
      <a href="https://github.com/AbdulhadiYaseen"
        style="color: #125E9A; text-decoration: none;">
        GitHub 
      </a>
    </p>

    <p>
      🌐
      <a href="https://abdulhadiyaseen.vercel.app"
        style="color: #125E9A; text-decoration: none;">
        Portfolio
      </a>
    </p>

  </div>

</div>
`,


                    attachments: [
                        {
                            filename: 'AbdulHadi_Yaseen.pdf',
                            path: './AbdulHadi_Yaseen.pdf',
                        },
                    ],

                });

                console.log(`✅ Sent to ${row.company}`);

                // Mark as sent
                row.status = 'sent';

                // Delay between emails
                await delay(12000);

            } catch (err) {

                console.log(`❌ Failed for ${row.company}: ${err.message}`);

            }
        }

        // Rewrite CSV with updated statuses
        const updatedCSV = [
            'company,email,status',
            ...results.map(r => `${r.company},${r.email},${r.status || ''}`)
        ].join('\n');

        fs.writeFileSync('data.csv', updatedCSV);

        console.log('🎉 All emails processed!');

    });
