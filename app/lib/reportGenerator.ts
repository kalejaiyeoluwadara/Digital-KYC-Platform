import { UserData, TrustScore } from "@/app/types";
import moment from "moment";
import { toast } from "sonner";

interface GenerateReportParams {
  userData: UserData;
  trustScore: TrustScore;
  walletId: string;
}

export const generateVerificationReport = ({
  userData,
  trustScore,
  walletId,
}: GenerateReportParams): void => {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    toast.error("Please allow popups to download the report");
    return;
  }

  const reportHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Verification Report - ${userData.email || "User"}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            color: #000;
          }
          .header p {
            margin: 10px 0 0 0;
            color: #666;
          }
          .trust-score {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .trust-score h2 {
            margin: 0 0 10px 0;
            font-size: 48px;
            color: #000;
          }
          .trust-score p {
            margin: 0;
            color: #666;
          }
          .section {
            margin: 30px 0;
          }
          .section h3 {
            font-size: 18px;
            margin: 0 0 15px 0;
            color: #000;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
          }
          .verification-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .verification-item:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #333;
          }
          .value {
            color: #666;
          }
          .verified {
            color: #22c55e;
            font-weight: 600;
          }
          .breakdown {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 20px;
          }
          .breakdown-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .breakdown-item h4 {
            margin: 0 0 5px 0;
            font-size: 24px;
            color: #000;
          }
          .breakdown-item p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          @media print {
            body {
              margin: 0;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        ${generateReportHeader()}
        ${generateTrustScoreSection(trustScore)}
        ${generateVerifiedInfoSection(userData, trustScore)}
        ${generateBreakdownSection(trustScore)}
        ${generateRefereeSection(userData)}
        ${generateFooter(walletId)}
        ${generatePrintScript()}
      </body>
    </html>
  `;

  reportWindow.document.write(reportHTML);
  reportWindow.document.close();
  toast.success("Opening verification report...");
};

const generateReportHeader = (): string => `
  <div class="header">
    <h1>Digital Identity Verification Report</h1>
    <p>Generated on ${moment().format("MMMM DD, YYYY [at] h:mm A")}</p>
  </div>
`;

const generateTrustScoreSection = (trustScore: TrustScore): string => `
  <div class="trust-score">
    <h2>${trustScore.total}</h2>
    <p>Overall Trust Score</p>
  </div>
`;

const generateVerifiedInfoSection = (
  userData: UserData,
  trustScore: TrustScore
): string => `
  <div class="section">
    <h3>Verified Information</h3>
    <div class="verification-item">
      <span class="label">Email Address</span>
      <span class="value">${userData.email || "Not provided"}</span>
    </div>
    <div class="verification-item">
      <span class="label">Email Verification</span>
      <span class="${trustScore.breakdown.email > 0 ? "verified" : "value"}">${
  trustScore.breakdown.email > 0 ? "✓ Verified" : "Not verified"
}</span>
    </div>
    <div class="verification-item">
      <span class="label">Physical Address</span>
      <span class="value">${userData.address || "Not provided"}</span>
    </div>
    <div class="verification-item">
      <span class="label">Address Verification</span>
      <span class="${
        trustScore.breakdown.address > 0 ? "verified" : "value"
      }">${
  trustScore.breakdown.address > 0 ? "✓ Verified" : "Not verified"
}</span>
    </div>
    <div class="verification-item">
      <span class="label">Social Profiles Connected</span>
      <span class="value">${
        Object.values(userData.socialProfiles || {}).filter(Boolean).length
      }</span>
    </div>
    <div class="verification-item">
      <span class="label">Social Verification</span>
      <span class="${trustScore.breakdown.social > 0 ? "verified" : "value"}">${
  trustScore.breakdown.social > 0 ? "✓ Verified" : "Not verified"
}</span>
    </div>
    <div class="verification-item">
      <span class="label">Verified Referees</span>
      <span class="value">${
        userData.referees?.filter((r) => r.verified).length || 0
      } of ${userData.referees?.length || 0}</span>
    </div>
    <div class="verification-item">
      <span class="label">Referee Verification</span>
      <span class="${
        trustScore.breakdown.referee > 0 ? "verified" : "value"
      }">${
  trustScore.breakdown.referee > 0 ? "✓ Verified" : "Not verified"
}</span>
    </div>
  </div>
`;

const generateBreakdownSection = (trustScore: TrustScore): string => `
  <div class="section">
    <h3>Trust Score Breakdown</h3>
    <div class="breakdown">
      <div class="breakdown-item">
        <h4>${trustScore.breakdown.email}</h4>
        <p>Email Score</p>
      </div>
      <div class="breakdown-item">
        <h4>${trustScore.breakdown.address}</h4>
        <p>Address Score</p>
      </div>
      <div class="breakdown-item">
        <h4>${trustScore.breakdown.social}</h4>
        <p>Social Score</p>
      </div>
      <div class="breakdown-item">
        <h4>${trustScore.breakdown.referee}</h4>
        <p>Referee Score</p>
      </div>
    </div>
  </div>
`;

const generateRefereeSection = (userData: UserData): string => {
  if (!userData.referees || userData.referees.length === 0) {
    return "";
  }

  const refereeItems = userData.referees
    .map(
      (referee, idx) => `
    <div class="verification-item">
      <span class="label">${idx + 1}. ${referee.name}</span>
      <span class="${referee.verified ? "verified" : "value"}">${
        referee.verified ? "✓ Verified" : "Pending"
      }</span>
    </div>
    <div style="padding: 5px 0 15px 20px; color: #666; font-size: 14px;">
      Email: ${referee.email}<br>
      Phone: ${referee.phone}
    </div>
  `
    )
    .join("");

  return `
    <div class="section">
      <h3>Reference Details</h3>
      ${refereeItems}
    </div>
  `;
};

const generateFooter = (walletId: string): string => `
  <div class="footer">
    <p>This is an official verification report generated by Digital KYC Platform</p>
    <p>Report ID: ${walletId}</p>
    <p>This document is valid as of ${moment().format("MMMM DD, YYYY")}</p>
  </div>
`;

const generatePrintScript = (): string => `
  <script>
    window.onload = function() {
      window.print();
    }
  </script>
`;
