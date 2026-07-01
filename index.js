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

          subject: 'Application for Software Developer (Full Stack/Ai)',

          html: `
<div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 650px;">

  <p>Dear Hiring Team,</p>

  <p>
    I am AbdulHadi Yaseen, a recent Computer Science graduate from FAST-NUCES. I am writing to express my strong interest in the Software Developer with AI expertise position. Having built several AI-integrated web applications, I am looking to work in a professional environment where I can grow, and I am confident in my ability to contribute to the company’s success.
  </p>

  <p>
    My experience includes developing autonomous multi-agent orchestration platforms using LLM and building AI-driven forecasting systems with Next.js and Node.js. I possess deep expertise in the MEAN & MERN stack and have successfully implemented complex Agentic AI workflows and RAG systems, which align perfectly with the requirements for a developer with AI specialization.
  </p>

  <p>
    I have attached my resume for your review and would welcome the opportunity to discuss how my full-stack development and AI integration skills can be of benefit to your company.
  </p>

  <p>
    Sincerely,<br/>
    AbdulHadi Yaseen
  </p>

  <div style="line-height: 1.6; margin-top: 15px;">
    <p style="margin: 4px 0;">📞 +92 326 0345093</p>
    <p style="margin: 4px 0;">
      📧 <a href="mailto:abdulhadiyaseen2004@gmail.com" style="color: #125E9A; text-decoration: none;">abdulhadiyaseen2004@gmail.com</a>
    </p>
    <p style="margin: 4px 0;">
      🔗 <a href="https://www.linkedin.com/in/abdulhadi-yaseen" style="color: #125E9A; text-decoration: none;">https://www.linkedin.com/in/abdulhadi-yaseen</a>
    </p>
    <p style="margin: 4px 0;">
      💻 <a href="https://github.com/AbdulhadiYaseen" style="color: #125E9A; text-decoration: none;">https://github.com/AbdulhadiYaseen</a>
    </p>
    <p style="margin: 4px 0;">
      🌐 <a href="http://abdulhadiyaseen.vercel.app" style="color: #125E9A; text-decoration: none;">http://abdulhadiyaseen.vercel.app</a>
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

        console.log(`✅ Sent to ${row.email}`);

        // Mark as sent
        row.status = 'sent';

        // Delay between emails
        await delay(12000);

      } catch (err) {

        console.log(`❌ Failed for ${row.email}: ${err.message}`);

      }
    }

    // Rewrite CSV with updated statuses
    const updatedCSV = [
      'email,status',
      ...results.map(r => `${r.email},${r.status || ''}`)
    ].join('\n');

    fs.writeFileSync('data.csv', updatedCSV);

    console.log('🎉 All emails processed!');

  });
