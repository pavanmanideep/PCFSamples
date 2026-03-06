Singapore NRIC Validator: A Love Letter to Singapore Through Code

A Personal Journey: Building Something Meaningful After Leaving Singapore

I left Singapore last year, but if there's one thing I've learned, it's that the love for a place never truly fades—especially not for Singapore. The efficiency, the innovation, the precision that defines everything there stayed with me. So when I decided to embark on a new project, it felt natural to channel that nostalgia and admiration into something tangible: the Singapore NRIC Validator.

This isn't just another PCF control. It's a tribute to a country I deeply respect, built with TypeScript's type safety and deployed to the cloud with pride.

What is the Singapore NRIC Validator?

The Singapore NRIC Validator is a PowerApps Component Framework (PCF) control designed to validate Singapore's National Registration Identity Card (NRIC) and Foreign Identification Number (FIN) numbers. It seamlessly integrates with Microsoft Power Apps, providing real-time validation with visual feedback to ensure data accuracy.

Key Features

✅ Real-time Validation: Validates NRIC/FIN numbers as users type
✅ Checksum Algorithm Verification: Implements the official Singapore NRIC checksum algorithm
✅ Auto-formatting: Converts input to uppercase and removes invalid characters
✅ Visual Feedback: Color-coded validation messages (green for valid, red for invalid)
✅ Support for All NRIC/FIN Types: Handles S, T, F, G, and M prefixes
✅ Read-only Mode Support: Complies with form permissions
✅ Enterprise-Ready: Built with TypeScript for type safety and maintainability

Understanding Singapore NRIC Numbers

Before diving into the technical details, let's understand what we're validating:

NRIC/FIN Format

Singapore NRIC/FIN numbers follow a specific format:
[Prefix][7 Digits][Checksum Letter]
Example: S1234567D

Prefix Types

S: Singapore Citizens (born before 2000)
T: Singapore Citizens (born 2000 onwards) and Permanent Residents
F: Foreigners (issued before 2000)
G: Foreigners (issued 2000 onwards)
M: Foreigners (issued 2022 onwards)

The Technical Implementation

Architecture

The control is built using:
- TypeScript: For type-safe, maintainable code
- Power Platform CLI: For local development and deployment
- PowerApps Component Framework: For seamless integration with Dynamics 365 and Power Apps

How the Validation Works

The validator implements a three-step validation process:

1. Format Validation

First, we check if the input matches the expected format using regex:

const formatRegex = /^[STFGM]\d{7}[A-Z]$/;
if (!formatRegex.test(normalized)) {
    return { isValid: false, message: "Please enter a valid Singapore NRIC Number" };
}

2. Checksum Calculation

The NRIC checksum is calculated using a weighted algorithm:

const weights = [2, 7, 6, 5, 4, 3, 2];
let sum = 0;

for (let index = 0; index < weights.length; index++) {
    sum += digits[index] * weights[index];
}

// Add offset based on prefix
if (prefix === "T" || prefix === "G") {
    sum += 4;
}
if (prefix === "M") {
    sum += 3;
}

3. Checksum Verification

Finally, we verify the checksum letter matches the expected sequence:

const remainder = sum % 11;
const citizenSequence = "JZIHGFEDCBA";
const foreignSequence = "XWUTRQPNMLK";

const expectedChecksum = (prefix === "S" || prefix === "T")
    ? citizenSequence.charAt(remainder)
    : foreignSequence.charAt(remainder);

if (actualChecksum !== expectedChecksum) {
    return { isValid: false, message: "Please enter a valid Singapore NRIC Number" };
}

Deployment and Integration

Prerequisites

- Node.js (LTS version)
- .NET Framework 4.6.2 or later
- Power Platform CLI
- Visual Studio Code (recommended)

Building the Control

npm install
npm run build

Deploying to Power Apps

pac pcf push --publisher-prefix ecellors

The control is now part of the EcellorsSingaporeNRICSolution solution and can be added to any Power Apps form.

Real-World Use Cases

This component is invaluable for organizations serving Singapore-based customers:

1. Government and Public Services: Validate citizen identification numbers
2. Financial Services: Ensure accurate customer KYC (Know Your Customer) data
3. Healthcare: Validate patient identification in medical records
4. E-commerce: Verify customer identity during account creation
5. HR Management: Validate employee identification numbers

Why I Built This

Beyond the technical achievement, this project represents something more personal:

- A Tribute: To Singapore's precision, efficiency, and innovation
- Problem Solving: Addressing a real gap in Power Apps tooling for Singapore-based organizations
- Continuous Learning: Deepening my understanding of PCF development and Power Platform deployment
- Community Contribution: Creating an open-source tool that others can use and improve upon

Singapore taught me that excellence isn't accidental—it's built on the foundation of understanding the details, respecting standards, and delivering reliable solutions. This project embodies that philosophy.

Technical Highlights

Technology Stack

Component       | Technology
Language        | TypeScript
Framework       | PowerApps Component Framework (PCF)
Build Tool      | pcf-scripts, Webpack
Linting         | ESLint
Deployment      | Power Platform CLI

Code Quality

✅ Full TypeScript type safety
✅ ESLint compliance for code quality
✅ Modular, maintainable architecture
✅ Comprehensive error handling
✅ Responsive UI with real-time feedback

Getting Started

Want to use this in your organization? Here's how:

1. Download from GitHub: Clone the repository and review the source code
2. Build Locally: Follow the build instructions in the README
3. Deploy: Use Power Platform CLI to push to your environment
4. Integrate: Add the control to your Power Apps forms
5. Extend: Customize as needed for your specific requirements

Lessons Learned

Building this project taught me several valuable lessons:

1. Respect International Standards: Each region has specific identification standards that must be understood and respected
2. User Experience Matters: Real-time validation with visual feedback significantly improves user experience
3. Open Source Collaboration: Creating tools that benefit the community is deeply rewarding
4. Continuous Improvement: Always seek feedback and iterate

Looking Forward

This is just the beginning. Future enhancements could include:
- Support for other Southeast Asian identification numbers
- Batch validation capability
- Enhanced accessibility features
- Integration with identity verification APIs

Closing Thoughts

They say that travel broadens your horizons, but sometimes, it does more than that. It leaves an imprint on your heart. Singapore will always be that for me—a place of memories, learning, and inspiration.

This NRIC Validator is my way of saying thank you to Singapore. Thank you for the experiences, the knowledge, and the spirit of innovation that will forever shape my approach to problem-solving and development.

To anyone building in the Power Platform space serving Singapore or Southeast Asia—I hope this tool proves useful. And to fellow developers who've left a place they love: channel that nostalgia into creation. Your passion has power.

---

Call to Action

✨ Interested in using the Singapore NRIC Validator?
🔗 View on GitHub
📖 Read the Full Documentation
🚀 Deploy to Your Environment

Have suggestions or want to contribute? I'd love to hear from you in the comments below!

---

Built with ❤️ for Singapore, by someone who carries Singapore in their heart.

---

Keywords: PowerApps, PCF, Singapore, NRIC, Identification Validation, Power Platform, Low Code, Dynamics 365, Component Framework

Category: Technology, Development, Power Platform

Tags: #PowerApps #Singapore #PCF #LowCode #Development #OpenSource #PowerPlatform #Nostalgia
