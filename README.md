# Singapore NRIC Validator - PCF Control

A PowerApps Component Framework (PCF) control for validating Singapore NRIC (National Registration Identity Card) and FIN (Foreign Identification Number) numbers.

## Features

- ✅ Real-time validation of Singapore NRIC/FIN numbers
- ✅ Format validation (prefix, digits, checksum letter)
- ✅ Checksum algorithm verification
- ✅ Auto-formatting (converts to uppercase, removes invalid characters)
- ✅ Visual feedback with color-coded validation messages
- ✅ Supports all NRIC/FIN types: S, T, F, G, M prefixes
- ✅ Read-only mode support
- ✅ 9-character maximum length enforcement

## What is NRIC/FIN?

Singapore NRIC/FIN numbers are unique identification numbers issued to:
- **S prefix**: Singapore Citizens (born before 2000)
- **T prefix**: Singapore Citizens (born from 2000 onwards) and Permanent Residents
- **F prefix**: Foreigners (issued before 2000)
- **G prefix**: Foreigners (issued from 2000 onwards)
- **M prefix**: Foreigners (issued from 2022 onwards)

Format: `[Prefix][7 digits][Checksum Letter]` (e.g., S1234567D)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [.NET Framework 4.6.2 Developer Pack](https://dotnet.microsoft.com/download/dotnet-framework) or later
- [Power Platform CLI](https://aka.ms/PowerAppsCLI)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd SingaporeNricValidator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the component**
   ```bash
   npm run build
   ```

## Development

### Available Scripts

```bash
# Build the control
npm run build

# Start the control in test harness with watch mode
npm run start:watch

# Start the control in test harness
npm run start

# Clean build artifacts
npm run clean

# Rebuild the control
npm run rebuild

# Fix linting issues
npm run lint:fix

# Refresh TypeScript types
npm run refreshTypes
```

### Project Structure

```
SingaporeNricValidator/
├── SingaporeNricValidator/     # PCF component source
│   ├── index.ts                # Main component logic
│   ├── ControlManifest.Input.xml  # Component manifest
│   └── generated/              # Auto-generated type definitions
├── EcellorsSingaporeNRICSolution/  # Solution wrapper for deployment
├── package.json                # NPM dependencies
├── tsconfig.json               # TypeScript configuration
└── eslint.config.mjs           # ESLint configuration
```

## Usage in Power Apps

### Deploying to Power Apps

1. **Build the solution**
   ```bash
   npm run build
   ```

2. **Create a solution package** (using Power Platform CLI)
   ```bash
   pac solution init --publisher-name YourPublisher --publisher-prefix prefix
   pac solution add-reference --path ./
   msbuild /t:build /restore
   ```

3. **Import to Power Apps**
   - Navigate to [Power Apps](https://make.powerapps.com)
   - Go to Solutions
   - Import the generated solution package
   - Publish all customizations

### Adding to a Form

1. Open your model-driven app or form
2. Select the field you want to replace with the NRIC validator
3. Click "Change component" or add a custom field
4. Select "NricValidator"
5. Configure the `nricValue` property to bind to your data field
6. Save and publish your form

### Component Properties

- **nricValue**: Bound text field that stores the NRIC/FIN number

### Validation Messages

- **Valid NRIC/FIN**: Green message "Valid NRIC/FIN."
- **Invalid Format**: Red message "Please enter a valid Singapore NRIC Number"
- **Empty Field**: Gray message "Enter NRIC/FIN."

## How the Validation Works

The control implements the official Singapore NRIC checksum algorithm:

1. **Format Check**: Verifies the format matches `[STFGM][7 digits][Letter]`
2. **Checksum Calculation**:
   - Multiply each digit by weights: [2, 7, 6, 5, 4, 3, 2]
   - Add offset based on prefix (T/G: +4, M: +3)
   - Calculate remainder when divided by 11
   - Compare with expected checksum letter

3. **Checksum Letter Sequences**:
   - S/T (Citizens): J, Z, I, H, G, F, E, D, C, B, A
   - F/G/M (Foreigners): X, W, U, T, R, Q, P, N, M, L, K

## Testing

Try these sample valid NRIC numbers in the test harness:

- S1234567D
- T1234567J
- F1234567N
- G1234567X
  
Model Driven Apps
  <img width="959" height="302" alt="image" src="https://github.com/user-attachments/assets/ad3623d0-2d5b-47c7-b337-29783db81f94" />


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the official Singapore NRIC validation algorithm
- Built with PowerApps Component Framework (PCF)
- Developed for use in Microsoft Power Apps model-driven applications

## Support

For issues, questions, or contributions, please use the GitHub issue tracker.

---

**Note**: This control validates the format and checksum of NRIC/FIN numbers but does not verify if the number is actually issued by the Singapore government. Always verify identity documents through official channels.
