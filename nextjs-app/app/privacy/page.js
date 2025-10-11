'use client';

import React from 'react';
import Link from 'next/link';
import '../globals.css';

export default function PrivacyPolicy() {
  return (
    <div className="app">
      <header className="header">
        <h1>Privacy Policy</h1>
        <p>Last Updated: October 11, 2025</p>
      </header>

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '40px 20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>1. Introduction</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            This Privacy Policy explains how the Naturalization Reactions Dashboard 
            ("we", "our", or "the Service") collects, uses, and protects data from the 
            Dutch government's public consultation platform at internetconsultatie.nl.
          </p>
          <p style={{ lineHeight: '1.8', color: '#555', marginTop: '10px' }}>
            This dashboard is a research and analytical tool created to visualize and analyze 
            public opinions submitted to the Dutch government's consultation on naturalization 
            term extensions. This service is not affiliated with the Dutch government.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>2. Legal Basis for Processing</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            We process data under the following legal bases:
          </p>
          <ul style={{ lineHeight: '1.8', color: '#555', marginLeft: '20px' }}>
            <li><strong>Legitimate Interest (GDPR Article 6(1)(f)):</strong> Research, 
            analysis, and public interest in understanding public opinion on government policy.</li>
            <li><strong>Public Data:</strong> All data is sourced from public submissions 
            to a government consultation platform where users voluntarily made their opinions public.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>3. What Data We Collect</h2>
          <p style={{ lineHeight: '1.8', color: '#555', marginBottom: '10px' }}>
            We collect and display the following data from public consultation submissions:
          </p>
          <ul style={{ lineHeight: '1.8', color: '#555', marginLeft: '20px' }}>
            <li><strong>Location/City:</strong> Place of residence (as publicly submitted)</li>
            <li><strong>Date:</strong> Date of submission</li>
            <li><strong>Opinion Classification:</strong> Whether the opinion is "For" or "Against" 
            the proposal (determined by AI analysis)</li>
            <li><strong>Language:</strong> Primary language of the submission (Dutch, English, or Other)</li>
          </ul>
          <p style={{ lineHeight: '1.8', color: '#555', marginTop: '15px' }}>
            <strong>Note:</strong> Names from original submissions are <u>NOT</u> displayed 
            in this dashboard. Full opinion texts are analyzed but not publicly displayed.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>4. How We Collect Data</h2>
          <ul style={{ lineHeight: '1.8', color: '#555', marginLeft: '20px' }}>
            <li><strong>Source:</strong> internetconsultatie.nl - Dutch government public consultation platform</li>
            <li><strong>Method:</strong> Automated daily collection of publicly available submissions</li>
            <li><strong>Frequency:</strong> Data is updated daily at 9:00 PM CET via automated process</li>
            <li><strong>Permission:</strong> The source website explicitly allows data reuse. See:
              <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                <li><a href="https://www.overheid.nl/informatie-hergebruiken" target="_blank" rel="noopener noreferrer" 
                style={{ color: '#2196F3' }}>Data Reuse Policy</a> - Official policy on information reuse</li>
                <li><a href="https://data.overheid.nl/sites/default/files/dataset/d0cca537-44ea-48cf-9880-fa21e1a7058f/resources/HandleidingSRU2.0.pdf" 
                target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3' }}>Technical API Documentation (PDF)</a> - 
                SRU 2.0 webservice handbook for developers</li>
              </ul>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>5. How We Use Data</h2>
          <ul style={{ lineHeight: '1.8', color: '#555', marginLeft: '20px' }}>
            <li>Display aggregate statistics (total opinions, stance distribution)</li>
            <li>Visualize geographic distribution of opinions across the Netherlands</li>
            <li>Show trends over time</li>
            <li>Analyze language distribution of submissions</li>
            <li>Provide insights into public sentiment on naturalization policy</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>6. Third-Party Processing</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            We use the following third-party services:
          </p>
          <ul style={{ lineHeight: '1.8', color: '#555', marginLeft: '20px' }}>
            <li><strong>Google Gemini AI:</strong> Used to analyze and classify opinions 
            (stance, language, immigrant identification). Submission texts are sent to 
            Google's API for analysis but are not stored by Google.</li>
            <li><strong>Vercel:</strong> Hosting and deployment platform</li>
            <li><strong>GitHub:</strong> Version control and automated data pipeline</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>7. Data Retention</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            Data is retained for the duration of the consultation period and subsequent 
            analysis. Historical data may be maintained for research purposes. Data older 
            than 2 years may be archived or deleted at our discretion.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>8. Your Rights (GDPR)</h2>
          <p style={{ lineHeight: '1.8', color: '#555', marginBottom: '10px' }}>
            Under GDPR, you have the following rights:
          </p>
          <ul style={{ lineHeight: '1.8', color: '#555', marginLeft: '20px' }}>
            <li><strong>Right to Access:</strong> Request a copy of data we hold about you</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to 
            legitimate interest assessment)</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in machine-readable format</li>
          </ul>
          <p style={{ lineHeight: '1.8', color: '#555', marginTop: '15px' }}>
            <strong>Important:</strong> Since all data is sourced from a public government 
            platform where you voluntarily made submissions public, our ability to remove 
            data may be limited by legitimate research interests. To remove your original 
            submission, please contact internetconsultatie.nl directly.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>9. Cookies and Analytics</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            This website uses Vercel Analytics to collect anonymous usage statistics 
            (page views, visitor count). No personal identifying information is collected 
            through analytics. No cookies are used for tracking.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>10. Data Security</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            We implement appropriate technical and organizational measures to protect data:
          </p>
          <ul style={{ lineHeight: '1.8', color: '#555', marginLeft: '20px' }}>
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure hosting on Vercel's infrastructure</li>
            <li>Access controls on data processing systems</li>
            <li>Regular security updates and monitoring</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>11. Data Subject Requests</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            To exercise your GDPR rights or request information about data processing, 
            please contact us at: <strong>[darshxm@gmail.com]</strong>
          </p>
          <p style={{ lineHeight: '1.8', color: '#555', marginTop: '10px' }}>
            We will respond to requests within 30 days as required by GDPR.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>12. Children's Privacy</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            This service is not directed at children under 16. We do not knowingly collect 
            data from children.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>13. International Data Transfers</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            Data may be processed outside the EU/EEA through our third-party services 
            (Google, Vercel, GitHub). These providers comply with appropriate data 
            protection frameworks (e.g., EU-US Data Privacy Framework, Standard Contractual Clauses).
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>14. Complaints</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            If you believe we are not complying with data protection law, you have the 
            right to lodge a complaint with the Dutch Data Protection Authority 
            (Autoriteit Persoonsgegevens): 
            <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" 
            style={{ color: '#2196F3', marginLeft: '5px' }}>
              autoriteitpersoonsgegevens.nl
            </a>
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>15. Changes to This Policy</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            We may update this privacy policy from time to time. Changes will be posted 
            on this page with an updated "Last Updated" date.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>16. Contact Information</h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            For questions about this privacy policy or data processing:
          </p>
          <p style={{ lineHeight: '1.8', color: '#555', marginTop: '10px' }}>
            <strong>Email:</strong> [darshxm@gmail.com]<br />
            <strong>Project:</strong> Naturalization Reactions Dashboard<br />
            <strong>GitHub:</strong><a href="https://github.com/darshxm" target="_blank" rel="noopener noreferrer" 
            style={{ color: '#2196F3', marginLeft: '5px' }}>
              github.com/darshxm
            </a>
          </p>
        </section>

        <div style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '2px solid #e0e0e0',
          textAlign: 'center' 
        }}>
          <Link href="/" style={{ 
            color: '#2196F3', 
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
